import SERVICES from './services';
import './index.css';
import { debounce } from 'debounce';
import { API , PatternPasteEventDetail } from '@editorjs/editorjs';

/**
 * @description Embed Tool data
 */
interface EmbedData {
  /** Service name */
  service: string;
  /** Source URL of embedded content */
  source: string;
  /** URL to source embed page */
  embed: string;
  /** Embedded content width */
  width?: number;
  /** Embedded content height */
  height?: number;
  /** Content caption */
  caption?: string;
}

/**
 * @description Service configuration object
 */
interface Service {
  /** Pattern of source URLs */
  regex: RegExp;
  /** URL scheme to embedded page. Use '<%= remote_id %>' to define a place to insert resource id */
  embedUrl: string;
  /** Iframe which contains embedded content */
  html: string;
  /** Function to get resource id from RegExp groups */
  id?: (ids: string[]) => string;
  /** Embedded content width */
  width?: number;
  /** Embedded content height */
  height?: number;
}

/**
 * @description Embed tool configuration object
 */
interface EmbedConfig {
  /** Additional services provided by user */
  services?: { [key: string]: Service | boolean };
}

/**
 * @description CSS object
 */
interface CSS {
  /** Base class for CSS */
  baseClass: string;
  /** CSS class for input */
  input: string;
  /** CSS class for container */
  container: string;
  /** CSS class for loading container */
  containerLoading: string;
  /** CSS class for preloader */
  preloader: string;
  /** CSS class for caption */
  caption: string;
  /** CSS class for URL */
  url: string;
  /** CSS class for content */
  content: string;
}

interface ConstructorArgs {
  // data — previously saved data
  data: EmbedData;
  // api - Editor.js API
  api: API;
  // readOnly - read-only mode flag
  readOnly: boolean;
}

/**
 * @class Embed
 * @classdesc Embed Tool for Editor.js 2.0
 *
 * @property {object} api - Editor.js API
 * @property {EmbedData} _data - private property with Embed data
 * @property {HTMLElement} element - embedded content container
 *
 * @property {object} services - static property with available services
 * @property {object} patterns - static property with patterns for paste handling configuration
 */
export default class Embed {
  /** Editor.js API */
  private api: API;
  /** Private property with Embed data */
  private _data: EmbedData;
  /** Embedded content container */
  private element: HTMLElement | null;
  /** Read-only mode flag */
  private readOnly: boolean;
  /** Static property with available services */
  static services: { [key: string]: Service };
  /** Static property with patterns for paste handling configuration */
  static patterns: { [key: string]: RegExp };
  /**
   * @param {{data: EmbedData, config: EmbedConfig, api: object}}
   *   data — previously saved data
   *   config - user config for Tool
   *   api - Editor.js API
   *   readOnly - read-only mode flag
   */
  constructor({ data, api, readOnly }: ConstructorArgs) {
    this.api = api;
    this._data = {} as EmbedData;
    this.element = null;
    this.readOnly = readOnly;

    this.data = data;
  }

  /**
   * @param {EmbedData} data - embed data
   * @param {RegExp} [data.regex] - pattern of source URLs
   * @param {string} [data.embedUrl] - URL scheme to embedded page. Use '<%= remote_id %>' to define a place to insert resource id
   * @param {string} [data.html] - iframe which contains embedded content
   * @param {number} [data.height] - iframe height
   * @param {number} [data.width] - iframe width
   * @param {string} [data.caption] - caption
   */
  set data(data: EmbedData) {
    if (!(data instanceof Object)) {
      throw Error('Embed Tool data should be object');
    }

    const { service, source, embed, width, height, caption = '' } = data;

    this._data = {
      service: service || this.data.service,
      source: source || this.data.source,
      embed: embed || this.data.embed,
      width: width || this.data.width,
      height: height || this.data.height,
      caption: caption || this.data.caption || '',
    };

    const oldView = this.element;

    if (oldView) {
      oldView.parentNode?.replaceChild(this.render(), oldView);
    }
  }

  /**
   * @returns {EmbedData}
   */
  get data(): EmbedData {
    if (this.element) {
      const caption = this.element.querySelector(`.${this.api.styles.input}`) as HTMLElement;

      this._data.caption = caption ? caption.innerHTML : '';
    }

    return this._data;
  }

  /**
   * Get plugin styles
   *
   * @returns {object}
   */
  get CSS(): CSS {
    return {
      baseClass: this.api.styles.block,
      input: this.api.styles.input,
      container: 'embed-tool',
      containerLoading: 'embed-tool--loading',
      preloader: 'embed-tool__preloader',
      caption: 'embed-tool__caption',
      url: 'embed-tool__url',
      content: 'embed-tool__content',
    };
  }

  /**
   * Render Embed tool content
   *
   * @returns {HTMLElement}
   */
  render(): HTMLElement {
    if (!this.data.service) {
      const container = document.createElement('div');

      this.element = container;

      return container;
    }

    const { html } = Embed.services[this.data.service];
    const container = document.createElement('div');
    const caption = document.createElement('div');
    const template = document.createElement('template');
    const preloader = this.createPreloader();

    container.classList.add(this.CSS.baseClass, this.CSS.container, this.CSS.containerLoading);
    caption.classList.add(this.CSS.input, this.CSS.caption);

    container.appendChild(preloader);

    caption.contentEditable = (!this.readOnly).toString();
    caption.dataset.placeholder = this.api.i18n.t('Enter a caption');
    caption.innerHTML = this.data.caption || '';

    template.innerHTML = html;
    (template.content.firstChild as HTMLElement).setAttribute('src', this.data.embed);
    (template.content.firstChild as HTMLElement).classList.add(this.CSS.content);

    const embedIsReady = this.embedIsReady(container);

    if (template.content.firstChild) {
      container.appendChild(template.content.firstChild);
    }
    container.appendChild(caption);

    embedIsReady
      .then(() => {
        container.classList.remove(this.CSS.containerLoading);
      });

    this.element = container;

    return container;
  }

  /**
   * Creates preloader to append to container while data is loading
   *
   * @returns {HTMLElement}
   */
  createPreloader(): HTMLElement {
    const preloader = document.createElement('preloader');
    const url = document.createElement('div');

    url.textContent = this.data.source;

    preloader.classList.add(this.CSS.preloader);
    url.classList.add(this.CSS.url);

    preloader.appendChild(url);

    return preloader;
  }

  /**
   * Save current content and return EmbedData object
   *
   * @returns {EmbedData}
   */
  save(): EmbedData {
    return this.data;
  }

  /**
   * Handle pasted url and return Service object
   *
   * @param {PasteEvent} event - event with pasted data
   */
  onPaste(event: { detail: PatternPasteEventDetail }) {
    const { key: service, data: url } = event.detail;

    const { regex, embedUrl, width, height, id = (ids) => ids.shift() || '' } = Embed.services[service];
    const result = regex.exec(url)?.slice(1);
    const embed = result ? embedUrl.replace(/<%= remote_id %>/g, id(result)) : '';

    this.data = {
      service,
      source: url,
      embed,
      width,
      height,
    };
  }

  /**
   * Analyze provided config and make object with services to use
   *
   * @param {EmbedConfig} config - configuration of embed block element
   */
  static prepare({ config = {} } : {config: EmbedConfig}) {
    const { services = {} } = config;

    let entries = Object.entries(SERVICES);

    const enabledServices = Object
      .entries(services)
      .filter(([key, value]) => {
        return typeof value === 'boolean' && value === true;
      })
      .map(([ key ]) => key);

    const userServices = Object
      .entries(services)
      .filter(([key, value]) => {
        return typeof value === 'object';
      })
      .filter(([key, service]) => Embed.checkServiceConfig(service as Service))
      .map(([key, service]) => {
        const { regex, embedUrl, html, height, width, id } = service as Service;

        return [key, {
          regex,
          embedUrl,
          html,
          height,
          width,
          id,
        } ] as [string, Service];
      });

    if (enabledServices.length) {
      entries = entries.filter(([ key ]) => enabledServices.includes(key));
    }

    entries = entries.concat(userServices);

    Embed.services = entries.reduce<{ [key: string]: Service }>((result, [key, service]) => {
      if (!(key in result)) {
        result[key] = service as Service;

        return result;
      }

      result[key] = Object.assign({}, result[key], service);

      return result;
    }, {});

    Embed.patterns = entries
      .reduce<{ [key: string]: RegExp }>((result, [key, item]) => {
        result[key] = item.regex as RegExp;

        return result;
      }, {});
  }

  /**
   * Check if Service config is valid
   *
   * @param {Service} config - configuration of embed block element
   * @returns {boolean}
   */
  static checkServiceConfig(config: Service): boolean {
    const { regex, embedUrl, html, height, width, id } = config;

    let isValid = Boolean(regex && regex instanceof RegExp) &&
      Boolean(embedUrl && typeof embedUrl === 'string') &&
      Boolean(html && typeof html === 'string');

    isValid = isValid && (id !== undefined ? id instanceof Function : true);
    isValid = isValid && (height !== undefined ? Number.isFinite(height) : true);
    isValid = isValid && (width !== undefined ? Number.isFinite(width) : true);

    return isValid;
  }

  /**
   * Paste configuration to enable pasted URLs processing by Editor
   *
   * @returns {object} - object of patterns which contain regx for pasteConfig
   */
  static get pasteConfig() {
    return {
      patterns: Embed.patterns,
    };
  }

  /**
   * Notify core that read-only mode is supported
   *
   * @returns {boolean}
   */
  static get isReadOnlySupported() {
    return true;
  }

  /**
   * Checks that mutations in DOM have finished after appending iframe content
   *
   * @param {HTMLElement} targetNode - HTML-element mutations of which to listen
   * @returns {Promise<any>} - result that all mutations have finished
   */
  embedIsReady(targetNode: HTMLElement): Promise<void> {
    const PRELOADER_DELAY = 450;

    let observer: MutationObserver;

    return new Promise((resolve, reject) => {
      observer = new MutationObserver(debounce(resolve, PRELOADER_DELAY));
      observer.observe(targetNode, {
        childList: true,
        subtree: true,
      });
    }).then(() => {
      observer.disconnect();
    });
  }
}

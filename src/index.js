const SERVICES = require('./services');

/**
 * @typedef {Object} EmbedData
 * @description Embed Tool data
 * @property {string} key - service key
 * @property {string} url - source URL of embedded content
 * @property {string} embed - URL to source embed page
 * @property {number} [width] - embedded content width
 * @property {number} [height] - embedded content height
 * @property {string} [caption] - content caption
 *
 * @typedef {Object} Service
 * @description Service configuration object
 * @property {RegExp} regex - pattern of source URLs
 * @property {string} embedUrl - URL scheme to embedded page. Use '<%= remote_id %>' to define a place to insert resource id
 * @property {string} html - iframe which contains embedded content
 * @property {number} [height] - iframe height
 * @property {number} [width] - iframe width
 * @property {Function} [id] - function to get resource id from RegExp groups
 *
 * @typedef {Object} EmbedConfig
 * @description Embed tool configuration object
 * @property {Object} [services] - additional services provided by user. Each property should contain Service object
 * @property {string[]} [whitelist] - array of services to use
 * @property {string[]} [blacklist] - array of services to exclude
 */

/**
 * @class Embed
 * @classdesc Embed Tool for CodeX Editor 2.0
 *
 * @property {Object} api - CodeX Editor API
 * @property {EmbedData} _data - private property with Embed data
 * @property {HTMLElement} element - embedded content container
 *
 * @property {Object} services - static property with available services
 * @patterns {Object} patterns - static property with patterns for paste handling configuration
 */
class Embed {
  /**
   * @param {{data: EmbedData, config: EmbedConfig, api: object}}
   *   data — previously saved data
   *   config - user config for Tool
   *   api - CodeX Editor API
   */
  constructor({data, api}) {
    this.api = api;
    this._data = {};
    this.element = null;

    this.data = data;
  }

  /**
   * @param {EmbedData} data
   * @param {RegExp} [data.regex] - pattern of source URLs
   * @param {string} [data.embedUrl] - URL scheme to embedded page. Use '<%= remote_id %>' to define a place to insert resource id
   * @param {string} [data.html] - iframe which contains embedded content
   * @param {number} [data.height] - iframe height
   * @param {number} [data.width] - iframe width
   * @param {string} [data.caption] - caption
   */
  set data(data) {
    if (!data instanceof Object) {
      throw Error('Embed Tool data should be object');
    }

    const {key, source, embed, width, height, caption = ''} = data;

    this._data = {
      key: this.data.key || key,
      source: this.data.source || source,
      embed: this.data.embed || embed,
      width: this.data.width || width,
      height: this.data.height || height,
      caption: this.data.caption || caption
    };
  }

  /**
   * @return {EmbedData}
   */
  get data() {
    return this._data;
  }

  /**
   * Render Embed tool content
   *
   * @return {HTMLElement}
   */
  render() {
    const {html} = Embed.services[this.data.key];
    const container = document.createElement('div');
    const caption = document.createElement('div');
    const template = document.createElement('template');

    caption.contentEditable = true;
    caption.classList.add(this.api.styles.input);
    caption.dataset.placeholder = 'Enter a caption';
    caption.innerHTML = this.data.caption;

    template.innerHTML = html;
    template.content.firstChild.setAttribute('src', this.data.embed);
    template.content.firstChild.classList.add(this.api.styles.block);

    container.appendChild(template.content.firstChild);
    container.appendChild(caption);

    this.element = container;

    return container;
  }

  /**
   * Save current content and return EmbedData object
   *
   * @return {EmbedData}
   */
  save() {
    const caption = this.element.querySelector(`.${this.api.styles.input}`);

    this.data = {caption: caption.innerHTML};
    return this.data;
  }

  /**
   * Handle pasted url and return Service object
   *
   * @param {string} url - pasted URL
   * @param {string} key - service key
   * @return {Service}
   */
  static pasteHandler(url, key) {
    const {regex, embedUrl, width, height, id = (ids) => ids.shift()} = Embed.services[key];
    const result = regex.exec(url).slice(1);
    const embed = embedUrl.replace(/<\%\= remote\_id \%\>/g, id(result));

    return {
      key,
      source: url,
      embed,
      width,
      height
    };
  }

  /**
   * Analyze provided config and make object with services to use
   *
   * @param {EmbedConfig} config
   */
  static prepare({config}) {
    let {services = {}, whitelist = [], blacklist = []} = config;

    let entries = Object.entries(SERVICES);

    /**
     * Add services provided by user
     */
    entries.concat(Object.entries(services)
      .filter(([key, service]) => Embed.checkServiceConfig(service))
      .map(([key, service]) => {
        const {regex, embedUrl, html, height, width, id} = service;

        return [key, {
          regex,
          embedUrl,
          html,
          height,
          width,
          id
        } ];
      }));

    /**
     * Filter in accordance with black and white lists
     */
    if (whitelist instanceof Array && whitelist.length) {
      entries = entries.filter(([ key ]) => whitelist.includes(key));
    }
    if (blacklist instanceof Array && blacklist.length) {
      entries = entries.filter(([ key ]) => !blacklist.includes(key));
    }

    Embed.services = entries.reduce((result, [key, service]) => {
      if (!(key in result)) {
        result[key] = service;
        return result;
      }

      result[key] = Object.assign({}, result[key], service);
      return result;
    }, {});

    Embed.patterns = entries
      .reduce((result, [key, item]) => {
        result[key] = item.regex;

        return result;
      }, {});
  }

  /**
   * Check if Service config is valid
   *
   * @param {Service} config
   * @return {boolean}
   */
  static checkServiceConfig(config) {
    const {regex, embedUrl, html, height, width, id} = config;

    let isValid = regex && regex instanceof RegExp
      && embedUrl && embedUrl instanceof String
      && html && html instanceof String;

    isValid = isValid && (id !== undefined ? id instanceof Function : true);
    isValid = isValid && (height !== undefined ? Number.isFinite(height) : true);
    isValid = isValid && (width !== undefined ? Number.isFinite(width) : true);

    return isValid;
  }

  /**
   * OnPaste configuration to enable pasted URLs processing by CodeX Editor
   */
  static get onPaste() {
    return {
      patterns: Embed.patterns,
      patternHandler: Embed.pasteHandler
    };
  }
}

module.exports = Embed;

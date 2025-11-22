
/**
 * @description Service configuration object
 */
export interface ServiceConfig {
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
 * @description Type for services configuration
 */
export type ServicesConfigType = { [key: string]: ServiceConfig | boolean };
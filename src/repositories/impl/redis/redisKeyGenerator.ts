import config from 'config';
export class RedisKeyGenerator {
  // Prefix that all keys will start with, taken from config.json
  static prefix = config.get('dataStores.redis.keyPrefix');
  /**
   * Takes a string containing a Redis key name and returns a
   * string containing that key with the application's configurable
   * prefix added to the front.  Prefix is configured in config.json.
   *
   * @param {string} key - a Redis key
   * @returns {string} - a Redis key with the application prefix prepended to
   *  the value of 'key'
   */
  static async getKey(key: string): Promise<string> { return `${this.prefix}:${key}`; }
  /**
   * Takes a numeric site ID and returns the site information key
   * value for that ID.
   *
   * Key name: prefix:sites:info:[siteId]
   * Redis type stored at this key: hash
   *
   * @param {number} siteId - the numeric ID of a site.
   * @returns - the site information key for the provided site ID.
   */
  static async getSiteHashKey(siteId: number): Promise<string> { return `${this.prefix}:sites:info:${siteId}` }
  /**
 * Returns the Redis key name used for the set storing all site IDs.
 *
 * Key name: prefix:sites:ids
 * Redis type stored at this key: set
 *
 * @returns - the Redis key name used for the set storing all site IDs.
 */
  static async getSiteIDsKey(): Promise<string> { return `${this.prefix}:sites:ids` }

  /**
  * Returns the Redis key used to store geo information for sites.
  *
  * Key name: prefix:sites:geo
  * Redis type stored at this key: geo
  *
  * @returns {string} - the Redis key used to store site geo information.
  */
  static async getSiteGeoKey(): Promise<string> { return `${this.prefix}:sites:geo`; }
  /**
   * Set the global key prefix, overriding the one set in config.json.
   *
   * This is used by the test suites so that test keys do not overlap
   * with real application keys and can be safely deleted afterwards.
   *
   * @param {*} newPrefix - the new key prefix to use.
   */
  static async setPrefix(newPrefix: string) { this.prefix = newPrefix; }
}

import { Site } from '../domain/site'
//import * as impl from './impl/redis/site_dao_redis_impl';
export interface SiteRepository {
  flushDB(): Promise<string>;
  /**
       * Insert a new site.
       *
       * @param {Object} site - a site object.
       * @returns {Promise} - a Promise, resolving to the string value
       *   for the ID of the site in the database.
       */

  insert(site: Site): Promise<string>;
  /**
   * Get the site object for a given site ID.
   *
   * @param {number} id - a site ID.
   * @returns {Promise} - a Promise, resolving to a site object.
   */
  findById(id: number): Promise<Site>;
  /**
  * Get an array of all site objects.
  *
  * @returns {Promise} - a Promise, resolving to an array of site objects.
  */
  findAll(): Promise<Site[]>;
  /**
    /**
  * Get an array of all site objects.
  *
  * @returns {Promise} - a Promise, resolving to an array of site objects.
  */
  findAllWithGeo(): Promise<Site[]>;
  /**
* Get an array of sites within a radius of a given coordinate.
*
* @param {number} lat - Latitude of the coordinate to search from.
* @param {number} lng - Longitude of the coordinate to search from.
* @param {number} radius - Radius in which to search.
* @param {'KM' | 'MI'} radiusUnit - The unit that the value of radius is in.
* @returns {Promise} - a Promise, resolving to an array of site objects.
*/
  findByGeo(lat: number, lng: number, radius: number, radiusUnit: "ft" | "m" | "km" | "mi"): Promise<Site[]>;
} 

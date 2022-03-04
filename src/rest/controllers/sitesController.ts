import { Response, NextFunction, Request } from "express";
import { InvalidSiteError } from "../../domain/invalidSiteError";
import { Site } from "../../domain/site";
import { SiteNotFoundError, SitesNotFoundError } from "../../domain/siteNotFoundError";
import { SiteRepository } from "../../repositories/siteRepository";
import { ValidationError } from "./validationError";
export class SitesController {
    constructor(private siteRepository: SiteRepository) { }
    async createSite(request: Request, response: Response, next: NextFunction) {
        try {
            if (request.body) {
                const site = new Site(request.body);
                const siteId = await this.siteRepository.insert(site);
                response.status(201).json(siteId);
            }
        }
        catch (error) {
            if (error instanceof InvalidSiteError)
                next(new ValidationError(error.message));
            else
                next(error);
        }
    }
    /**
     * Retrieve all sites from the database.
     *
     * @returns {Promise} - a Promise that resolves to an array of site objects.
     */
    async getSites(request: Request, response: Response, next: NextFunction) {
        try {
            const sites = await this.siteRepository.findAllWithGeo();
            response.status(200).json(sites);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Retrieve an individual site from the database.
     *
     * @param {number} siteId - the numeric ID of the site to retrieve.
     * @returns {Promise} - a Promise that resolves to a site object.
     */
    async getSite(request: Request, response: Response, next: NextFunction) {
        try {
            if (request.params?.id) {
                const id = parseInt(request.params.id, 10);
                if (id > 0) {
                    const site = await this.siteRepository.findById(id);
                    if (site) {
                        response.status(200).json(site);
                    }
                    else {
                        next(new SiteNotFoundError());
                    }
                }
                else next(new ValidationError("id should be a valid integer"));
            }
            else next(new ValidationError("id should be a valid integer"));
        } catch (error) {
            next(error);
        }
    }
    /**
     * Retrieve sites that are within a specified distance of a coordinate,
     * optionally filtering so that only sites having excess capacity are
     * returned.
     *
     * @param {number} lat - the latitude of the center point to search from.
     * @param {number} lng - the longitude of the center point to search from.
     * @param {number} radius - the geo search radius.
     * @param {string} radiusUnit - the unit that radius is specified in ('mi', 'km).
     * @returns {Promise} - a Promise that resolves to an array of site objects.
     */
    async sitesNearBy(request: Request, response: Response, next: NextFunction) {
        try {

            const lng = (request.query?.lng) ? parseFloat(request.query.lng as string) : null;
            const lat = (request.query?.lat) ? parseFloat(request.query.lat as string) : null;
            const radius = (request.query?.radius) ? parseInt(request.query.radius as string) : 0;
            const radiusUnit = (request.query?.radiusUnit) ? request.query.radiusUnit as "mi" | "ft" | "m" | "km" : 'mi';
            if (lng && lat) {
                if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
                    const sites = await this.siteRepository.findByGeo(lat, lng, radius, radiusUnit);
                    if (sites.length > 0)
                        response.status(200).json(sites);
                    else {
                        next(new SitesNotFoundError());
                    }
                }
                else
                    throw new ValidationError('coordinate should be valid')
            }
            else next(new ValidationError("invalid Request"));

        } catch (error) {
            next(error);
        }


    }
}
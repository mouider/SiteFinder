import { SiteRepository } from '../../siteRepository';
import { Site } from '../../../domain/site';
import { RedisKeyGenerator } from './redisKeyGenerator';
export class RedisSiteRepository implements SiteRepository {

    constructor(private client:any) {

    }
    public async flushDB(): Promise<string> {
        
        return await this.client.flushDb();
    }
    public async findByGeo(lat: number, lng: number, radius: number, radiusUnit: "ft" | "m" | "km" | "mi"): Promise<Site[]> {
         const SiteGeoKey = await RedisKeyGenerator.getSiteGeoKey();
        const sites = [];
        const siteIds = await this.client.geoSearch(SiteGeoKey, { longitude: lng, latitude: lat }, {
            radius: radius,
            unit: radiusUnit
        }
        );
        for (const siteId of siteIds) {
            const siteHashKey = await RedisKeyGenerator.getSiteHashKey(parseInt(siteId, 10));
            const siteHash = await this.client.hGetAll(siteHashKey)
            const flattenedSite = { ...siteHash };
            sites.push(new Site(flattenedSite));
        }
        return sites;
    }
    public async insert(site: Site): Promise<string> {
        
        //await redis.connect();
        const siteHashKey = await RedisKeyGenerator.getSiteHashKey(site.Id);
        if (site.coordinate) {
            await this.client.geoAdd(await RedisKeyGenerator.getSiteGeoKey(), {
                member: site.Id.toString(),
                longitude: site.coordinate.lng,
                latitude: site.coordinate.lat
            });
        }
        const flattenedSite = site.toFlat();
        const siteIDsKey = await RedisKeyGenerator.getSiteIDsKey();
        await this.client.hSet(siteHashKey, flattenedSite);
        await this.client.sAdd(siteIDsKey, siteHashKey);
        return siteHashKey;
    }
    public async findById(id: number): Promise<Site> {
         // await redis.connect();
        const siteHashKey = await RedisKeyGenerator.getSiteHashKey(id);
        const siteHash = await this.client.hGetAll(siteHashKey);
        const flattendHash = { ...siteHash }
        return Object.prototype.hasOwnProperty.call(flattendHash, 'id') ? new Site({ ...siteHash }) : null;
    }
    public async findAll(): Promise<Site[]> {

        const sites = [];
        const SiteIDsKey = await RedisKeyGenerator.getSiteIDsKey()
        const siteIds = await this.client.sMembers(SiteIDsKey);
        for (const siteId of siteIds) {
            const siteHash = await this.client.hGetAll(siteId)
            const flattenedSite = { ...siteHash };
            sites.push(new Site(flattenedSite));
        }
        return sites;
    }
    public async findAllWithGeo(): Promise<Site[]> {
        const sites = [];
        const SiteGeoKey = await RedisKeyGenerator.getSiteGeoKey();
        const siteIds = await this.client.zRange(SiteGeoKey, 0, -1);
        for (const siteId of siteIds) {
            const siteHashKey = await RedisKeyGenerator.getSiteHashKey(parseInt(siteId, 10));
            const siteHash = await this.client.hGetAll(siteHashKey)
            const flattenedSite = { ...siteHash };
            sites.push(new Site(flattenedSite));
        }
        return sites;
    }
}
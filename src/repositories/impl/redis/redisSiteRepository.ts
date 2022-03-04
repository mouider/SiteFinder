import { SiteRepository } from '../../siteRepository';
import { Site } from '../../../domain/site';
import { RedisKeyGenerator } from './redisKeyGenerator';
import * as redis_client from '../../../../src/repositories/impl/redis/redis_client';
export class RedisSiteRepository implements SiteRepository {

    constructor(private client: typeof redis_client) {

    }
    public async flushDB(): Promise<string> {
        const redis = this.client.getClient();
        await redis.connect();
        return await redis.flushDb();
    }
    public async findByGeo(lat: number, lng: number, radius: number, radiusUnit: "ft" | "m" | "km" | "mi"): Promise<Site[]> {
        const redis = this.client.getClient();
        await redis.connect();
        const SiteGeoKey = await RedisKeyGenerator.getSiteGeoKey();
        const sites = [];
        const siteIds = await redis.geoSearch(SiteGeoKey, { longitude: lng, latitude: lat }, {
            radius: radius,
            unit: radiusUnit
        }
        );
        for (const siteId of siteIds) {
            const siteHashKey = await RedisKeyGenerator.getSiteHashKey(parseInt(siteId, 10));
            const siteHash = await redis.hGetAll(siteHashKey)
            const flattenedSite = { ...siteHash };
            sites.push(new Site(flattenedSite));
        }
        return sites;
    }
    public async insert(site: Site): Promise<string> {
        const redis = this.client.getClient();
        await redis.connect();
        const siteHashKey = await RedisKeyGenerator.getSiteHashKey(site.Id);
        if (site.coordinate) {
            await redis.geoAdd(await RedisKeyGenerator.getSiteGeoKey(), {
                member: site.Id.toString(),
                longitude: site.coordinate.lng,
                latitude: site.coordinate.lat
            });
        }
        const flattenedSite = site.toFlat();
        const siteIDsKey = await RedisKeyGenerator.getSiteIDsKey();
        await redis.hSet(siteHashKey, flattenedSite);
        await redis.sAdd(siteIDsKey, siteHashKey);
        return siteHashKey;
    }
    public async findById(id: number): Promise<Site> {
        const redis = this.client.getClient();
        await redis.connect();
        const siteHashKey = await RedisKeyGenerator.getSiteHashKey(id);
        const siteHash = await redis.hGetAll(siteHashKey);
        const flattendHash = { ...siteHash }
        return Object.prototype.hasOwnProperty.call(flattendHash, 'id') ? new Site({ ...siteHash }) : null;
    }
    public async findAll(): Promise<Site[]> {
        const redis = this.client.getClient();
        await redis.connect();
        const sites = [];
        const SiteIDsKey = await RedisKeyGenerator.getSiteIDsKey()
        const siteIds = await redis.sMembers(SiteIDsKey);
        for (const siteId of siteIds) {
            const siteHash = await redis.hGetAll(siteId)
            const flattenedSite = { ...siteHash };
            sites.push(new Site(flattenedSite));
        }
        return sites;
    }
    public async findAllWithGeo(): Promise<Site[]> {
        const redis = this.client.getClient();
        await redis.connect();
        const sites = [];
        const SiteGeoKey = await RedisKeyGenerator.getSiteGeoKey();
        const siteIds = await redis.zRange(SiteGeoKey, 0, -1);
        for (const siteId of siteIds) {
            const siteHashKey = await RedisKeyGenerator.getSiteHashKey(parseInt(siteId, 10));
            const siteHash = await redis.hGetAll(siteHashKey)
            const flattenedSite = { ...siteHash };
            sites.push(new Site(flattenedSite));
        }
        return sites;
    }
}
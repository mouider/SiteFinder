import { RedisSiteRepository } from "./repositories/impl/redis/redisSiteRepository";
import { Application } from "./rest/application";
import { SitesController } from "./rest/controllers/sitesController";
import { ImportSitesController } from "./rest/controllers/importController";
import { Route } from "./rest/routes/route";
import { CreateSitesRoute } from "./rest/routes/createSiteRoute";
import { ImportSitesRoute } from "./rest/routes/importSitesRoute";
import * as redis_client from './repositories/impl/redis/redis_client';
import { GetSitesRoute } from "./rest/routes/getSitesRoute";
import { GetSiteByIdRoute } from "./rest/routes/getSiteByIdRoute";
import { SitesNearBy } from "./rest/routes/sitesNearBy";
const siteRepository = new RedisSiteRepository(redis_client);
const siteController = new SitesController(siteRepository);
const importSitesController = new ImportSitesController(siteRepository);
const sitesRoute = new CreateSitesRoute(siteController);
const getSitesRoute = new GetSitesRoute(siteController);
const getSiteByIdRoute = new GetSiteByIdRoute(siteController);
const sitesNearBy = new SitesNearBy(siteController);
const importSites = new ImportSitesRoute(importSitesController);
const routeList: Route[] = [];
routeList.push(sitesRoute);
routeList.push(getSitesRoute);
routeList.push(getSiteByIdRoute);
routeList.push(sitesNearBy);
routeList.push(importSites);
const application: Application = new Application(routeList);
application.startServerOnPort(parseInt(process.env.PORT) | 3000);
export default application
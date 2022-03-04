import { Application } from "express";
import { SitesController } from "../controllers/sitesController";
import { Route } from "./route";

export class GetSiteByIdRoute implements Route {
    constructor(private sitesController: SitesController) { }
    mountRoute(application: Application): void {
        application.route("/api/v1/sites/:id")
            .get(this.sitesController.getSite.bind(this.sitesController));
    }
}
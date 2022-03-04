import { Application } from "express";
import { SitesController } from "../controllers/sitesController";
import { Route } from "./route";

export class SitesNearBy implements Route {
    constructor(private sitesController: SitesController) { }
    mountRoute(application: Application): void {
        application.route("/api/v1/sitesnearby/")
            .get(this.sitesController.sitesNearBy.bind(this.sitesController));

    }

}
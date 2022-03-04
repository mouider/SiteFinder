import { Application } from "express";
import { SitesController } from "../controllers/sitesController";
import { Route } from "./route";

export class GetSitesRoute implements Route {
    constructor(private sitesController: SitesController) { }
    mountRoute(application: Application): void {
        application.route("/api/v1/sites")
            .get(this.sitesController.getSites.bind(this.sitesController));


    }

}
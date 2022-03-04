import { Application } from "express";
import { SitesController } from "../controllers/sitesController";
import { Route } from "./route";

export class CreateSitesRoute implements Route {
    constructor(private sitesController: SitesController) { }
    mountRoute(application: Application): void {
        application.route("/api/v1/sites")
            .post(this.sitesController.createSite.bind(this.sitesController));
    }
}
import { Application } from "express";
import { ImportSitesController } from "../controllers/importController";
import { Route } from "./route";

export class ImportSitesRoute implements Route {
    constructor(private importController: ImportSitesController) { }
    mountRoute(application: Application): void {
        application.route("/api/v1/import")
            .get(this.importController.import.bind(this.importController));
    }

}
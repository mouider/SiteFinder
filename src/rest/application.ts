import express from "express";
import path from "path";
import { apiErrorHandler } from "./middelwares/apiErrorHandler";
import { Route } from "./routes/route";
export class Application {
    public app: express.Application = express();
    constructor(private routeList: Route[]) {
        this.appconfig();
        this.mountRoutes();
    }
    private mountRoutes() {
        this.routeList.forEach(route => route.mountRoute(this.app));
        this.app.use(apiErrorHandler);
    }
    private appconfig() {
        this.app.use(express.static(path.join(__dirname, '../../public')));
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
    }
    startServerOnPort(port: number): void {
        this.app.listen(port, () => {
            console.info(`listening on port:${port}`);
        })
    }
}


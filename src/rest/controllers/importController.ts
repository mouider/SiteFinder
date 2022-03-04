import path from 'path';
import { Response, NextFunction, Request } from "express";
import { Site } from "../../domain/site";
import { SiteRepository } from "../../repositories/siteRepository";
export class ImportSitesController {
    constructor(private siteRepository: SiteRepository) { }
    private async loadData(filename: string, flushDb: boolean) {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const sampleData = require(filename);
        if (sampleData && flushDb) {
            console.log('Flushing database before loading sample data.');
            await this.siteRepository.flushDB();
        }
        console.log('Loading data.');
        for (const site of sampleData) {
            await this.siteRepository.insert(new Site(site));
            console.log('inserted data:' + site);
        }
    }
    async import(request: Request, response: Response, next: NextFunction) {
        const filename = 'sites.json';
        try {
            await this.loadData(path.resolve(__dirname, '../../ressources/data', filename), true);
            response.status(200).json(`success loading ${filename}`);
        } catch (e) {
            console.error(`Error loading ${filename}:`);
            console.error(e);
            next(e);
        }

    }
}
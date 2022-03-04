import { Request, NextFunction, Response } from "express";
import { SiteNotFoundError, SitesNotFoundError } from "../../domain/siteNotFoundError";
import { ValidationError } from "../controllers/validationError";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function apiErrorHandler(error: Error, request: Request, response: Response, next: NextFunction) {
    if (error instanceof ValidationError) {
        response.status(400).json({
            title: error.name,
            message: error.message
        });
    }
    else if (error instanceof SitesNotFoundError || error instanceof SiteNotFoundError) {
        response.status(404).json({
            title: error.name,
            message: error.message
        });
    }
    else if (error instanceof Error) {
        response.status(500).json({
            title: 'InternalError',
            message: error.message
        })

    }

}
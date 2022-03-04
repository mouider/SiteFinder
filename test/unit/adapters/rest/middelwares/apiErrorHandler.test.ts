import { NextFunction,request,Request,response,Response } from "express";
import { SiteNotFoundError, SitesNotFoundError } from "../../../../../src/domain/siteNotFoundError";
import { ValidationError } from "../../../../../src/rest/controllers/validationError";
import { apiErrorHandler } from "../../../../../src/rest/middelwares/apiErrorHandler"

describe ('apiErrorHandler',()=>{
it('return error with 400 when Validation Error',async()=>{
    const req:Request=expect.any(request);
    const res:Response=expect.any(response);
    res.status=jest.fn().mockReturnThis();
    res.json=jest.fn();
    const next:NextFunction=jest.fn();
    const error:ValidationError=new ValidationError('validation error');
    const expectedJson={title:error.name , message:'validation error',};
    await apiErrorHandler(error,req,res,next)
    expect(res.status).toBeCalledTimes(1); 
    expect(res.status).toBeCalledWith(400);
    expect(res.json).toBeCalledTimes(1); 
    expect(res.json).toBeCalledWith(expectedJson);
    });
    it('return error with 404 when SitesNotFoundError ',async()=>{
        const req:Request=expect.any(request);
        const res:Response=expect.any(response);
        res.status=jest.fn().mockReturnThis();
        res.json=jest.fn();
        const next:NextFunction=jest.fn();
        const error:SitesNotFoundError=new SitesNotFoundError();
        const expectedJson={title:error.name , message:'sites not found',};
        await apiErrorHandler(error,req,res,next)
        expect(res.status).toBeCalledTimes(1); 
        expect(res.status).toBeCalledWith(404);
        expect(res.json).toBeCalledTimes(1); 
        expect(res.json).toBeCalledWith(expectedJson);
       
     })
     it('return error with 404 when  SiteNotFoundError Error',async()=>{
        const req:Request=expect.any(request);
        const res:Response=expect.any(response);
        res.status=jest.fn().mockReturnThis();
        res.json=jest.fn();
        const next:NextFunction=jest.fn();
        const error:SiteNotFoundError=new SiteNotFoundError();
        const expectedJson={title:error.name , message:'site not found',};
        await apiErrorHandler(error,req,res,next)
        expect(res.status).toBeCalledTimes(1); 
        expect(res.status).toBeCalledWith(404);
        expect(res.json).toBeCalledTimes(1); 
        expect(res.json).toBeCalledWith(expectedJson);
     })
     it("should Return InternalError within 500 StatusCode",async()=>{
        const req:Request=expect.any(request);
        const res:Response=expect.any(response);
        res.status=jest.fn().mockReturnThis();
        res.json=jest.fn();
        const next:NextFunction=jest.fn();
        const error:Error=new Error('Internal Server Error');
        const expectedJson={title:'InternalError' , message:'Internal Server Error',};
        await apiErrorHandler(error,req,res,next)
        expect(res.status).toBeCalledTimes(1); 
        expect(res.status).toBeCalledWith(500);
        expect(res.json).toBeCalledTimes(1); 
        expect(res.json).toBeCalledWith(expectedJson);
       })

})
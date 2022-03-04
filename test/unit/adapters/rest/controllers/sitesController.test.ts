import { NextFunction,request,Request,response,Response } from "express";
import querystring from 'query-string';
import { Site } from "../../../../../src/domain/site";
import { SiteNotFoundError, SitesNotFoundError } from "../../../../../src/domain/siteNotFoundError";
import { SiteRepository } from "../../../../../src/repositories/siteRepository";
import { SitesController } from "../../../../../src/rest/controllers/sitesController";
import { ValidationError } from "../../../../../src/rest/controllers/validationError";
describe('sitesController tests',()=>{
    it("should throw an error when send an invalid site id ",()=>{
    const req: Request=expect.any(request);
    req.body= {
        id: NaN,
        capacity: 5.5,
        panels: 4,
        address: '910 Pine St.',
        city: 'Oakland',
        countryCode:'US',
        state: 'CA',
        postalCode: '94577',
    };
    const res: Response=expect.any(response);
    const next:NextFunction=jest.fn();
    const siteRepository:SiteRepository=null;
    const sitesController=new SitesController(siteRepository);
    sitesController.createSite(req,res,next);
    expect (next).toBeCalledTimes(1);
    expect (next).toBeCalledWith(new ValidationError('id should be >0'))
    });    
    it("should throw an error when send an invalid panels number ",()=>{
        const req: Request=expect.any(request);
        req.body= {
            id: 4,
            capacity: 5.5,
            panels: NaN,
            address: '910 Pine St.',
            city: 'Oakland',
            countryCode:'US',
            state: 'CA',
            postalCode: '94577',
        };
        const res: Response=expect.any(response);
        const next:NextFunction=jest.fn();
        const siteRepository:SiteRepository=null;
        const sitesController=new SitesController(siteRepository);
        sitesController.createSite(req,res,next);
        expect (next).toBeCalledTimes(1);
        expect (next).toBeCalledWith(new ValidationError('panels should be >0'))
    });  
    it("should throw an error when send an invalid panels number ",()=>{
    const req: Request=expect.any(request);
    req.body= {
        id: 4,
        capacity: 5.5,
        panels: NaN,
        address: '910 Pine St.',
        city: 'Oakland',
        countryCode:'US',
        state: 'CA',
        postalCode: '94577',
      };
    const res: Response=expect.any(response);
    const next:NextFunction=jest.fn();
    const siteRepository:SiteRepository=null;
    const sitesController=new SitesController(siteRepository);
    sitesController.createSite(req,res,next);
    expect (next).toBeCalledTimes(1);
    expect (next).toBeCalledWith(new ValidationError('panels should be >0'))
    });  
    it("should throw an error when send an invalid postal code ",()=>{
        const req: Request=expect.any(request);
        req.body= {
            id: 4,
            capacity: 5.5,
            panels: 4,
            address: '910 Pine St.',
            city: 'Oakland',
            countryCode:'US',
            state: 'CA',
            postalCode: '94577ML',
          };
        const res: Response=expect.any(response);
        const next:NextFunction=jest.fn();
        const siteRepository:SiteRepository=null;
        const sitesController=new SitesController(siteRepository);
        sitesController.createSite(req,res,next);
        expect (next).toBeCalledTimes(1);
        expect (next).toBeCalledWith(new ValidationError('postalCode should be valid'))
    }); 
    it("should throw an error when send an invalid coordinate ",()=>{
        const req: Request=expect.any(request);
        req.body= {
            id: 4,
            capacity: 5.5,
            panels: 4,
            address: '910 Pine St.',
            city: 'Oakland',
            countryCode:'US',
            state: 'CA',
            postalCode: '94577',
            coordinate: {
                lat: 97.739659,
                lng: -182.255689,
              },
          };
        const res: Response=expect.any(response);
        const next:NextFunction=jest.fn();
        const siteRepository:SiteRepository=null;
        const sitesController=new SitesController(siteRepository);
        sitesController.createSite(req,res,next);
        expect (next).toBeCalledTimes(1);
        expect (next).toBeCalledWith(new ValidationError('coordinate should be valid'))
    });
    it("should throw an error when conncetion fail.",async()=>{
        const req: Request=expect.any(request);
        req.body= {
            id: 4,
            capacity: 5.5,
            panels: 4,
            address: '910 Pine St.',
            city: 'Oakland',
            countryCode:'US',
            state: 'CA',
            postalCode: '94577',
            coordinate: {
                lat: 37.739659,
                lng: -132.255689,
              },
          };
        const res: Response=expect.any(response);
        res.status=jest.fn().mockReturnThis();
        res.json= jest.fn();
        const next:NextFunction=jest.fn();
        const siteRepository:SiteRepository={
            insert: jest.fn().mockImplementation(async () => {
                throw new Error('Retry attempts exhausted.');
            }),
            findById: function (): Promise<Site> {
                throw new Error("Function not implemented.");
            },
            findAll: function (): Promise<Site[]> {
                throw new Error("Function not implemented.");
            },
            findByGeo: function (): Promise<Site[]> {
                throw new Error("Function not implemented.");
            },
            findAllWithGeo: function (): Promise<Site[]> {
                throw new Error("Function not implemented.");
            },
            flushDB: function (): Promise<string> {
                throw new Error("Function not implemented.");
            }
        }  
        const sitesController=new SitesController(siteRepository);
        await sitesController.createSite(req,res,next);
        expect (next).toBeCalledTimes(1);
        expect (next).toBeCalledWith( new Error('Retry attempts exhausted.'));    
    }); 
    it("should Creates a new site in the database.",async()=>{
        const req: Request=expect.any(request);
        req.body= {
            id: 4,
            capacity: 5.5,
            panels: 4,
            address: '910 Pine St.',
            city: 'Oakland',
            countryCode:'US',
            state: 'CA',
            postalCode: '94577',
            coordinate: {
                lat: 37.739659,
                lng: -132.255689,
              },
          };
        const res: Response=expect.any(response);
        res.status=jest.fn().mockReturnThis();
        res.json= jest.fn();
        const next:NextFunction=jest.fn();
        const siteRepository:SiteRepository={
            insert: jest.fn().mockImplementation(async () => {
                return '4';
            }),
            findById: function (): Promise<Site> {
                throw new Error("Function not implemented.");
            },
            findAll: function (): Promise<Site[]> {
                throw new Error("Function not implemented.");
            },
            findByGeo: function (): Promise<Site[]> {
                throw new Error("Function not implemented.");
            },
            findAllWithGeo: function (): Promise<Site[]> {
                throw new Error("Function not implemented.");
            },
            flushDB: function (): Promise<string> {
                throw new Error("Function not implemented.");
            }
        }  
        const sitesController=new SitesController(siteRepository);
        await sitesController.createSite(req,res,next);
        expect (next).toBeCalledTimes(0);
        expect(res.status).toBeCalledTimes(1); 
        expect(res.status).toBeCalledWith(201);
        expect(res.json).toBeCalledTimes(1); 
        expect(res.json).toBeCalledWith("4");       
    });  
    it("should Retrieve all sites from the database",async ()=>{
        const sites  = [{
            id: 1,
            capacity: 4.5,
            panels: 3,
            address: '123 Willow St.',
            city: 'Oakland',
            countryCode:'US',
            state: 'CA',
            postalCode: '94577',
            coordinate: {
              lat: 37.739659,
              lng: -122.255689,
            },
          }, {
            id: 2,
            capacity: 3.0,
            panels: 2,
            address: '456 Maple St.',
            city: 'Oakland',
            state: 'CA',
            countryCode:'US',
            postalCode: '94577',
            coordinate: {
              lat: 37.739559,
              lng: -122.256689,
            },
          }, {
            id: 3,
            capacity: 4.0,
            panels: 3,
            address: '789 Oak St.',
            city: 'Oakland',
            countryCode:'US',
            state: 'CA',
            postalCode: '94577',
            coordinate: {
              lat: 37.739659,
              lng: -122.255689,
            },
          }];  
        const expectedsites:Site[] =[];  
        const req:Request=expect.any(request);
        const res:Response=expect.any(response);
        res.status=jest.fn().mockReturnThis();
        res.json=jest.fn();
        const next:NextFunction=jest.fn();
        const siteRepository:SiteRepository={
            insert: function (): Promise<string> {
                throw new Error("Function not implemented.");
            },
            findById: function (): Promise<Site> {
                throw new Error("Function not implemented.");
            },
            findAll: function (): Promise<Site[]> {
                throw new Error("Function not implemented.");
            },
            findByGeo: function (): Promise<Site[]> {
                throw new Error("Function not implemented.");
            },
            findAllWithGeo: jest.fn().mockImplementation(async () => {

                for (const site of sites) {
                    expectedsites.push(new Site(site));
                }
                return expectedsites;

            }),
            flushDB: function (): Promise<string> {
                throw new Error("Function not implemented.");
            }
        }
        const sitesController=new SitesController(siteRepository);
        await sitesController.getSites(req,res,next);
        const expected =JSON.parse(JSON.stringify(expectedsites));
        expect (next).toBeCalledTimes(0);
        expect(res.status).toBeCalledTimes(1); 
        expect(res.status).toBeCalledWith(200);
        expect(res.json).toBeCalledTimes(1); 
        expect(res.json).toBeCalledWith(expect.arrayContaining(expected));
    });
    it("Retrieve all sites should throw an error when conncetion fail.",async()=>{
        const req: Request=expect.any(request);
        const res: Response=expect.any(response);
        res.status=jest.fn().mockReturnThis();
        res.json= jest.fn();
        const next:NextFunction=jest.fn();
        const siteRepository:SiteRepository={
            insert: jest.fn().mockImplementation(async () => {
                throw new Error('Retry attempts exhausted.');
            }),
            findById: function (): Promise<Site> {
                throw new Error("Function not implemented.");
            },
            findAll: jest.fn().mockImplementation(async () => {
                throw new Error('Retry attempts exhausted.');
            }),
            findByGeo: function (): Promise<Site[]> {
                throw new Error("Function not implemented.");
            },
            findAllWithGeo: jest.fn().mockImplementation(async () => {
                throw new Error('Retry attempts exhausted.');
            }),
            flushDB: function (): Promise<string> {
                throw new Error("Function not implemented.");
            }
        }  
        const sitesController=new SitesController(siteRepository);
        await sitesController.getSites(req,res,next);
        expect (next).toBeCalledTimes(1);
        expect (next).toBeCalledWith( new Error('Retry attempts exhausted.'));    
    }); 
    it("should throw not found error",async()=>{
     const req:Request=expect.any(request);
     req.params={ id:"1"};
     const res:Response=expect.any(response);
     res.status=jest.fn().mockReturnThis();
     const next:NextFunction=jest.fn();
     const siteRepository:SiteRepository={
         insert: function (): Promise<string> {
             throw new Error("Function not implemented.");
         },
         findById: jest.fn().mockImplementation(async () => {
             return null;
         }),
         findAll: function (): Promise<Site[]> {
             throw new Error("Function not implemented.");
         },
         findByGeo: function (): Promise<Site[]> {
             throw new Error("Function not implemented.");
         },
         findAllWithGeo: function (): Promise<Site[]> {
             throw new Error("Function not implemented.");
         },
         flushDB: function (): Promise<string> {
             throw new Error("Function not implemented.");
         }
     };
     const sitesController=new SitesController(siteRepository);
     await sitesController.getSite(req,res,next);
     expect (next).toBeCalledTimes(1);
        expect (next).toBeCalledWith(new SiteNotFoundError());
    });
    it("should throw id should be a valid integer  ",async()=>{
        const req:Request=expect.any(request);
        req.params={ id:''};
        const res:Response=expect.any(response);
        res.status=jest.fn().mockReturnThis();
        const next:NextFunction=jest.fn();
        const siteRepository:SiteRepository=null
        const sitesController=new SitesController(siteRepository);
        await sitesController.getSite(req,res,next);
        expect (next).toBeCalledTimes(1);
           expect (next).toBeCalledWith(new ValidationError("id should be a valid integer"));
        req.params={};
        await sitesController.getSite(req,res,next);
        expect (next).toBeCalledTimes(2);
           expect (next).toBeCalledWith(new ValidationError("id should be a valid integer"));
     });
    it("should Retrieve an individual site from the database.",async()=>{
        const site  = {
            id: 4,
            capacity: 5.5,
            panels: 4,
            address: '910 Pine St.',
            countryCode:'US',
            city: 'Oakland',
            state: 'CA',
            postalCode: '94577',
            coordinate: {
              lat: 37.739659,
              lng: -122.255689,
            },
          };
        const expected=JSON.parse(JSON.stringify(new Site(site)));
        const req:Request=expect.any(request);
        req.params={ id:"4"};
        const res:Response=expect.any(response);
        res.status=jest.fn().mockReturnThis();
        res.json=jest.fn();
        const next:NextFunction=jest.fn();
        const siteRepository:SiteRepository={
            insert: function (): Promise<string> {
                throw new Error("Function not implemented.");
            },
            findById: jest.fn().mockImplementation(async () => {
                return new Site(site);
            }),
            findAll: function (): Promise<Site[]> {
                throw new Error("Function not implemented.");
            },
            findByGeo: function (): Promise<Site[]> {
                throw new Error("Function not implemented.");
            },
            findAllWithGeo: function (): Promise<Site[]> {
                throw new Error("Function not implemented.");
            },
            flushDB: function (): Promise<string> {
                throw new Error("Function not implemented.");
            }
        };
        const sitesController=new SitesController(siteRepository);
        await sitesController.getSite(req,res,next);
        expect (next).toBeCalledTimes(0);
        expect(res.status).toBeCalledTimes(1); 
        expect(res.status).toBeCalledWith(200);
        expect(res.json).toBeCalledTimes(1); 
        expect(res.json).toBeCalledWith(expected);

    });
    it("Retrieve site should throw an error when conncetion fail.",async()=>{
        const req: Request=expect.any(request);
        req.params={ id:"4"};
        const res: Response=expect.any(response);
        res.status=jest.fn().mockReturnThis();
        res.json= jest.fn();
        const next:NextFunction=jest.fn();
        const siteRepository:SiteRepository={
            insert: jest.fn().mockImplementation(async () => {
                throw new Error('Retry attempts exhausted.');
            }),
            findById: jest.fn().mockImplementation(async () => {
                throw new Error('Retry attempts exhausted.');
            }),
            findAll: jest.fn().mockImplementation(async () => {
                throw new Error('Retry attempts exhausted.');
            }),
            findByGeo: function (): Promise<Site[]> {
                throw new Error("Function not implemented.");
            },
            findAllWithGeo: function (): Promise<Site[]> {
                throw new Error("Function not implemented.");
            },
            flushDB: function (): Promise<string> {
                throw new Error("Function not implemented.");
            }
        }  
        const sitesController=new SitesController(siteRepository);
        await sitesController.getSite(req,res,next);
        expect (next).toBeCalledTimes(1);
        expect (next).toBeCalledWith( new Error('Retry attempts exhausted.'));    
    });   
    it("Retrieve site should throw validation error when id is not number .",async()=>{
        const req: Request=expect.any(request);
        req.params={ id:"x"};
        const res: Response=expect.any(response);
        res.status=jest.fn().mockReturnThis();
        res.json= jest.fn();
        const next:NextFunction=jest.fn();
        const siteRepository:SiteRepository={
            insert: jest.fn().mockImplementation(async () => {
                throw new Error('Retry attempts exhausted.');
            }),
            findById: jest.fn().mockImplementation(async () => {
                throw new Error('Retry attempts exhausted.');
            }),
            findAll: jest.fn().mockImplementation(async () => {
                throw new Error('Retry attempts exhausted.');
            }),
            findByGeo: function (): Promise<Site[]> {
                throw new Error("Function not implemented.");
            },
            findAllWithGeo: function (): Promise<Site[]> {
                throw new Error("Function not implemented.");
            },
            flushDB: function (): Promise<string> {
                throw new Error("Function not implemented.");
            }
        }  
        const sitesController=new SitesController(siteRepository);
        await sitesController.getSite(req,res,next);
        expect (next).toBeCalledTimes(1);
        expect (next).toBeCalledWith( new ValidationError("id should be a valid integer"));    
    }); 
    it("Retrieve site should throw validation error when id is missed",async()=>{
        const req: Request=expect.any(request);
        const res: Response=expect.any(response);
        res.status=jest.fn().mockReturnThis();
        res.json= jest.fn();
        const next:NextFunction=jest.fn();
        const siteRepository:SiteRepository={
            insert: jest.fn().mockImplementation(async () => {
                throw new Error('Retry attempts exhausted.');
            }),
            findById: jest.fn().mockImplementation(async () => {
                throw new Error('Retry attempts exhausted.');
            }),
            findAll: jest.fn().mockImplementation(async () => {
                throw new Error('Retry attempts exhausted.');
            }),
            findByGeo: function (): Promise<Site[]> {
                throw new Error("Function not implemented.");
            },
            findAllWithGeo: function (): Promise<Site[]> {
                throw new Error("Function not implemented.");
            },
            flushDB: function (): Promise<string> {
                throw new Error("Function not implemented.");
            }
        }  
        const sitesController=new SitesController(siteRepository);
        await sitesController.getSite(req,res,next);
        expect (next).toBeCalledTimes(1);
        expect (next).toBeCalledWith( new ValidationError("id should be a valid integer"));    
    }); 
    it("should Retrieve sites that are within a specified distance of a coordinate",async()=>{
        const site1 = {
            id: 1,
            capacity: 3.5,
            panels: 3,
            address: '637 Britannia Drive',
            city: 'Vallejo',
            countryCode:'US',
            state: 'CA',
            postalCode: '94591',
            coordinate: {
              lat: 38.10476999999999,
              lng: -122.193849,
            },
          };
        
          const site2 = {
            id: 2,
            capacity: 4.5,
            panels: 3,
            address: '31353 Santa Elena Way',
            city: 'Union City',
            countryCode:'US',
            state: 'CA',
            postalCode: '94587',
            coordinate: {
              lat: 37.593981,
              lng: -122.059762,
            },
          };
        
          const site3 = {
            id: 3,
            capacity: 4.5,
            panels: 3,
            address: '1732 27th Avenue',
            countryCode:'US',
            city: 'Oakland',
            state: 'CA',
            postalCode: '94601',
            coordinate: {
              lat: 37.783431,
              lng: -122.228238,
            },
          };    
    const req:Request=expect.any(request);
    req.query=querystring.parse("lat=37.804829&lng=-122.272476&radius=10&radiusUnit='km'");
                
    const res:Response=expect.any(response);
    res.status=jest.fn().mockReturnThis();
    res.json=jest.fn();
    const next:NextFunction=jest.fn();
    const sites:Site[]=[];
    sites.push(new Site(site1));
    sites.push(new Site(site2));
    sites.push(new Site(site3));
    const exoectedsites=JSON.parse(JSON.stringify(sites));
   
    const siteRepository:SiteRepository={
        insert: function (): Promise<string> {
            throw new Error("Function not implemented.");
        },
        findById: function (): Promise<Site> {
            throw new Error("Function not implemented.");
        },
        findAll: function (): Promise<Site[]> {
            throw new Error("Function not implemented.");
        },
        findByGeo: jest.fn().mockImplementation(async () => {
            return sites;
        }),
        findAllWithGeo: function (): Promise<Site[]> {
            throw new Error("Function not implemented.");
        },
        flushDB: function (): Promise<string> {
            throw new Error("Function not implemented.");
        }
    }
    const siteController = new SitesController(siteRepository);
    await siteController.sitesNearBy (req,res,next);
    expect (next).toBeCalledTimes(0);
    expect(res.status).toBeCalledTimes(1); 
    expect(res.status).toBeCalledWith(200);
    expect(res.json).toBeCalledTimes(1); 
    expect(res.json).toBeCalledWith(exoectedsites);
     });
    it("should Return Validation Error with Invalid Coordinate",async()=>{
    const req:Request=expect.any(request);
    req.query=querystring.parse("lat=97.804829&lng=-192.272476&radius=10&radiusUnit='km'");
    const res:Response=expect.any(response);
    res.status=jest.fn().mockReturnThis();
    res.json=jest.fn();
    const next:NextFunction=jest.fn();
    const siteController = new SitesController(null);
    await siteController.sitesNearBy (req,res,next);
    expect (next).toBeCalledTimes(1);
    expect (next).toBeCalledWith(new ValidationError('coordinate should be valid'))
     })
    it("should Return NotFound  within a specified distance of a coordinate",async()=>{
    const req:Request=expect.any(request);
    req.query=querystring.parse("?lat=37.804829&lng=-122.272476&radius=10&radiusUnit='km'");
    const res:Response=expect.any(response);
    res.status=jest.fn().mockReturnThis();
    res.json=jest.fn();
    const next:NextFunction=jest.fn();
    const siteRepository:SiteRepository={
        insert: function (): Promise<string> {
            throw new Error("Function not implemented.");
        },
        findById: function (): Promise<Site> {
            throw new Error("Function not implemented.");
        },
        findAll: function (): Promise<Site[]> {
            throw new Error("Function not implemented.");
        },
        findByGeo: jest.fn().mockImplementation(async () => {
            return [];
        }),
        findAllWithGeo: function (): Promise<Site[]> {
            throw new Error("Function not implemented.");
        },
        flushDB: function (): Promise<string> {
            throw new Error("Function not implemented.");
        }
    }
    const siteController = new SitesController(siteRepository);
    await siteController.sitesNearBy (req,res,next);
    expect (next).toBeCalledTimes(1);
    expect (next).toBeCalledWith(new SitesNotFoundError())

   })
   it("should Return Validation Error within invalid Request",async()=>{
    const req:Request=expect.any(request);
    req.query=null;
    const res:Response=expect.any(response);
    res.status=jest.fn().mockReturnThis();
    res.json=jest.fn();
    const next:NextFunction=jest.fn();
    const siteController = new SitesController(null);
    await siteController.sitesNearBy (req,res,next);
    expect (next).toBeCalledTimes(1);
    expect (next).toBeCalledWith(new ValidationError("invalid Request"));
   })
})
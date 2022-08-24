import {Request, Response, NextFunction, Application} from 'express';
import bodyParser from 'body-parser';
import Constants from "./Constants";
import Errors from './Errors';
import Header from '../entities/Header';
import { default as Resp, Error } from '../entities/Response';
import { VerifyResult, default as WalletManagerUtils } from './WalletManagerUtils';


export default class ExpressVerifier{

    utils:WalletManagerUtils;

    constructor(utils:WalletManagerUtils){
        this.utils = utils;
    }

    get verifyMiddleware(){
        return (req: Request, res: Response, next:NextFunction) => {
    
            let address = req.header(Constants.HEADER_ADDRESS);
            let sequence = req.header(Constants.HEADER_SEQUENCE);
            let session = req.header(Constants.HEADER_SESSION);
            let signature = req.header(Constants.HEADER_SIGNATURE);
            let timestamp = req.header(Constants.HEADER_TIMESTAMP);
        
            let header: Header = {
                address: address?.toString() || "",
                sequence: parseInt(sequence?.toString() || "0"),
                session: session?.toString() || "",
                signature: signature?.toString() || "",
                timestamp: parseInt(timestamp?.toString() || "0")
            };
        
            let body = req.body;
            if(typeof body === 'string'){
                // set request body to json
                req.body = JSON.parse(body);
            }else{
                body = JSON.stringify(body);
            }
            
            // console.info(`Verify header ${JSON.stringify(header)}`);
            // console.info(`Verfiy body ${body}`);

            const result = this.utils.verify(header, body, Constants.MESSAGE_EXPIRED_IN_MS);

            if(result == VerifyResult.Verified){
                next();
            }else{
                let error:Error;
                if(result == VerifyResult.Expired){
                    error = Errors.MESSAGE_EXPIRED;
                }else{
                    error = Errors.SIGNATURE_NOT_MATCH;
                }
                res.json({error});
            }
        }
    }

    addVerifier(app:Application, path:string = ""){      

        if(path.length == 0){
            app.use(bodyParser.urlencoded({ extended: false }));
            app.use(bodyParser.text({type: '*/*'}));  
            app.use(this.verifyMiddleware);
        }else{
            app.use(path, bodyParser.urlencoded({ extended: false }));
            app.use(path, bodyParser.text({type: '*/*'}));  
            app.use(path, this.verifyMiddleware);
        }
    }

}





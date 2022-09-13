import { Config } from '../entities/Config';
import { loadConfig } from './ConfigLoader';
const CONFIG = loadConfig<Config>('config');

import {Request, Response, NextFunction, Application} from 'express';
import bodyParser from 'body-parser';
import {Constants} from "./Constants";
import {Errors} from './Errors';
import {Header} from '../entities/Header';
import {Error} from '../entities/Error';
import { VerifyResult, WalletManagerUtils } from './WalletManagerUtils';



export class ExpressVerifier{

    readonly utils:WalletManagerUtils;
    readonly whiteListedAddresses:string[]

    constructor(utils:WalletManagerUtils, whiteListedAddresses:string[]){
        this.utils = utils;
        this.whiteListedAddresses = whiteListedAddresses;
    }

    get verifyMiddleware(){
        return (req: Request, res: Response, next:NextFunction) => {
    
            const address = req.header(Constants.HEADER_ADDRESS);
            const sequence = req.header(Constants.HEADER_SEQUENCE);
            const session = req.header(Constants.HEADER_SESSION);
            const signature = req.header(Constants.HEADER_SIGNATURE);
            const timestamp = req.header(Constants.HEADER_TIMESTAMP);
        
            const header: Header = {
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

            const result = WalletManagerUtils.verify(this.whiteListedAddresses, header, body, CONFIG.serverConfig.messageExpiredInMs);

            if(result == VerifyResult.Verified){
                next();
            }else{
                let error:Error;
                if(result == VerifyResult.Expired){
                    error = Errors.MESSAGE_EXPIRED;
                }else if (result == VerifyResult.InvalidAddress){
                    error = Errors.INVALID_ADDRESS;
                }else{
                    error = Errors.SIGNATURE_NOT_MATCH;
                }
                res.json({error});
            }
        }
    }

    addVerifier(app:Application, path = ""){      

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





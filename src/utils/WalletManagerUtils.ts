import {Header} from "../entities/Header"
import {Snowflake} from "./SnowflakeUtils"
import EthCrypto, { signTransaction } from 'eth-crypto'
import {Constants} from "./Constants"
import {AxiosInteceptor} from "./AxiosInteceptor"

import { default as axios, AxiosRequestConfig } from 'axios'

import hash from 'hash.js';


export enum VerifyResult {
    InvalidAddress = -2,
    Expired = -1,
    SignatureNotMatch = 0,
    Verified = 1,
  }

export class WalletManagerUtils{

    seq = 0;
    #sessionId:string;
    #publicKey:string;
    #address:string;
    #privateKey:string;


    constructor(privateKey:string, instanceId:number){
        const sf = new Snowflake(instanceId);
        this.#sessionId = sf.getUniqueID().toString();
        this.#privateKey = privateKey;
        this.#publicKey = EthCrypto.publicKeyByPrivateKey(privateKey);
        this.#address = EthCrypto.publicKey.toAddress(this.#publicKey);

    }

    /**
     * Sign message
     * @param body 
     * @returns return header values
     */
    sign(body = ""): Header{
        const seq = this.seq++;
        const ts = new Date().getTime();
        const header:Header = {
            address: this.address,
            timestamp: ts,
            session: this.sessionId,
            sequence: seq,
            signature: "",
        }

        const content = WalletManagerUtils.contentToBeSigned(header, body);
        const contentHash = hash.sha256().update(content).digest('hex');
        // sign
        const signature = EthCrypto.sign(this.#privateKey, contentHash);
    
        // update signature
        header.signature = signature;

        return header;
    } 

    /**
     * 
     * @param header 
     * @param body 
     */
     static verify(whiteListedAddresses:string[], header:Header, body:string, expiredInMs = Constants.MESSAGE_EXPIRED_IN_MS): VerifyResult{
        
        if(!whiteListedAddresses.includes(header.address)){
            return VerifyResult.InvalidAddress;
        }

        const now = new Date().getTime();
        if(header.timestamp < now - expiredInMs){
           return VerifyResult.Expired;
        }
        return WalletManagerUtils.verifyHeader(header, body);
      }

      /**
       * 
       * @param header 
       * @param body 
       * @returns 
       */
      static verifyHeader(header:Header, body:string): VerifyResult{

        const content = WalletManagerUtils.contentToBeSigned(header, body);
        console.info(`Content to be signed ${content}`);

        const contentHash = hash.sha256().update(content).digest('hex');

        console.info("message hash " + contentHash);
        let signature  = header.signature;
        if(!signature.startsWith('0x')){
            signature = '0x' + signature;
        }
        const signatures = [];
        if(signature.length == 130){
           signatures.push(signature + '1b'); // v = 27
           signatures.push(signature + '1c'); // v = 28
        }else{
            signatures.push(signature);
        }

        let match = false;
        for (const s of signatures) {
            const recoverAddress = EthCrypto.recover(s, contentHash); 
            if(recoverAddress == header.address){
                match = true;
                break;
            }
        }

        if(match){
            return VerifyResult.Verified;
        }else{
            return VerifyResult.SignatureNotMatch;
        }
    }


    /**
     * Timestamp#Session#Sequence#BODY
     * @param header 
     * @param body 
     */
     static contentToBeSigned(header:Header, body:string):string{
        return `${header.timestamp.toFixed()}#${header.session}#${header.sequence.toFixed()}#${body}`;
    }

    get sessionId():string{
        return this.#sessionId;
    }

    get address():string{
        return this.#address;
    }

    get publicKey():string{
        return this.#publicKey;
    }


    createAxiosInstance(baseURL:string, contentTypeJson = false, configFun: (config: AxiosRequestConfig<any>) => AxiosRequestConfig<any> = (config) => config) {

        let headers;
        if(contentTypeJson){
            headers = Constants.CONTENT_TYPE_JSON;
        }else{
            headers = Constants.CONTENT_TYPE_PLAIN_TEXT
        }
        const instance = axios.create({baseURL, headers});
    
        const axiosInteceptor = new AxiosInteceptor(this);
    
        // add interceptors
        axiosInteceptor.addRequestInteceptor(instance, configFun);
    
        return instance;
    }

}
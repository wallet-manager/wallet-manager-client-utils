import { CONFIG } from './ConfigLoader';
import Header from "../entities/Header";
import Snowflake from "./SnowflakeUtils";
import EthCrypto from 'eth-crypto';
import Constants from "./Constants";

var hash = require('hash.js')


export enum VerifyResult {
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


    constructor(privateKey:string, instanceId:number = 1){
        let sf = new Snowflake(instanceId);
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
    sign(body:string = ""): Header{
        let seq = this.seq++;
        let ts = new Date().getTime();
        let header:Header = {
            address: this.address,
            timestamp: ts,
            session: this.sessionId,
            sequence: seq,
            signature: "",
        }

        const content = this.contentToBeSigned(header, body);
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
    verify(header:Header, body:string = "", expiredInMs = Constants.MESSAGE_EXPIRED_IN_MS): VerifyResult{

        const content = this.contentToBeSigned(header, body);
        //console.info(`Content to be signed ${content}`);

        const contentHash = hash.sha256().update(content).digest('hex');
        const address = EthCrypto.recover(header.signature, contentHash);

        const now = new Date().getTime();
        if(header.timestamp < now - expiredInMs){
           return VerifyResult.Expired;
        }

        if(address == header.address){
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
     contentToBeSigned(header:Header, body:string):string{
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

}
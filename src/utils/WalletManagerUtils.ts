
import { Header } from "../entities/header";
import { Snowflake } from "./SnowflakeUtils";
import EthCrypto from 'eth-crypto';
var hash = require('hash.js')


export class WalletManagerUtils{

    seq = 1n;
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
            timestamp: ts.toString(),
            session: this.sessionId,
            sequence: seq.toString(),
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
    verify(header:Header, body:string = ""): boolean{

        const content = this.contentToBeSigned(header, body);
        const contentHash = hash.sha256().update(content).digest('hex');
        const address = EthCrypto.recover(header.signature, contentHash);
        return address == header.address;
    }


    /**
     * Timestamp#Session#Sequence#BODY
     * @param header 
     * @param body 
     */
     contentToBeSigned(header:Header, body:string):string{
        return `${header.timestamp}#${header.session}#${header.sequence}#${body}`;
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
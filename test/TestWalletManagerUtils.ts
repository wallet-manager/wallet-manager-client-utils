import { Config} from '../src/entities/Config';
import { loadConfig, WalletManagerUtils, VerifyResult, Header } from '../index';
const CONFIG = loadConfig<Config>('config');


import {describe, it} from "mocha";
import {expect} from "chai";
import hash from 'hash.js';


const body1 = '{"abc":1}';
const body2 = '{"efg":2}';

// generate address, public and private keys
//const identity = EthCrypto.createIdentity();
const {identity} = CONFIG;
const {privateKey} = identity;
const {instanceId} = CONFIG.clientConfig;

describe("Test WalletManagerUtils", function () {
    it("signature()", function(){

        console.info(JSON.stringify(identity));

        const utils = new WalletManagerUtils(privateKey, instanceId);

        if(identity.address){
            expect(utils.address).to.equals(identity.address);
        }
        
        if(identity.publicKey){
            expect(utils.publicKey).to.equals(identity.publicKey);
        }

        // sign
        const header1 = utils.sign(body1);
        console.info(body1);
        console.info(JSON.stringify(header1));


        const header2 = utils.sign(body2);
        console.info(body2);
        console.info(JSON.stringify(header2));

        // verify
        expect(WalletManagerUtils.verifyHeader(header1, body1)).to.equals(VerifyResult.Verified);
        expect(WalletManagerUtils.verifyHeader(header2, body2)).to.equals(VerifyResult.Verified);
        expect(WalletManagerUtils.verifyHeader(header1, body2)).to.equals(VerifyResult.SignatureNotMatch);
        expect(WalletManagerUtils.verifyHeader(header2, body1)).to.equals(VerifyResult.SignatureNotMatch);
    });

    it("check signature()", function(){

    
        const contentHash = hash.sha256().update("1661753503049#1013692403481055232#1#abc").digest('hex');

        console.info(contentHash);

        const header:Header = {
            address:"0xd8D584ba78C6c7d02674764B2286A51C2495E192", 
            timestamp:1661768808973,
            session:"1013756599992324096",
            sequence:1, 
            signature:"0x81f42b0a101298d69936e558884510bcd957ef3a59bfd73e0b4a59fcae6707366ed0494c81da099d53cf217f994ffcb63a1fd4d33e78739dd93e9bd185649dd71c"
        };

        const body = '{"merchant_id":"1","chain_type":2,"chain_id":"4","client_id":"2"}';

        const verifyResult = WalletManagerUtils.verify(
            [header.address], header, body, 100000000000000);
        console.info(verifyResult);

    });
});

// 1661753503049#1013692403481055232#2#abc
// 1661753503049#1013692403481055232#1#abc
import {CONFIG, WalletManagerUtils, VerifyResult} from "../index";
import {describe, it} from "mocha";
import {expect, util} from "chai";


const body1 = '{"abc":1}';
const body2 = '{"efg":2}';

describe("Test WalletManagerUtils", function () {
    it("signature()", function(){

        // generate address, public and private keys
        //const identity = EthCrypto.createIdentity();
        const {identity} = CONFIG;
        const {privateKey} = identity;
        const {instanceId} = CONFIG.clientConfig;

        console.info(JSON.stringify(identity));

        let utils = new WalletManagerUtils(privateKey, instanceId);

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
        expect(utils.verify(header1, body1)).to.equals(VerifyResult.Verified);
        expect(utils.verify(header2, body2)).to.equals(VerifyResult.Verified);
        expect(utils.verify(header1, body2)).to.equals(VerifyResult.SignatureNotMatch);
        expect(utils.verify(header2, body1)).to.equals(VerifyResult.SignatureNotMatch);
    })
});
import {describe, it} from "mocha";
import {expect, util} from "chai";
import {WalletManagerUtils} from '../dist';
import EthCrypto from 'eth-crypto';

const body1 = "abc";
const body2 = "efg";

describe("Test WalletManagerUtils", function () {
    it("signature()", function(){

        // generate address, public and private keys
        const identity = EthCrypto.createIdentity();

        let utils = new WalletManagerUtils(identity.privateKey, 1);

        expect(utils.address).to.equals(identity.address);
        expect(utils.publicKey).to.equals(identity.publicKey);

        // sign
        const header1 = utils.sign(body1);
        console.info(JSON.stringify(header1));

        const header2 = utils.sign(body2);
        console.info(JSON.stringify(header2));

        // verify
        expect(utils.verify(header1, body1)).to.be.true;
        expect(utils.verify(header2, body2)).to.be.true;
        expect(utils.verify(header1, body2)).to.be.false;
        expect(utils.verify(header2, body1)).to.be.false;
    })
});
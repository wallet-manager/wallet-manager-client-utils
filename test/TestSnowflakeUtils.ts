import {describe, it} from "mocha";
import {expect} from "chai";
import {Snowflake} from '../index';


describe("Test snowflake", function () {
    it("uniqueID()", function(){
        const sf = new Snowflake();
        let uids:any = {};
        let uid = sf.getUniqueID().toString();
        uids[uid] = true;
        for(let i = 0; i < 10; i++){
            uid = sf.getUniqueID().toString();
            expect(uids[uid]).to.be.an('undefined');
            uids[uid] = true;
        }
    })
});
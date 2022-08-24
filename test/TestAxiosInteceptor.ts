import { AxiosRequestConfig, AxiosInstance } from 'axios';
import AxiosInteceptor from '../src/utils/AxiosInteceptor';
import WalletManagerUtils from '../src/utils/WalletManagerUtils';
import Constants from '../src/utils/Constants';
import Errors from '../src/utils/Errors';
import EthCrypto from "eth-crypto";

import import_axios from 'axios';
import { expect } from 'chai';

const baseURL = "http://localhost:8080";
const keysURL = "/keys";
const testURL = "/merchant";


async function getIdentity(axios:AxiosInstance) {
    let response = await axios.get(keysURL);
    return response.data;
};

async function createAxiosInstance(configFun: (config: AxiosRequestConfig<any>) => AxiosRequestConfig<any> = (config) => config) {

    const instance = import_axios.create({
        baseURL,
        headers: { "Content-Type": "text/plain" }
    });

    // generate address, public and private keys
    const identity = await getIdentity(instance);
    let utils = new WalletManagerUtils(identity.privateKey, 1);
    let axiosInteceptor = new AxiosInteceptor(utils);

    // add interceptors
    axiosInteceptor.addRequestInteceptor(instance, configFun);

    return instance;
}


describe("Test Axio Inteceptor", async function () {

    it("Normal request", async function () {

        const instance = await createAxiosInstance();

        const response = await instance.post(testURL, { abc: 1 });
        console.info(response);
        let data: any = response.data;

        expect(data.error).to.be.undefined;
        expect(data.result).to.not.be.undefined;
        console.info(JSON.stringify(data));
    });

    it("Expired request", async function () {

        const instance = await createAxiosInstance(config => {

            // expired
            if (config.headers) {
                config.headers[Constants.HEADER_TIMESTAMP] = new Date().getTime() - Constants.MESSAGE_EXPIRED_IN_MS - 1;
            }

            return config;
        });

        const response = await instance.post(testURL, { abc: 1 });
        let data: any = response.data;

        expect(data.error.code).to.equals(Errors.MESSAGE_EXPIRED.code);
        expect(data.error.message).to.equals(Errors.MESSAGE_EXPIRED.message);
        console.info(JSON.stringify(data));

    });

    it("Signature not match request", async function () {

        const instance = await createAxiosInstance(config => {

            // update header address
            if (config.headers) {
                config.headers[Constants.HEADER_ADDRESS] = config.headers[Constants.HEADER_ADDRESS] + "A";
            }
            return config;
        });

        const response = await instance.post(testURL, { abc: 1 });
        const data: any = response.data;

        expect(data.error).to.not.be.undefined;
        expect(data.error.code).to.equals(Errors.SIGNATURE_NOT_MATCH.code);
        expect(data.error.message).to.equals(Errors.SIGNATURE_NOT_MATCH.message);
        console.info(JSON.stringify(data));
    });
});
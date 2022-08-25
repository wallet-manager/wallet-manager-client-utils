import { CONFIG, AxiosInteceptor, WalletManagerUtils, Errors, Constants } from '../index';
import { default as axios, AxiosRequestConfig, AxiosInstance } from 'axios';

import { expect } from 'chai';

const keysURL = "/keys";
const testURL = "/merchant";
const {identity} = CONFIG;
const {serverPort} = CONFIG.serverConfig;
const {privateKey} = identity;
const {instanceId, contentTypeJson} = CONFIG.clientConfig

const baseURL = `http://localhost:${serverPort}`;

function createAxiosInstance(configFun: (config: AxiosRequestConfig<any>) => AxiosRequestConfig<any> = (config) => config) {

    let utils = new WalletManagerUtils(privateKey, instanceId);
    return utils.createAxiosInstance(baseURL, contentTypeJson, configFun);
}


describe("Test Axio Inteceptor", async function () {

    it("Normal request", async function () {

        const instance = createAxiosInstance();

        const response = await instance.post(testURL, { abc: 1 });
        let data: any = response.data;

        expect(data.result).to.equals(true);
        expect(data.error).to.be.undefined;
        expect(data.result).to.not.be.undefined;
        console.info(JSON.stringify(data));
    });

    it("Expired request", async function () {

        const instance = createAxiosInstance(config => {
            // expired
            if (config.headers) {
                config.headers[Constants.HEADER_TIMESTAMP] = new Date().getTime() - CONFIG.serverConfig.messageExpiredInMs - 1;
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

        const instance = createAxiosInstance(config => {
            // change content of body
            if (config.data) {
                //config.headers[Constants.HEADER_ADDRESS] = config.headers[Constants.HEADER_ADDRESS] + "A";
                config.data = config.data + ' ';
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
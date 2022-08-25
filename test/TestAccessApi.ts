import { CONFIG, WalletManagerUtils } from '../index';
import { AxiosRequestConfig } from 'axios';

const { baseURL } = CONFIG.clientConfig;
const identity = CONFIG.identity
const { privateKey } = identity;
const { instanceId, contentTypeJson} = CONFIG.clientConfig;


function createAxiosInstance(configFun: (config: AxiosRequestConfig<any>) => AxiosRequestConfig<any> = (config) => config) {

    const utils = new WalletManagerUtils(privateKey, instanceId);
    return utils.createAxiosInstance(baseURL, contentTypeJson, configFun);
}


describe("Test Access API", async function () {

    it("Get Address", async function () {

        const instance = createAxiosInstance();

        const response = await instance.post("/get_address",
            {
                "merchant_id": "1001",
                "chain_type": 1,
                "chain_id": "1",
                "client_id": new Date().getTime().toFixed()
            });
        const data: unknown = response.data;

        console.info(JSON.stringify(data));
    });
});
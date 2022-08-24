import { AxiosRequestConfig, AxiosInstance } from 'axios';
import WalletManagerUtils from './WalletManagerUtils';
import Constants from './Constants';

export default class AxiosInteceptor {

    utils: WalletManagerUtils;

    constructor(utils: WalletManagerUtils) {
        this.utils = utils;
    }

    addRequestInteceptor(axios: AxiosInstance, configFun: (config: AxiosRequestConfig<any>) => AxiosRequestConfig<any> = (config) => config) {

        let self = this;

        axios.interceptors.request.use(config => {

            let headers: any;
            if (config.data) {
                console.info(`config ${JSON.stringify(config)}`);
                if (typeof config.data == 'string') {
                    headers = self.utils.sign(config.data);
                } else {
                    const content = JSON.stringify(config.data)
                    headers = self.utils.sign(content);
                    // set back the content of the signature to data
                    config.data = content;
                }
            } else {
                headers = self.utils.sign("");
            }

            if (config.headers) {
                config.headers[Constants.HEADER_ADDRESS] = headers.address;
                config.headers[Constants.HEADER_SEQUENCE] = headers.sequence;
                config.headers[Constants.HEADER_SESSION] = headers.session;
                config.headers[Constants.HEADER_SIGNATURE] = headers.signature;
                config.headers[Constants.HEADER_TIMESTAMP] = headers.timestamp;
            }


            if (config.headers) {
                console.info(`reqeust headers ${JSON.stringify(config.headers)}`);
            }
            if (config.data) {
                console.info(`request data ${JSON.stringify(config.data)}`);
            }

            return configFun(config);
        }, function (error) {
            return Promise.reject(error);
        });
    }


}




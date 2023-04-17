import { AxiosRequestConfig, AxiosInstance } from 'axios';
import {WalletManagerUtils, WalletManagerRequestCallback, WalletManagerRequest} from './WalletManagerUtils';
import {Constants} from './Constants';

export class AxiosInteceptor {

    utils: WalletManagerUtils;
    requestCallback:WalletManagerRequestCallback;

    constructor(utils: WalletManagerUtils, requestCallback:WalletManagerRequestCallback) {
        this.utils = utils;
        this.requestCallback = requestCallback
    }

    addRequestInteceptor(axios: AxiosInstance, configFun: (config: AxiosRequestConfig<any>) => AxiosRequestConfig<any>) {

        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const self = this;

        axios.interceptors.request.use(config => {

            let content = "";
            if (config.data) {
                if (typeof config.data == 'string') {
                    content = config.data;
                } else {
                    content = JSON.stringify(config.data)
                    // set back the content of the signature to data

                    if(config.headers){
                        const contentType = config.headers[Constants.CONTENT_TYPE];
                        if(contentType == Constants.PLAIN_TEXT){
                            config.data = content;
                        }
                    }
                }
                
            } 
            const headers = self.utils.sign(content);
            if (config.headers) {
                config.headers[Constants.HEADER_ADDRESS] = headers.address;
                config.headers[Constants.HEADER_SEQUENCE] = headers.sequence;
                config.headers[Constants.HEADER_SESSION] = headers.session;
                config.headers[Constants.HEADER_SIGNATURE] = headers.signature;
                config.headers[Constants.HEADER_TIMESTAMP] = headers.timestamp;
            }

            if (config.headers) {
                const callbackRequest:WalletManagerRequest = {
                    header:config.headers,
                    data:config.data || {}
                }
                this.requestCallback(callbackRequest);
            }
            return configFun(config);

        }, function (error) {
            return Promise.reject(error);
        });
    }
}
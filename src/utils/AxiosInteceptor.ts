import { AxiosRequestConfig, AxiosInstance } from 'axios';
import {WalletManagerUtils} from './WalletManagerUtils';
import {Constants} from './Constants';

export class AxiosInteceptor {

    utils: WalletManagerUtils;

    constructor(utils: WalletManagerUtils) {
        this.utils = utils;
    }

    addRequestInteceptor(axios: AxiosInstance, configFun: (config: AxiosRequestConfig<any>) => AxiosRequestConfig<any>) {

        let self = this;

        axios.interceptors.request.use(config => {

            let content:string = "";
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
            let headers = self.utils.sign(content);
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
                console.info(`reqeust data ${content}`);
            }
            return configFun(config);

        }, function (error) {
            return Promise.reject(error);
        });
    }
}
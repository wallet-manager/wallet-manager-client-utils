

export interface Identity {
    privateKey: string;
    publicKey: string;
    address: string;
}

export interface ServerConfig {
    serverPort: number;
    messageExpiredInMs: number;
    logLevel:string;
    whiteListedAddresses:string[];
}

export interface ClientConfig {
    instanceId:number;
    baseURL: string;
    contentTypeJson: boolean;
}

export interface Config {
    merchantId: number;
    identity: Identity;
    serverConfig: ServerConfig;
    clientConfig: ClientConfig;

}

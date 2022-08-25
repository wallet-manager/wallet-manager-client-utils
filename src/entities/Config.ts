

export interface Identity {
    privateKey: string;
    publicKey: string;
    address: string;
}

export interface ServerConfig {
    serverPort: number;
    messageExpiredInMs: number;
}

export interface ClientConfig {
    instanceId:number;
    baseURL: string;
    contentTypeJson: boolean;
}

export interface Config {
    identity: Identity;
    serverConfig: ServerConfig;
    clientConfig: ClientConfig;

}
import doenv from 'dotenv';

export const GET_NODE_ENV = () => {
    let node_env:string;
    doenv.config();
    if (!process.env.NODE_ENV) {
        console.warn("NODE_ENV NOT SET in .env!");
        console.warn("Set default NODE_ENV to dev");
        node_env = 'dev';
    }else{
        node_env = process.env.NODE_ENV;
    }
    return node_env;
};

import fs from 'fs';
//const path = require('path');
//var cwd  = path.dirname(fs.realpathSync(__filename));

export class ConfigLoader<T>{
    
    env:string;
    config?:T;

    constructor(env:string){
        this.env = env;
    }

    load(name:string):T{
        let result:T;
        if(!this.config){
            const cwd  = process.cwd();
            const configFilePath = `${cwd}/config/${name}-${this.env}.json`;
            
            console.info(`Load config from ${configFilePath}`);
            
            const checkListJsonStr:any = fs.readFileSync(configFilePath);
            result = JSON.parse(checkListJsonStr);
            this.config = result;
        }else{
            result = this.config;
        }
        return result;
    }
}

export function loadConfig<T>(configName:string){
    const configLoader = new ConfigLoader<T>(GET_NODE_ENV());
    return configLoader.load(configName);
}
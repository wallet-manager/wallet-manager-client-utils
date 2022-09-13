import doenv from 'dotenv';

doenv.config();
if (!process.env.NODE_ENV) {
    throw new Error("NODE_ENV NOT SET in .env!");
}
export const NODE_ENV:string = process.env.NODE_ENV;

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
    const configLoader = new ConfigLoader<T>(NODE_ENV);
    return configLoader.load(configName);
}
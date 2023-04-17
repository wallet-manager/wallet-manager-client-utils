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
    name:string;
    configFilePath:string;
    readonly:boolean;

    constructor(name:string, readonly = true, env:string = GET_NODE_ENV()){
        this.env = env;
        this.name = name;
        this.readonly = readonly;
        const cwd  = process.cwd();
        this.configFilePath = `${cwd}/config/${name}-${this.env}.json`;
    }

    load():T{
        let result:T;
        if(!this.config){            
            console.info(`Load config from ${this.configFilePath}`);
            
            const checkListJsonStr:any = fs.readFileSync(this.configFilePath);
            result = JSON.parse(checkListJsonStr);
            this.config = result;
        }else{
            result = this.config;
        }
        return result;
    }

    write(obj:T, indentation = 0){
        if(this.readonly){
            return false;
        }
        if(this.configFilePath){
            let json:string;
            if(indentation == 0){
                json = JSON.stringify(obj);
            }else{
                json = JSON.stringify(obj, null, 4);
            }
            fs.writeFileSync(this.configFilePath, json);
            return true;
        }else{
            return false;
        }
    }
}

export function loadConfig<T>(configName:string){
    const configLoader = new ConfigLoader<T>(configName);
    return configLoader.load();
}
import doenv from 'dotenv';
import { Config } from '../entities/Config'

doenv.config();
if (!process.env.NODE_ENV) {
    throw new Error("NODE_ENV NOT SET in .env!");
}
export const NODE_ENV:string = process.env.NODE_ENV;

import fs from 'fs';
//const path = require('path');
//var cwd  = path.dirname(fs.realpathSync(__filename));

export class ConfigLoader{
    
    env:string;
    config?:Config;

    constructor(env:string){
        this.env = env;
    }

    load():Config{
        let result:Config;
        if(!this.config){
            const cwd  = process.cwd();
            const configFilePath = `${cwd}/config/config-${this.env}.json`;
            
            console.info(`Load config from ${configFilePath}`);
            
            let checkListJsonStr:any = fs.readFileSync(configFilePath);
            result = JSON.parse(checkListJsonStr);
            this.config = result;
        }else{
            result = this.config;
        }
        return result;
    }
}


const configLoader = new ConfigLoader(NODE_ENV);
export const CONFIG =  configLoader.load();
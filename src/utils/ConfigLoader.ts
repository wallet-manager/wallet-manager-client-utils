import doenv from 'dotenv';

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
    config:any;

    constructor(env:string){
        this.env = env;
        this.config = null;
    }

    load():any{
        if(!this.config){
            const cwd  = process.cwd();
            const configFilePath = `${cwd}/config/config-${this.env}.json`;
            
            console.info(`Load config from ${configFilePath}`);
            
            let checkListJsonStr:any = fs.readFileSync(configFilePath);
            this.config = JSON.parse(checkListJsonStr);
        }
        return this.config;
    }
}

const configLoader = new ConfigLoader(NODE_ENV);
export const CONFIG =  configLoader.load();
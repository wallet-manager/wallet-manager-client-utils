import { Snowflake as Sf, SnowflakeOpts} from 'nodejs-snowflake';
import { Constants } from './Constants';

/**
 * Snowflake class to generate unique ID
 */
export class Snowflake{

    #uid:Sf;

    /**
     * 
     * @param instanceId default 1
     * @param customEpoch default from 2022-01-01
     */
    constructor(instanceId:number = 1, customEpoch:number = Constants.SNOWFLAKE_EPOCH){

        const config:SnowflakeOpts = {
            custom_epoch:customEpoch,
            instance_id: instanceId
        }

        this.#uid = new Sf(config);
    }

    /**
     * Get unique ID
     * @returns 
     */
    getUniqueID():BigInt{
        return this.#uid.getUniqueID();
    }

}


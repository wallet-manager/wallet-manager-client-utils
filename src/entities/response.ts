import { Error } from "./Error";

export interface Response{
    result?: any;
    error?: Error;
}

export default Response;
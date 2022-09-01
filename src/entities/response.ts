import { Error } from "./Error";

export interface Response<T>{
    result: T
    error?: Error;
}
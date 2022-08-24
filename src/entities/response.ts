export interface Error{
    code: number;
    message: string;
    data?: any;
}

export default interface Response{
    result?: any;
    error?: Error;
}

export interface Error{
    code: string;
    message: string;
    data: any;
}

export interface Response{
    result: any;
    error?: Error;
}

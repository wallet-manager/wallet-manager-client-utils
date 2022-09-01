import { Error } from "../entities/Error";

export class Errors {
    static readonly SIGNATURE_NOT_MATCH: Error = {
        code: 1001,
        message: "Signature not match"
    }

    static readonly MESSAGE_EXPIRED: Error = {
        code: 1002,
        message: "Message expired"
    }

    static readonly INVALID_ADDRESS: Error = {
        code: 1003,
        message: "Invalid address"
    }
}
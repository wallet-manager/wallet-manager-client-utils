import { Error } from "../entities/Response";

export default class Errors {
    static readonly SIGNATURE_NOT_MATCH: Error = {
        code: 1001,
        message: "Signature not match"
    }

    static readonly MESSAGE_EXPIRED: Error = {
        code: 1002,
        message: "Message expired"
    }
}
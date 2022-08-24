
export default class Constants {

    static readonly SNOWFLAKE_EPOCH = new Date('2022-01-01').getTime();
    static readonly MESSAGE_EXPIRED_IN_MS = 60000;

    static readonly HEADER_ADDRESS = "X-Message-Address";
    static readonly HEADER_TIMESTAMP = "X-Message-Timestamp";
    static readonly HEADER_SESSION = "X-Message-Session";
    static readonly HEADER_SEQUENCE = "X-Message-Sequence";
    static readonly HEADER_SIGNATURE = "X-Message-Signature";
}


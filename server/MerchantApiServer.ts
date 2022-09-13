
import { Config } from '../src/entities/Config';
import { loadConfig } from '../src/utils/ConfigLoader';
const CONFIG = loadConfig<Config>('config');

import { default as express, Request, Response } from 'express';
import {Constants} from "../src/utils/Constants";
import {Header} from "../src/entities/Header";
import {ExpressVerifier} from "../src/utils/ExpressVerifier";
import {WalletManagerUtils} from "../src/utils/WalletManagerUtils";

const app = express();

//const identity = EthCrypto.createIdentity();
const {identity} = CONFIG;
const {privateKey} = identity;
const {serverPort, whiteListedAddresses} = CONFIG.serverConfig;
const {instanceId} = CONFIG.clientConfig;


const utils = new WalletManagerUtils(privateKey, instanceId);

const verifier = new ExpressVerifier(utils, whiteListedAddresses);


// add verify middleware
verifier.addVerifier(app, "/merchant");

app.get("/keys", (req:Request, res:Response) => {
    res.json(identity);
});

app.post("/merchant", (req:Request, res:Response) => {

    console.log(JSON.stringify(req.headers));

    const address = req.header(Constants.HEADER_ADDRESS);
    const sequence = req.header(Constants.HEADER_SEQUENCE);
    const session = req.header(Constants.HEADER_SESSION);
    const signature = req.header(Constants.HEADER_SIGNATURE);
    const timestamp = req.header(Constants.HEADER_TIMESTAMP);

    const header: Header = {
        address: address?.toString() || "",
        sequence: parseInt(sequence?.toString() || "0"),
        session: session?.toString() || "",
        signature: signature?.toString() || "",
        timestamp: parseInt(timestamp?.toString() || "0")
    };

    const body = req.body;

    console.info("Receive request header.....", header);
    if(typeof body === 'object'){
        console.info("Receive request body object.....", body);
    }else {
        console.info("Receive request body string.....", body);
    }
    res.json({result:true});
});


// start the express server
app.listen(serverPort, () => {
    console.log(`server started at http://localhost:${serverPort}`);
});
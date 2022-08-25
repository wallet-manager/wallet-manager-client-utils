
import {CONFIG} from "../src/utils/ConfigLoader";
import { default as express, Request, Response, NextFunction } from 'express';
import path from "path";
import {Constants} from "../src/utils/Constants";
import {Header} from "../src/entities/Header";
import {ExpressVerifier} from "../src/utils/ExpressVerifier";
import {WalletManagerUtils} from "../src/utils/WalletManagerUtils";

const app = express();

//const identity = EthCrypto.createIdentity();
const {identity} = CONFIG;
const {privateKey} = identity;
const {serverPort} = CONFIG.serverConfig;
const {instanceId} = CONFIG.clientConfig;


const utils = new WalletManagerUtils(privateKey, instanceId);

const verifier = new ExpressVerifier(utils);


// add verify middleware
verifier.addVerifier(app, "/merchant");

app.get("/keys", (req:Request, res:Response) => {
    res.json(identity);
});

app.post("/merchant", (req:Request, res:Response) => {

    console.log(JSON.stringify(req.headers));

    let address = req.header(Constants.HEADER_ADDRESS);
    let sequence = req.header(Constants.HEADER_SEQUENCE);
    let session = req.header(Constants.HEADER_SESSION);
    let signature = req.header(Constants.HEADER_SIGNATURE);
    let timestamp = req.header(Constants.HEADER_TIMESTAMP);

    let header: Header = {
        address: address?.toString() || "",
        sequence: parseInt(sequence?.toString() || "0"),
        session: session?.toString() || "",
        signature: signature?.toString() || "",
        timestamp: parseInt(timestamp?.toString() || "0")
    };

    let body = req.body;

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
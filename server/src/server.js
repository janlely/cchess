import WebSocket from 'ws';
import MessageHandler from './message-handler.js';
import mysql from 'mysql';
import Bluebird from 'bluebird';

const wss = new WebSocket.Server({
    port: 4000,
    perMessageDeflate: {
        zlibDeflateOptions: { // See zlib defaults.
            chunkSize: 1024,
            memLevel: 7,
            level: 3,
        },
        zlibInflateOptions: {
            chunkSize: 10 * 1024
        },
        // Other options settable:
        clientNoContextTakeover: true, // Defaults to negotiated value.
        serverNoContextTakeover: true, // Defaults to negotiated value.
        clientMaxWindowBits: 10,       // Defaults to negotiated value.
        serverMaxWindowBits: 10,       // Defaults to negotiated value.
        // Below options specified as default values.
        concurrencyLimit: 10,          // Limits zlib concurrency for perf.
        threshold: 1024,               // Size (in bytes) below which messages
        // should not be compressed.
    }
});

const mysqlPool = mysql.createPool({
    connectionLimit : 10,
    host     : 'localhost',
    port     : 3306,
    user     : 'root',
    password : 'helloFingo!123',
    database : 'cchess'
});

const mysqldb = Bluebird.promisifyAll(mysqlPool);

let messageHander = new MessageHandler(mysqldb, 'cchess');
wss.on('connection', (ws) => {
    console.log('connection received')
    ws.on('message', (msg) => {
        messageHander.handlerMessage(ws, msg);
    })
    ws.on('close', () => {
        messageHander.handlerClose(ws)
    })
})



import path from "path";
let __dirname = path.dirname(process.argv[1]);
import whitelist from './docs/static/html/components/component_modules/whitelist/whitelist.js'
import express from "express";
import cors from "cors";
import Enqueue from "express-enqueue";
import compression from "compression";
import bodyParser from 'body-parser'
import routes from './Routes/index.js'
import yandex from "./docs/static/html/components/component_modules/webdav/webdav.js";

let app = express();
app.use(compression())
const queue = new Enqueue({
    concurrentWorkers: 4,
    maxSize: 200,
    timeout: 30000
});
app.use(cors())
app.use(queue.getMiddleware());
app.use(bodyParser.json())
let corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
}
app.use( express.static('docs'));
app.use( express.static('static'));

app.options('/storage/set/item', cors(corsOptions))
app.post('/storage/set/item', cors(corsOptions),async (req, res) => {
    let out = await yandex(false,'a','5',  req.body, '/storage/set/item')
    res.json({key:'value'})
})

app.options('/storage/delete/all', cors(corsOptions))
app.post('/storage/delete/all', cors(corsOptions),async (req, res) => {
    let out = await yandex(false,'dex','5',  req.body, '/storage/delete/all')
    res.json({key:'value'})
})

app.options('/matcher/orderbook/{publicKey}', cors(corsOptions))
app.get('/matcher/orderbook/{publicKey}', async (req, res) => {
    res.json({key:'value'})
})

app.get('/', async (req, res) => {
    res.sendFile('/docs/index.html', { root: __dirname });
})

app.use("/api/v1", routes);

app.use(queue.getErrorMiddleware())
export default app

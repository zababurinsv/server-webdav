const fs = require("fs");
const express = require("express");
let cors = require('cors')
const Enqueue = require('express-enqueue')
let yandex  = require( './store.js')
let compression = require('compression')
let formidableMiddleware = require('express-formidable');
let app = express();
app.use(compression())
app.use(cors())
app.use(formidableMiddleware());
const queue = new Enqueue({
    concurrentWorkers: 4,
    maxSize: 200,
    timeout: 30000
});
app.use(queue.getMiddleware());
app.options('*', cors())
let whitelist = ['https://web3-monopoly.web.app','http://localhost:8886','http://localhost:8887','http://localhost:8888','https://xart-3e938.firebaseapp.com','https://xart-3e938.web.app','https://universitykids.ru','https://vashi-faili.web.app','https://vashi-faili.web.app',  'https://www.universitykids.ru', 'https://tuning-fork.firebaseapp.com','http://localhost:8888', 'https://jainagul-tezekbaeva.firebaseapp.com','https://tezekbaeva.firebaseapp.com','http://localhost:6310']

var corsOptionsDelegate = function (req, callback) {
    let corsOptions;
    
    if (whitelist.indexOf(req.header('Origin')) !== -1 || req.header('Origin') === undefined ) {
        corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
    } else {
        corsOptions = { origin: false } // disable CORS for this request
    }
    callback(null, corsOptions) // callback expects two parameters: error and options
}

app.get('/', async (req, res) => {
    res.send({webdav:"1.0.0"})
})

app.get('/createList',cors(corsOptionsDelegate), async (req, res) => {
    let data = await yandex({
        input:'server',
        type:'listPhoto',
        account:account
    }, 'create', 'type')
    await yandex({
        input:'server',
        type:'listPhoto',
        data: JSON.stringify(data),
        account:account
    }, 'set', 'type')
    res.send(data)
})

app.get('/getList',cors(corsOptionsDelegate), async (req, res) => {
try {
    let json = await yandex({
        input:'server',
        type:'listPhoto',
        account:account
    }, 'get', 'type')
    res.send(JSON.parse(json))
}catch (e) {
    res.send({getList:"faled"})
}

})

app.post('/list',cors(corsOptionsDelegate), async (req, res) => {
    try {
        switch (req.fields['type']) {
            case 'moderator':
                let list = await yandex({
                    input:'server',
                    type:'moderator',
                    account:account
                }, 'get', 'type')
                res.json(list)
                break
            default:
                res.json({List:'ok'})
                break
        }
    }catch (e) {
        res.json({List:'fail'})
    }

})

app.post('/file',cors(corsOptionsDelegate), async (req, res) => {
    console.log('4')
    switch (req.fields['type']) {
        case 'moderator':
            let item = await yandex({
                type:'moderatorFile',
                data:`${req.fields['filename']}/${req.fields['basename']}.txt`,
                account:account
            }, 'get', 'type')
            res.json(item)
            break
        default:
            res.json({default:'ok'})
            break
    }
})

app.post('/components', cors(corsOptionsDelegate), async (req, res) => {
    let json = await yandex({
        input:'server',
        type:'components',
        dir: req.fields['dir'],
        dirName: req.fields['timestamp'],
        data:req.fields,
        account:account
    }, 'set', 'type')
    res.send(json)
})

app.get('/moderators',cors(corsOptionsDelegate), async (req, res) => {
    console.log('~~~~~~~~~hhhh~~~~~')
    let json = await yandex({
        input:'server',
        type:'components',
        account:account
    }, 'get', 'type')
    console.log('~~~~~~~~~~~~~~',json)
    res.send(json)
})

app.delete('/moderator/:id',cors(corsOptionsDelegate), async (req, res) => {
    let json = await yandex({
        input:'server',
        type:'moderator',
        name:req.params,
        account:account
    }, 'delete', 'type')
    res.send({delete:"ok"})
})

app.put('/moderator/:id',cors(corsOptionsDelegate), async (req, res) => {
    await yandex({
        input:'server',
        type:'moderator',
        name:req.params['id'],
        data:  req.fields,
        account:account
    }, 'update', 'type')
    res.send({update:'ok'})
})

app.get('/img/:id',cors(corsOptionsDelegate), async (req, res) => {
    console.log('103')
    let data = await yandex({
        input:'yandex',
        type:'img',
        data: req.params.id,
        account:account
    }, 'get', 'type')
    res.send(data)
})

app.post('/setMail', cors(corsOptionsDelegate), async (req, res) => {
    let type = {}
    console.log('102')
    switch(req.files['file']['type']){
        case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
            type = 'docx'
            break
        case "application/pdf":
            type = 'pdf'
            break
        case  "application/msword":
            type = 'doc'
            break
        default:
            break
    }
    if(!req.files['file']['path']){
        res.send(JSON.stringify({status:"not Files"}));
    }else{
        fs.readFile(`${req.files['file']['path']}`,async function (err, data ) {
            let obj =   await yandex({
                input:'index',
                type:'file',
                data: data,
                typeFile:type,
                dirName: req.fields['children'],
                txt: JSON.stringify(req.fields)
            }, 'set', 'type')
            // console.log('123321',obj)
            res.send(JSON.stringify(obj));
        });

    }
})

app.post('/about',cors(corsOptionsDelegate),  async (req, res) => {
    console.log('9')
    let json = await yandex({
        input:'server',
        type:'about',
        data:req.fields['txt'],
        account:account
    }, 'set', 'type')
    console.log(json)
    res.json(json)
})

app.get('/about',cors(corsOptionsDelegate),  async (req, res) => {
    console.log('10')
    try {
        let json = await yandex({
            input:'server',
            type:'about',
            data:req.fields['txt'],
            account:account
        }, 'get', 'type')
        res.json(json)
    }catch (e) {
        console.log(e)
    }

})
app.use(queue.getErrorMiddleware())
module.exports = app

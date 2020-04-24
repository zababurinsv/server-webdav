const { createClient } = require("webdav");
let Jimp = require('jimp');

let client = null
async function auth() {
    const client = createClient(
        "https://webdav.yandex.ru",
        {
            username: "zababurin.s.v@yandex.ru",
            password: "fds744502fds"
        }
    );
    return client
}

module.exports =  (obj, func, ...args) => {
    return new Promise( function (resolve, reject) {
        let out = (obj) => {
            resolve(obj)
        }
        let err = (error) => {
            reject(error)
        }
        switch (func) {
            case 'delete':
                (async (obj, props,data) => {
                    try {
                        switch (obj[props]) {
                            case 'moderator':
                                let client = await auth()
                                await client.deleteFile(`${obj['account']}/upload/moderator/${obj['name']['id']}/${obj['name']['id']}.txt`);
                                await client.deleteFile(`${obj['account']}/upload/moderator/${obj['name']['id']}`);
                                out({delete:'ok'})
                                break
                            default:
                                err(`новы тип ${obj[props]}`)
                                break
                        }
                    } catch (e) { err(e) }
                })(obj, args[0], args[1], args[2], args[3])
                break
            case 'create':
                (async (obj, props,data) => {
                    try {
                        switch (obj[props]) {
                            case 'listPhoto':
                               await (async (obj, props,data) => {
                                    try {
                                        let client = await auth()
                                        const directoryItems = await client.getDirectoryContents(`${obj['account']}/photo`);
                                        out(directoryItems)
                                    } catch (e) { err(e) }
                                })(obj, args[0], args[1], args[2], args[3])
                                break
                            default:
                                err(`новы тип ${obj[props]}`)
                                break
                        }
                    } catch (e) { err(e) }
                })(obj, args[0], args[1], args[2], args[3])
                break
            case 'get':
                (async (obj, props,data) => {
                    try {
                        switch (obj[props]) {
                            case 'img':
                               await (async (obj, props,data) => {
                                    try {
                                        let client = await auth()
                                        const img = await client.getFileContents(`${obj['account']}/photo/${obj['data']}`);
                                        let file = await  Jimp.read(img)
                                            .then(image => {
                                                return image
                                                    .resize(450, Jimp.AUTO)
                                                    .quality(60)
                                                    .getBase64Async("image/jpeg")
                                                // .write('test.jpg')

                                                // Do stuff with the image.
                                            })
                                            .catch(err => {
                                                // Handle an exception.
                                            });
                                        if(!img){
                                            err('должна быть картинка')
                                        }else{
                                            out({
                                                // img:`data:image/png;base64,${Buffer.from(img).toString('base64')}`
                                                img: file
                                            })
                                        }
                                    } catch (e) { err(e) }
                                })(obj, args[0], args[1], args[2], args[3])
                                break
                            case 'about':
                               await (async (obj, props,data) => {
                                    try {
                                        let client = await auth()
                                        let str = await client.getFileContents(`${obj['account']}/upload/about.txt`, { format: "text" });
                                        out(str)
                                    } catch (e) { err(e) }
                                })(obj, args[0], args[1], args[2], args[3])
                                break
                            case 'listPhoto':
                               await (async (obj, props,data) => {
                                    try {

                                        let client = await auth()
                                        const json = await client.getFileContents(`${obj['account']}/list/photo.json`, { format: "text" });
                                        out(JSON.stringify(json))
                                    } catch (e) { err(e) }
                                })(obj, args[0], args[1], args[2], args[3])
                                break
                            case 'moderator':
                              await  (async (obj, props,data) => {
                                    try {

                                        let client = await auth()
                                        const contents = await client.getDirectoryContents(`${obj['account']}/upload/moderator`);
                                        out(contents)
                                    } catch (e) { err(e) }
                                })(obj, args[0], args[1], args[2], args[3])
                                break
                            case 'moderatorFile':
                               await (async (obj, props,data) => {
                                    try {
                                        let client = await auth()

                                        let str = await client.getFileContents(`${obj['data']}`, { format: "text" });
                                        out(str)
                                    } catch (e) { err(e) }
                                })(obj, args[0], args[1], args[2], args[3])
                                break
                            default:
                                err(`новы тип ${obj[props]}`)
                                break
                        }
                    } catch (e) { err(e) }
                })(obj, args[0], args[1], args[2], args[3])
                break
            case 'set':
                (async (obj, props,data) => {
                    try {
                        switch (obj[props]) {
                            case 'about':
                              await  (async (obj, props,data) => {
                                    try {
                                        let client = await auth()
                                        try {
                                            await client.deleteFile(`${obj['account']}/upload/about.txt`);
                                        }catch (e) {

                                        }
                                        await client.putFileContents(`${obj['account']}/upload/about.txt`, obj['data']);


                                        // console.log(txt)
                                        out(obj['data'])
                                    } catch (e) { err(e) }
                                })(obj, args[0], args[1], args[2], args[3])
                                break
                            case 'listPhoto':
                               await (async (obj, props,data) => {
                                    try {
                                        let client = await auth()

                                        await client.putFileContents(`${obj['account']}/list/photo.json`, obj['data']);
                                        out(obj['data'])
                                    } catch (e) { err(e) }
                                })(obj, args[0], args[1], args[2], args[3])
                                break
                            case 'file':
                              await  (async (obj, props,data) => {
                                    try {
                                        if(client === null){
                                            client = await auth()
                                        }
                                        try{
                                            await client.getDirectoryContents(`${obj['account']}/upload/${obj['dirName']}`);
                                        }catch (e) {
                                            await client.createDirectory(`${obj['account']}/upload/${obj['dirName']}`);
                                        }

                                        await client.putFileContents(`${obj['account']}/upload/${obj['dirName']}/${obj['dirName']}.${obj['typeFile']}`, obj['data'], { overwrite: true });
                                        await client.putFileContents(`${obj['account']}/upload/${obj['dirName']}/${obj['dirName']}.txt`, obj['txt']);
                                        out(obj)
                                    } catch (e) { err(e) }
                                })(obj, args[0], args[1], args[2], args[3])
                                break
                            case 'components':
                              await  (async (obj, props,data) => {
                                    try {
                                        if(client === null){
                                            client = await auth()
                                        }
                                        try{
                                            await client.getDirectoryContents(`${obj['account']}/upload/${obj['dir']}`);
                                        }catch (e) {
                                            await client.createDirectory(`${obj['account']}/upload/${obj['dir']}`);
                                        }
                                        try{
                                            await client.getDirectoryContents(`${obj['account']}/upload/${obj['dir']}/${obj['dirName']}`);
                                        }catch (e) {
                                            await client.createDirectory(`${obj['account']}/upload/${obj['dir']}/${obj['dirName']}`);
                                        }
                                        await client.putFileContents(`${obj['account']}/upload/${obj['dir']}/${obj['dirName']}/${obj['dirName']}.txt`, obj['data']);
                                        out(obj)
                                    } catch (e) { err(e) }
                                })(obj, args[0], args[1], args[2], args[3])
                                break
                            default:
                                err(`новы тип ${obj[props]}`)
                                break
                        }
                    } catch (e) { err(e) }
                })(obj, args[0], args[1], args[2], args[3])
                break
            case 'update':
                (async (obj, props,data) => {
                    try {
                        switch (obj[props]) {
                            case 'moderator':
                            await    (async (obj, props,data) => {
                                    try {
                                        let client = await auth()
                                        try {
                                            await client.deleteFile(`${obj['account']}/upload/moderator/${obj['name']}/${obj['name']}.txt`);
                                        }catch (e) {

                                        }
                                        await client.putFileContents(`${obj['account']}/upload/moderator/${obj['name']}/${obj['name']}.txt`, obj['data']);
                                        out({update:'ok'})
                                    } catch (e) { err(e) }
                                })(obj, args[0], args[1], args[2], args[3])
                                break
                            default:
                                err(`новая функция ${func}`)
                                break
                        }
                    } catch (e) { err(e) }
                })(obj, args[0], args[1], args[2], args[3])
                break
            case 'default':
                (async (obj, props,data) => {
                    try {
                        switch (obj[props]) {
                            case 'img':
                             await   (async (obj, props,data) => {
                                    try {
                                        let client = await auth()
                                        const buff = await client.getFileContents("/Москва.jpg");
                                        out( `<img src ="data:image/png;base64,${Buffer.from(buff).toString('base64')}"/>`)
                                    } catch (e) { err(e) }
                                })(obj, args[0], args[1], args[2], args[3])
                                break
                            default:
                                err(`новая функция ${func}`)
                                break
                        }
                    } catch (e) { err(e) }
                })(obj, args[0], args[1], args[2], args[3])
                break
            default:
                err(`новая функция ${func}`)
                break
        }
    })
}

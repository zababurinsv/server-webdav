import webdav from "webdav";
import fs from "fs";

let storage = {}
storage.staticProperty = {}
storage.staticProperty.client = {}
storage.staticProperty.client = webdav.createClient(
    "https://webdav.yandex.ru",
    {
        username: "zababurin.s.v@yandex.ru",
        password: "fds744502fds"
    }
);

export default (view, property, color, substrate, relation)=> {
    return new Promise(async (resolve, reject) => {
        let out = (obj) => {
            resolve(obj)
        }
        let err = (error) => {
            console.log('~~~ err ~~~', error)
            reject(error)
        }
        switch (relation) {
            case '/storage/audio/streem':
                try {
                    if (await storage.staticProperty.client.exists("/audio-streem") === false) {
                        await storage.staticProperty.client.createDirectory("/audio-streem");
                        try{
                            let stream = fs.createReadStream("/Music/song.mp3").pipe(storage.staticProperty.client.createWriteStream("/audio-streem/test.mp3"))
                            out(stream)
                        }catch (e) {
                            out({_:'error', error: e})
                        }
                    }else{
                        try{
                            let item = await storage.staticProperty.client.putFileContents(`/dex/${substrate.id}.json`, substrate);
                            out(item)
                        }catch (e) {
                            out({_:'error', error: e})
                        }
                    }
                } catch (e) { err(e) }
                break
            case '/storage/set/item':
                try {
                    if (await storage.staticProperty.client.exists("/dex") === false) {
                        await storage.staticProperty.client.createDirectory("/dex");
                       try{
                       let item = await storage.staticProperty.client.putFileContents(`/dex/${substrate.id}.json`, substrate);

                           out(item)
                       }catch (e) {
                           out({_:'error', error: e})
                       }
                    }else{
                        try{
                            let item = await storage.staticProperty.client.putFileContents(`/dex/${substrate.id}.json`, substrate);
                            out(item)
                        }catch (e) {
                            out({_:'error', error: e})
                        }
                    }
                } catch (e) { err(e) }
                break
            case'/storage/delete/all':
                try {
                    let list = {}

                    if (await storage.staticProperty.client.exists("/dex") === false) {

                    }else{
                        list = await storage.staticProperty.client.getDirectoryContents(`/dex`);

                    }
                    out(list)
                    // await storage.staticProperty.client.putFileContents(`${obj['account']}/upload/${obj['dirName']}/${obj['dirName']}.${obj['typeFile']}`, obj['data'], { overwrite: true });
                    // await storage.staticProperty.client.putFileContents(`${obj['account']}/upload/${obj['dirName']}/${obj['dirName']}.txt`, obj['txt']);
                } catch (e) {
                    err(e)
                }
                break
            case'/storage/delete/all/items':
                try {
                    let list = {}

                    if (await storage.staticProperty.client.exists("/dex") === false) {

                    }else{
                        await storage.staticProperty.client.putFileContents(`/dex/${Date.now()}.json`, substrate);
                        for(let item of substrate){
                            await storage.staticProperty.client.deleteFile(`${item}`);
                        }

                    }
                    out({_:'archive',archive:'true' })
                } catch (e) {
                    out({_:'archive',archive:'false', error: e})
                }
                break
            case '/matcher/orderbook/{publicKey}':
                let directoryItems = {}
                if (await storage.staticProperty.client.exists("/dex") === false) {
                    directoryItems = {_:'status', status:'not found'}
                }else{
                    directoryItems = await storage.staticProperty.client.getDirectoryContents(`/dex`);
                }
                out(directoryItems)
                break
            default:
                console.log('запрос не обрабатывается', view, property, color, substrate, relation)
                break
        }
    })
}
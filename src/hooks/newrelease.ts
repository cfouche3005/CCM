import { Elysia } from "elysia";
import PocketBase from 'pocketbase';
import { requestLogger } from "../log/log";
import { TypedPocketBase } from "../types/pocketbase.types";



interface authData {
    user : string
    password : string    
}

interface nftyJSON {
    topic: string
    title: string
    message: string
    tags: string[]
    priority: number
    icon: string
    click: string
    markdown: boolean
    actions: Object[]


}

function basicAuthParser(authHeader :string){
    //console.log("beginning auth parsing ",authHeader)
    const authArray: string[] = Buffer.from(authHeader.split(' ')[1],'base64').toString().split(':');
    const authData: authData = {
        user : authArray[0],
        password : authArray[1]
    }
    //console.log("auth parsed ",authData)
    return authData
}

async function getPBdata(auth :authData,project :string) {
    //console.log("beginning pb data fetching")
    const pb = new PocketBase('http://127.0.0.1:' + (process.env.PB_PORT || 8090)) as TypedPocketBase;
    const pbAuth = await pb.collection('users').authWithPassword(auth.user,auth.password);
    const software = await pb.collection('monitored_software').getFirstListItem(`project="${project}"`, {
        expand: "provider"
    })
    pb.authStore.clear();
    //console.log("pb data fetched ",software)
    return software
}

function nftyParser(pocketbasedata: any,newreleasedata: any){
    //console.log("beginning nfty parsing")
    const ntfy: nftyJSON = {
        topic : pocketbasedata.topic,
        title : pocketbasedata.name + " " + newreleasedata.version,
        message : "Mise à jour disponible",
        tags : ["Release","tada"].concat([newreleasedata.version]).concat(pocketbasedata.tags || []),
        priority : 3,
        icon : pocketbasedata.icon,
        click : `ntfy://${ process.env.NTFY_DOMAIN || "ntfy.sh"}/` + pocketbasedata.topic,
        markdown : true,
        actions : [{
            action : "view",
            label : "Changelog",
            url : pocketbasedata.expand.provider.changelog_url[0]+pocketbasedata.project+pocketbasedata.expand.provider.changelog_url[1]+newreleasedata.version
        }].concat(pocketbasedata.actions || [])
    }
    //console.log("nfty parsed ",ntfy)
    return ntfy;
}

function sendToNtfy(ntfyBody :nftyJSON) {
    //console.log("beginning nfty sending")
    fetch('https://'+ process.env.NTFY_DOMAIN || "ntfy.sh",{
        method: "POST",
        body: JSON.stringify(ntfyBody),
        headers : {
            Authorization: "Bearer " + process.env.NTFY_APIKEY || ""
        }
    })
    //console.log("nfty sent")
}

const newrelease = new Elysia()
        .post("/newrelease",async (context : any) => {
            requestLogger(context)
            sendToNtfy(nftyParser(await getPBdata(basicAuthParser(context.headers.authorization || ""),context.body.project), context.body))
        })

export {newrelease}
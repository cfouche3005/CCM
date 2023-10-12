import { Elysia } from "elysia";
import PocketBase from 'pocketbase';



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
    const authArray: string[] = Buffer.from(authHeader.split(' ')[1],'base64').toString().split(':');
    const authData: authData = {
        user : authArray[0],
        password : authArray[1]
    }
    return authData
}

async function getPBdata(auth :authData,project :string) {
    const pb = new PocketBase('http://127.0.0.1:8090');
    const pbAuth = await pb.collection('users').authWithPassword(auth.user,auth.password);
    const software = await pb.collection('monitored_software').getFirstListItem(`project="${project}"`, {
        expand: "provider"
    })
    pb.authStore.clear();
    return software
}

function nftyParser(pocketbasedata: any,newreleasedata: any){
    const ntfy: nftyJSON = {
        topic : pocketbasedata.topic,
        title : pocketbasedata.name + " " + newreleasedata.version,
        message : "Mise à jour disponible",
        tags : ["Release","tada"].concat([newreleasedata.version]).concat(pocketbasedata.tags),
        priority : 3,
        icon : pocketbasedata.icon,
        click : `ntfy://${ process.env.NTFY_DOMAIN || "ntfy.sh"}/` + pocketbasedata.topic,
        markdown : true,
        actions : [{
            action : "view",
            label : "Changelog",
            url : pocketbasedata.expand.provider.changelog_url[0]+pocketbasedata.project+pocketbasedata.expand.provider.changelog_url[1]+newreleasedata.version
        }].concat(pocketbasedata.actions)
    }
    return ntfy;
}

function sendToNtfy(ntfyBody :nftyJSON) {
    fetch('https://'+ process.env.NTFY_DOMAIN || "ntfy.sh",{
        method: "POST",
        body: JSON.stringify(ntfyBody),
        headers : {
            Authorization: "Bearer " + process.env.NTFY_APIKEY || ""
        }
    })
}

const newrelease = new Elysia()
        .post("/newrelease",async (context : any) => {
            sendToNtfy(nftyParser(await getPBdata(basicAuthParser(context.headers.authorization || ""),context.body.project), context.body))
        })

export {newrelease}
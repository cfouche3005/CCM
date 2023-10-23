import { Elysia } from "elysia";
import PocketBase from 'pocketbase';
import eventsource from "eventsource";
import { TypedPocketBase,ProviderResponse,MonitoredSoftwareResponse } from "../types/pocketbase.types";
import { Project,AddProjectBody } from "../types/newrelease.types";

// @ts-ignore
global.EventSource = eventsource;

async function AutoNewRelease() {
    const pb = new PocketBase('http://127.0.0.1:' + (process.env.PB_PORT || 8090)) as TypedPocketBase;
    await pb.collection('users').authWithPassword(process.env.NRL_USER || "", process.env.NRL_PASS || "");
    pb.collection("monitored_software").subscribe('*', async (e) => {
        switch (e.action){
            case "create":
                await CreateProject(e.record,pb)
                break;
            case "delete":
                await DeleteProject(e.record,pb)
        }
    })
}

async function CreateProject(soft_record:MonitoredSoftwareResponse,pb:TypedPocketBase){
    const provider_record:ProviderResponse = await pb.collection('provider').getOne(soft_record.provider);
    const NR_Body: AddProjectBody = {
        provider: provider_record.name,
        name: soft_record.project,
        email_notification: "none",
        webhooks: ["wf32msfq6h6jqckh9fp24qww04"],
        exclude_prereleases: true
    }
    const NR_response = await fetch("https://api.newreleases.io/v1/projects",{
        method: "POST",
        body: JSON.stringify(NR_Body),
        headers: {
            "X-Key": process.env.NRL_APIKEY || ""
        }
    })
    console.log(NR_response)
}

async function DeleteProject(soft_record:MonitoredSoftwareResponse,pb:TypedPocketBase) {
    const provider_record:ProviderResponse = await pb.collection('provider').getOne(soft_record.provider);
    const NR_response = await fetch(`https://api.newreleases.io/v1/projects/${provider_record.name}/${soft_record.project}`,{
        method: "DELETE",
        headers: {
            "X-Key": process.env.NRL_APIKEY || ""
        }
    })
    console.log(NR_response)
}

export {AutoNewRelease}
import { Elysia } from "elysia";
import { newrelease } from "./hooks/newrelease";

const webhooks = new Elysia({prefix: "/webhook"})
    .post("/",() => "Please specify an app")
    .use(newrelease)

const app = new Elysia()
    .get("/", () => "Hello Elysia")
    .use(webhooks);

app.get("/ping",() => new Response(
  JSON.stringify("pong"),
    {   
      status : 200,
      headers: {
        'Content-Type': 'application/json'
      }
    }
))

app.listen(process.env.PORT || 8080)

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);

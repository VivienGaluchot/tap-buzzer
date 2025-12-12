import * as st from "./static.ts";
import * as ws from "./ws.ts";

function getPort(): number {
    const portEnv = Deno.env.get("SERVER_PORT");
    if (portEnv) {
        return parseInt(portEnv, 10);
    }
    return 80;
}

Deno.serve({ port: getPort(), hostname: "0.0.0.0" }, async (req) => {
    console.log(req.url);

    if (req.headers.get("upgrade") == "websocket") {
        return ws.onWebSocket(req);
    }

    if (req.method == "GET") {
        return st.onGet(req);
    } else if (req.method == "POST") {
        return await ws.onPost(req);
    }
    return new Response("Bad request", { status: 400 });
});

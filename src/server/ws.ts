import { HostUpdate, TapRequest, TapResponse } from "../api.ts";

const TAP_RELOAD_INTERVAL_MS = 3000;

let endOfTap = 0;
let acceptedId: string | null = null;
const hostSockets = new Set<WebSocket>();

//-------------------------------------------------------------------------------------------------
// Private functions
//-------------------------------------------------------------------------------------------------

async function tap(req: Request): Promise<Response> {
    const reqData: TapRequest = await req.json();

    const now = Date.now();
    let status: "accepted" | "refused";
    if (now < endOfTap) {
        if (reqData.id == acceptedId) {
            status = "accepted";
        } else {
            status = "refused";
        }
    } else {
        status = "accepted";
        endOfTap = now + TAP_RELOAD_INTERVAL_MS;
        acceptedId = reqData.id;
        for (const socket of hostSockets) {
            const update: HostUpdate = { name: reqData.name, remainingTime: TAP_RELOAD_INTERVAL_MS };
            socket.send(JSON.stringify(update));
        }
    }
    const remainingTime = Math.max(endOfTap - now, 0);

    const resData: TapResponse = { status, elapsedTime: TAP_RELOAD_INTERVAL_MS - remainingTime, remainingTime };
    return new Response(JSON.stringify(resData), {
        status: 200,
        headers: { "content-type": "application/json; charset=utf-8" },
    });
}

//-------------------------------------------------------------------------------------------------
// Public functions
//-------------------------------------------------------------------------------------------------

export async function onPost(req: Request): Promise<Response> {
    const url = new URL(req.url);
    if (url.pathname == "/tap") {
        return await tap(req);
    } else {
        return new Response("Not found", { status: 404 });
    }
}

export function onWebSocket(req: Request): Response {
    const url = new URL(req.url);
    if (url.pathname == "/host-update") {
        const { socket, response } = Deno.upgradeWebSocket(req);
        socket.onopen = () => {
            hostSockets.add(socket);
        };
        socket.onclose = () => {
            hostSockets.delete(socket);
        };
        return response;
    } else {
        return new Response("Not found", { status: 404 });
    }
}

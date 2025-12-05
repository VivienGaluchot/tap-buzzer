import indexHmtl from "./client/index.html" with { type: "text" };
import indexJs from "./client/index.js" with { type: "text" };

const TAP_RELOAD_INTERVAL_MS = 3000;

function getPort(): number {
    const portEnv = Deno.env.get("SERVER_PORT");
    if (portEnv) {
        return parseInt(portEnv, 10);
    }
    return 80;
}

let endOfTap = 0;
let acceptedId: string | null = null;

Deno.serve({ port: getPort(), hostname: "0.0.0.0" }, async (req) => {
    console.log(req.url);

    const url = new URL(req.url);

    if (req.method == "GET") {
        if (url.pathname == "/" || url.pathname == "/index.html") {
            return new Response(indexHmtl, {
                status: 200,
                headers: { "content-type": "text/html; charset=utf-8" },
            });
        } else if (url.pathname == "/index.js") {
            return new Response(indexJs, {
                status: 200,
                headers: { "content-type": "application/javascript; charset=utf-8" },
            });
        } else {
            return new Response("Not found", { status: 404 });
        }
    }

    if (req.method == "POST") {
        if (url.pathname == "/tap") {
            const reqData = await req.json();

            const now = Date.now();
            let status;
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
            }
            const remainingTime = Math.max(endOfTap - now, 0);

            const resData = { status, elapsedTime: TAP_RELOAD_INTERVAL_MS - remainingTime, remainingTime };
            return new Response(JSON.stringify(resData), {
                status: 200,
                headers: { "content-type": "application/json; charset=utf-8" },
            });
        }
    }

    return new Response("Bad request", { status: 400 });
});

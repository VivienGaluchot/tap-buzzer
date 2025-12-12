import indexHmtl from "../client/index.html" with { type: "text" };
import _indexTs from "../client/index.ts" with { type: "text" };
import hostHmtl from "../client/host.html" with { type: "text" };
import _hostTs from "../client/host.ts" with { type: "text" };

import buzzerBravo from "../client/audio/buzzer_bravo.mp3" with { type: "bytes" };
import buzzerCrazyfrog from "../client/audio/buzzer_crazyfrog.mp3" with { type: "bytes" };
import buzzerTanana from "../client/audio/buzzer_tanana.mp3" with { type: "bytes" };
import buzzerPouet from "../client/audio/buzzer_pouet.mp3" with { type: "bytes" };
import buzzerPouetPouet from "../client/audio/buzzer_pouetpouet.mp3" with { type: "bytes" };
import buzzerTudum from "../client/audio/buzzer_tudum.mp3" with { type: "bytes" };
import buzzerBilili from "../client/audio/buzzer_bilili.mp3" with { type: "bytes" };

//-------------------------------------------------------------------------------------------------
// Private functions
//-------------------------------------------------------------------------------------------------

const CWD = Deno.cwd();

async function bundle(name: string): Promise<string> {
    const bundleResult = await Deno.bundle({
        entrypoints: [`${CWD}/src/client/${name}.ts`],
        outputDir: "dist",
        platform: "browser",
        minify: true,
        write: false,
    });
    if (!bundleResult.success) {
        throw new Error(`Failed to bundle ${name}.js`);
    }
    for (const outputFile of bundleResult.outputFiles ?? []) {
        if (outputFile.path == `${CWD}/dist/${name}.js`) {
            return outputFile.text();
        }
    }
    throw new Error(`Failed to bundle ${name}.js`);
}

const indexJs = await bundle("index");
const hostJs = await bundle("host");

//-------------------------------------------------------------------------------------------------
// Public functions
//-------------------------------------------------------------------------------------------------

export function onGet(req: Request): Response {
    const url = new URL(req.url);
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
    } else if (url.pathname == "/host" || url.pathname == "/host.html") {
        return new Response(hostHmtl, {
            status: 200,
            headers: { "content-type": "text/html; charset=utf-8" },
        });
    } else if (url.pathname == "/host.js") {
        return new Response(hostJs, {
            status: 200,
            headers: { "content-type": "application/javascript; charset=utf-8" },
        });
    } else if (url.pathname == "/audio/buzzer_bravo.mp3") {
        return new Response(buzzerBravo, {
            status: 200,
            headers: { "content-type": "audio/mp3" },
        });
    } else if (url.pathname == "/audio/buzzer_crazyfrog.mp3") {
        return new Response(buzzerCrazyfrog, {
            status: 200,
            headers: { "content-type": "audio/mp3" },
        });
    } else if (url.pathname == "/audio/buzzer_tanana.mp3") {
        return new Response(buzzerTanana, {
            status: 200,
            headers: { "content-type": "audio/mp3" },
        });
    } else if (url.pathname == "/audio/buzzer_pouet.mp3") {
        return new Response(buzzerPouet, {
            status: 200,
            headers: { "content-type": "audio/mp3" },
        });
    } else if (url.pathname == "/audio/buzzer_pouetpouet.mp3") {
        return new Response(buzzerPouetPouet, {
            status: 200,
            headers: { "content-type": "audio/mp3" },
        });
    } else if (url.pathname == "/audio/buzzer_tudum.mp3") {
        return new Response(buzzerTudum, {
            status: 200,
            headers: { "content-type": "audio/mp3" },
        });
    } else if (url.pathname == "/audio/buzzer_bilili.mp3") {
        return new Response(buzzerBilili, {
            status: 200,
            headers: { "content-type": "audio/mp3" },
        });
    } else {
        return new Response("Not found", { status: 404 });
    }
}

import indexHmtl from "../client/index.html" with { type: "text" };
import _indexTs from "../client/index.ts" with { type: "text" };

const CWD = Deno.cwd();

//-------------------------------------------------------------------------------------------------
// Private functions
//-------------------------------------------------------------------------------------------------

async function getIndexJs(): Promise<string> {
    const bundleResult = await Deno.bundle({
        entrypoints: [`${CWD}/src/client/index.ts`],
        outputDir: "dist",
        platform: "browser",
        minify: true,
        write: false,
    });
    if (!bundleResult.success) {
        throw new Error("Failed to bundle index.js");
    }
    for (const outputFile of bundleResult.outputFiles ?? []) {
        if (outputFile.path == `${CWD}/dist/index.js`) {
            return outputFile.text();
        }
    }
    throw new Error("Failed to bundle index.js");
}

const indexJs = await getIndexJs();

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
    } else {
        return new Response("Not found", { status: 404 });
    }
}

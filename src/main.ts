function getPort(): number {
    const portEnv = Deno.env.get("SERVER_PORT");
    if (portEnv) {
        return parseInt(portEnv, 10);
    }
    return 80;
}

Deno.serve({ port: getPort(), hostname: "0.0.0.0" }, (_req) => {
    console.log(_req.url);
    return new Response("Hello, World!");
});

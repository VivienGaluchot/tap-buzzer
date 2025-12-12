import { HostUpdate } from "../api.ts";
import { assertDefined } from "../common.ts";

//-------------------------------------------------------------------------------------------------
// DOM
//-------------------------------------------------------------------------------------------------

const appDiv = assertDefined(document.getElementById("app"));
const barDiv = assertDefined(document.getElementById("bar"));
const idDiv = assertDefined(document.getElementById("id"));

//-------------------------------------------------------------------------------------------------
// Private variables
//-------------------------------------------------------------------------------------------------

// Timeout handle for resetting the UI state.
let timeout: number | undefined;

//-------------------------------------------------------------------------------------------------
// Private functions
//-------------------------------------------------------------------------------------------------

function set(update: HostUpdate) {
    for (const animation of barDiv.getAnimations()) {
        animation.cancel();
    }

    appDiv.classList.add("ok");
    idDiv.textContent = `${update.name ?? "?"}`;

    const duration = update.remainingTime;
    const keyFrames = new KeyframeEffect(
        barDiv,
        [{ width: "0%" }, { width: "100%" }],
        { duration, fill: "forwards" },
    );

    const animation = new Animation(keyFrames);
    animation.play();

    clearTimeout(timeout);
    timeout = setTimeout(() => {
        appDiv.classList.remove("ok");
        idDiv.textContent = "";
        timeout = undefined;
    }, update.remainingTime);
}

//-------------------------------------------------------------------------------------------------
// Websocket connection
//-------------------------------------------------------------------------------------------------

const socket = new WebSocket("host-update");
socket.onmessage = (event) => {
    const update: HostUpdate = JSON.parse(event.data);
    set(update);
};

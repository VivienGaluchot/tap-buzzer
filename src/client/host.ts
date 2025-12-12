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

const audios = [
    { w: 1, audio: new Audio("/audio/buzzer_bravo.mp3") },
    { w: 1, audio: new Audio("/audio/buzzer_crazyfrog.mp3") },
    { w: 1, audio: new Audio("/audio/buzzer_poke.mp3") },
    { w: 1, audio: new Audio("/audio/buzzer_bilili.mp3") },
    { w: 3, audio: new Audio("/audio/buzzer_pouet.mp3") },
    { w: 3, audio: new Audio("/audio/buzzer_pouetpouet.mp3") },
    { w: 3, audio: new Audio("/audio/buzzer_tudum.mp3") },
];

const weightedAudios: HTMLAudioElement[] = [];
audios.forEach((item) => {
    const clone: HTMLAudioElement[] = Array(item.w).fill(item.audio);
    weightedAudios.push(...clone);
});

//-------------------------------------------------------------------------------------------------
// Private functions
//-------------------------------------------------------------------------------------------------

function set(update: HostUpdate) {
    for (const animation of barDiv.getAnimations()) {
        animation.cancel();
    }

    weightedAudios[Math.floor(Math.random() * weightedAudios.length)]?.play();

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

socket.onclose = () => {
    appDiv.classList.add("ko");
    idDiv.textContent = "☠";
};

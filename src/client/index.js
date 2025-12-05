const appDiv = document.getElementById("app");
const barDiv = document.getElementById("bar");

const id = Math.random().toString(36).substring(2, 15);

let timeout = null;

appDiv.onclick = async () => {
    const reqData = { id };
    const res = await fetch("/tap", { body: JSON.stringify(reqData), method: "POST" });
    const resData = await res.json();
    if (resData.status == "accepted") {
        appDiv.classList.remove("ko");
        appDiv.classList.add("ok");
    } else {
        appDiv.classList.remove("ok");
        appDiv.classList.add("ko");
    }

    for (const animation of barDiv.getAnimations()) {
        animation.cancel();
    }

    const duration = resData.elapsedTime + resData.remainingTime;
    const keyFrames = new KeyframeEffect(
        barDiv,
        [{ width: "0%" }, { width: "100%" }],
        { duration, fill: "forwards" },
    );

    const animation = new Animation(keyFrames);
    animation.currentTime = resData.elapsedTime;
    animation.play();

    clearTimeout(timeout);
    timeout = setTimeout(() => {
        appDiv.classList.remove("ok");
        appDiv.classList.remove("ko");
        timeout = null;
    }, resData.remainingTime);
};

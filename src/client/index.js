const appDiv = document.getElementById("app");

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
    clearTimeout(timeout);
    timeout = setTimeout(() => {
        appDiv.classList.remove("ok");
        appDiv.classList.remove("ko");
    }, resData.remainingTime);
};

let socket = io.connect();

socket.on("messages", (data) => {
    render(data);
});

function render(data) {
    const html = data
        .map(
            (d) => `<div>
    <strong style='color:blue'>${d.author}</strong><span style="color:brown">[${d.day}-${d.hour}]</span>:
    <em style="color:green">${d.text}</em></div>`
        )
        .join("");
    document.getElementById("msgContainer").innerHTML = html;
}

function addMessage(e) {
    let hour = new Date();
    const msgForm = document.getElementById("msgForm");
    msgForm.addEventListener("submit", (e) => {
        e.preventDefault();
    });
    const msg = {
        author: msgForm[0].value,
        text: msgForm[1].value,
        day: hour.toLocaleDateString(),
        hour: hour.toLocaleTimeString(),
    };
    socket.emit("newMsg", msg);
    return false;
}

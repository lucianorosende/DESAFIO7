let socket = io.connect();

socket.on("messages", (data) => {
    render(data);
});
socket.on("products", (products) => {
    document.getElementById("datos").innerHTML = dataTable(products);
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

const form = document.getElementById("tableForm");
form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = {
        nombre: form[0].value,
        descripcion: form[1].value,
        precio: form[2].value,
        foto: form[3].value,
        codigo: form[4].value,
        stock: form[5].value,
    };
    form.reset();
    socket.emit("update", data);
});

function dataTable(products) {
    let res = "";
    if (products.length) {
        res += `
        <style>
            .table td, .table th {
                vertical-align : middle;
            }
        </style>
        <div class="table-responsive">
            <table class="table table-dark">
                <tr> <th>Nombre</th> <th>Descripcion</th> <th>Precio</th> <th>Foto</th> <th>Codigo</th> <th>Stock</th> <th>ID</th> </tr>
        `;
        res += products
            .map(
                (p) => `
                <tr>
                    <td>${p.nombre}</td>
                    <td>${p.descripcion}</td>
                    <td>$${p.precio}</td>
                    <td><img width="50" src="${p.foto}" alt="not found"></td>
                    <td>${p.codigo}</td>
                    <td>${p.stock}</td>
                    <td>${p.id}</td>
                </tr>
        `
            )
            .join(" ");
        res += `
            </table>
        </div>`;
    }
    return res;
}

function deleteProducts() {
    socket.emit("deleteProducts", "delete");
}
function deleteMessages() {
    socket.emit("deleteMessages", "delete");
}

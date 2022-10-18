import { io } from "../server.js";
import Contenedor from "./products.js";
import knex from "knex";
import { options } from "../options/optionsSQLITE.js";

// Websocket ----------------------------------------------------------------------------
const knexstart = knex(options);
const Container = new Contenedor();

const Connect = () => {
    io.on("connection", async (socket) => {
        let dataDB = await knexstart("messages").select("*");
        console.log("new connection");
        socket.emit("messages", dataDB);

        socket.emit("products", await Container.getWithKnex());
        socket.on("update", async (data) => {
            await Container.saveProduct(data);
            io.sockets.emit("products", await Container.getWithKnex());
        });

        socket.on("newMsg", async (data) => {
            await knexstart("messages").insert(data);
            let DBUpdate = await knexstart("messages").select("*");
            io.sockets.emit("messages", DBUpdate);
        });
        socket.on("deleteProducts", async (data) => {
            if (data === "delete") {
                await Container.deleteAll();
                io.sockets.emit("products", await Container.getWithKnex());
            }
        });
        socket.on("deleteMessages", async (data) => {
            if (data === "delete") {
                await knexstart("messages").del();
                let DBUpdate = await knexstart("messages").select("*");
                io.sockets.emit("messages", DBUpdate);
            }
        });
    });
};

export default Connect;

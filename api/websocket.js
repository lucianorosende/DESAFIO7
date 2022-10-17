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
        let max = 20;
        console.log("new connection");
        socket.emit("messages", dataDB);

        // socket.emit("products", Container.getAll());
        // socket.on("update", (data) => {
        //     if ((data = "ok")) {
        //         io.sockets.emit("products", Container.getAll());
        //     }
        // });

        socket.on("newMsg", async (data) => {
            await knexstart("messages").insert(data);
            let DBUpdate = await knexstart("messages").select("*");
            io.sockets.emit("messages", DBUpdate);
            if (DBUpdate.length > max) {
                await knexstart("messages").del();
            }
        });
    });
};

export default Connect;

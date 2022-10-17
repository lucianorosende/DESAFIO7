import { options } from "../options/optionsMARIA.js";
import knex from "knex";
const knexstart = knex(options);

export const MARIADBTable = async () => {
    // await knexstart("test").del();

    let isTable = await knexstart.schema.hasTable("products");
    if (!isTable) {
        knexstart.schema
            .createTable("products", (table) => {
                table.string("nombre");
                table.string("descripcion");
                table.string("codigo");
                table.string("foto");
                table.integer("precio");
                table.integer("stock");
                table.integer("id");
                table.string("timestamp");
            })
            .then(() => {
                console.log("created table");
            })
            .catch((e) => {
                console.log(e);
            })
            .finally(() => {
                knexstart.destroy();
            });
    } else {
        console.log("mariaDB table exists");
    }
};

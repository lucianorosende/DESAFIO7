import { options } from "../options/optionsSQLITE.js";
import knex from "knex";
const knexstart = knex(options);

export const SQLITETable = async () => {
    let isTable = await knexstart.schema.hasTable("test");
    if (!isTable) {
        knexstart.schema
            .createTable("test", (table) => {
                table.increments("id");
                table.integer("precio");
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
        console.log("SQLITE table exists");
    }

    await knexstart("test").insert({ precio: 25 });
    let data = await knexstart("test").select("*");
    console.log(data);
};

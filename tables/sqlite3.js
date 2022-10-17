import { options } from "../options/optionsSQLITE.js";
import knex from "knex";
const knexstart = knex(options);

export const SQLITETable = async () => {
    let isTable = await knexstart.schema.hasTable("messages");
    if (!isTable) {
        knexstart.schema
            .createTable("messages", (table) => {
                table.string("author");
                table.string("text");
                table.string("day");
                table.string("hour");
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
};

export const dropSQLITETable = async () => {
    await knexstart.schema.dropTable("messages");
};

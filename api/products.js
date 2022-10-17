import fs from "fs";
import { route } from "../router/products.router.js";
import knex from "knex";
import { options } from "../options/optionsMARIA.js";

const knexstart = knex(options);

class Contenedor {
    static products = [];

    async getWithKnex() {
        return await knexstart("products").select("*");
    }
    async getById(num) {
        let data = await knexstart("products").select("*");
        let findProduct = data.find((product) => product.id == num);
        if (findProduct === undefined) return null;
        return findProduct;
    }
    async saveProduct(product) {
        const read = await knexstart("products").select("*");
        const { nombre, descripcion, codigo, foto, precio, stock } = product;
        if (!nombre || !descripcion || !codigo || !foto || !precio || !stock) {
            return null;
        }
        if (product.id === undefined) {
            product.id = 1;
            if (read.length > 0) {
                product.id = read[read.length - 1].id + 1;
            }
        }
        product.timestamp = new Date().toLocaleTimeString();
        await knexstart("products").insert(product);
        return product.id;
    }
    async update(id, obj) {
        let newData = await this.getWithFs();
        newData = JSON.parse(JSON.stringify(newData));
        let index = newData.findIndex((product) => product.id == id);
        if (index >= 0) {
            newData.splice(index, 1, { ...obj, id: parseInt(id) });
            await fs.promises.writeFile(
                route,
                JSON.stringify(newData, null, 2)
            );
            return newData[index];
        } else {
            return null;
        }
    }
    async delete(id) {
        let data = await this.getWithKnex();
        const getItem = await this.getById(id);
        let filter = data.filter((product) => product.id != id);
        if (filter.length === 0) {
            return null;
        } else {
            await knexstart("products").del();
            await knexstart("products").insert(filter);
        }

        if (getItem === null) {
            return null;
        }
        return filter;
    }
    async deleteAll() {
        return await knexstart("products").del();
    }
}

export default Contenedor;

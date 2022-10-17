import knex from "knex";
import { options } from "../options/optionsMARIA.js";

const knexstart = knex(options);

class Contenedor {
    async getWithKnex() {
        return await knexstart("products").select("*");
    }
    async getById(id) {
        let findProduct = await knexstart("products").where("id", id);
        if (findProduct.length === 0) return null;
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
        let find = await knexstart("products").where("id", id).update(obj);
        return find;
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

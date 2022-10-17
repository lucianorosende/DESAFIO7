import Express from "express";
import Contenedor from "../api/products.js";
import fs from "fs";
import knex from "knex";
import { options } from "../options/optionsMARIA.js";

//Router --------------------------------------------------------------------------------

const Container = new Contenedor();
const apiRouter = Express.Router();
const knexstart = knex(options);
export const route = "./productos.txt";

const isAdmin = (req, res, next) => {
    if (req.query.admin === "true") {
        next();
    } else {
        res.send({ error: "You are not allowed to access this" });
    }
};

// get Products
apiRouter.get("/", async (req, res) => {
    let PRODUCTS = await Container.getWithKnex();

    PRODUCTS.length === 0
        ? res.json({ error: "No products found" })
        : res.json({ PRODUCTS: PRODUCTS });
});

// get Products based off id
apiRouter.get("/:id", async (req, res) => {
    const { id } = req.params;
    let product = await Container.getById(id);
    product === null
        ? res.json({ error: "Product not found" })
        : res.json({ PRODUCT: product });
});

// add products and add id
apiRouter.post("/", isAdmin, async (req, res) => {
    let saveProduct = await Container.saveProduct(req.body);

    saveProduct === null
        ? res.send("completar todo el formulario")
        : res.send(`producto con id: ${saveProduct}`);
});

// update product based off id
apiRouter.put("/:id", isAdmin, async (req, res) => {
    const { nombre, descripcion, codigo, foto, precio, stock } = req.body;
    let producto = await Container.update(req.params.id, {
        nombre,
        descripcion,
        codigo,
        foto,
        precio,
        stock,
    });
    producto !== null
        ? res.json(producto)
        : res.json({ error: "producto no encontrado" });
});

// delete product based off id
apiRouter.delete("/:id", isAdmin, async (req, res) => {
    const result = await Container.delete(req.params.id);

    if (result === null) {
        res.send(`no hay producto con id: ${req.params.id}`);
    } else {
        res.send(result);
    }
});
apiRouter.delete("/", isAdmin, async (req, res) => {
    const result = await Container.deleteAll();
    res.send("TODOS LOS PRODUCTOS BORRADOS");
});

export default apiRouter;


import BaseRouter from "../base.router.js";
import CartController from "../../controllers/cart.controller.js";
import { ADMIN, STANDARD, PREMIUM } from "../../constants/roles.constant.js";

export default class CartRouter extends BaseRouter {
    #cartController;

    constructor() {
        super();
        this.#cartController = new CartController();
    }

    initialize() {
        const router = this.getRouter();

        // Define las rutas y asocia las funciones correspondientes
        this.addGetRoute("/", [STANDARD], (req, res) => this.#cartController.getAll(req, res));
        this.addGetRoute("/:id", [STANDARD], (req, res) => this.#cartController.getById(req, res));
        this.addPostRoute("/", [ PREMIUM, ADMIN ], (req, res) => this.#cartController.create(req, res));
        this.addPutRoute("/:id", [PREMIUM], (req, res) => this.#cartController.update(req, res));
        this.addDeleteRoute("/:id", [ADMIN], (req, res) => this.#cartController.delete(req, res));
        this.addPutRoute("/:cid/products/:pid", [STANDARD], (req, res) => this.#cartController.addOneProduct(req, res));
        this.addDeleteRoute("/:cid/products/:pid", [STANDARD], (req, res) => this.#cartController.removeOneProduct(req, res));
        this.addDeleteRoute("/:cid/products", [STANDARD], (req, res) => this.#cartController.removeAllProducts(req, res));

        // Middleware para manejar errores
        // eslint-disable-next-line no-unused-vars
        router.use((err, req, res, next) => {
            res.sendError(err);
        });
    }
}
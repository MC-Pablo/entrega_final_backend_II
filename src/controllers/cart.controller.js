import CartService from "../services/cart.service.js";
import TicketRepository from "../repositories/ticket.repository.js";
import ProductRepository from "../repositories/product.repository.js";

export default class CartController {
  #cartService;
  #ticketRepository;
  #productRepository;

  constructor() {
    this.#cartService = new CartService();
    this.#ticketRepository = new TicketRepository();
    this.#productRepository = new ProductRepository();
  }

  // Obtener todas las recetas
  async getAll(req, res) {
    try {
      const carts = await this.#cartService.findAll(req.query);
      res.sendSuccess200(carts);
    } catch (error) {
      res.sendError(error);
    }
  }

  // Obtener una receta por su ID
  async getById(req, res) {
    try {
      const cart = await this.#cartService.findOneById(req.params.id);
      res.sendSuccess200(cart);
    } catch (error) {
      res.sendError(error);
    }
  }

  // Crear una nueva receta
  async create(req, res) {
    try {
      const cart = await this.#cartService.insertOne(req.body);
      res.sendSuccess201(cart);
    } catch (error) {
      res.sendError(error);
    }
  }

  // Actualizar una receta existente
  async update(req, res) {
    try {
      const cart = await this.#cartService.updateOneById(
        req.params.id,
        req.body
      );
      res.sendSuccess200(cart);
    } catch (error) {
      res.sendError(error);
    }
  }

  // Eliminar una receta por su ID
  async delete(req, res) {
    try {
      const cart = await this.#cartService.deleteOneById(req.params.id);
      res.sendSuccess200(cart);
    } catch (error) {
      res.sendError(error);
    }
  }

  // Agrega un ingrediente a una receta específica
  async addOneIngredient(req, res) {
    try {
      const { cid, pid } = req.params;
      const { quantity } = req.body;
      const cartUpdated = await this.#cartService.addOneIngredient(
        cid,
        pid,
        quantity ?? 1
      );
      res.sendSuccess200(cartUpdated);
    } catch (error) {
      res.sendError(error);
    }
  }

  // Elimina un ingrediente específico de una receta
  async removeOneIngredient(req, res) {
    try {
      const { cid, pid } = req.params;
      const cartDeleted = await this.#cartService.removeOneIngredient(
        cid,
        pid,
        1
      );
      res.sendSuccess200(cartDeleted);
    } catch (error) {
      res.sendError(error);
    }
  }

  // Elimina todos los ingredientes de una receta específica
  async removeAllIngredients(req, res) {
    try {
      const cartDeleted = await this.#cartService.removeAllIngredients(
        req.params.cid
      );
      res.sendSuccess200(cartDeleted);
    } catch (error) {
      res.sendError(error);
    }
  }

  async purcharse(req, res) {
    try {
      const { cid } = req.params;
      const result = await this.#cartService.purcharse(cid, req.body);
      if (!result.succes) {
        res.status(200).json(result.conflictProducts);
      }
      res.status(200).json(result);
    } catch (error) {
      res.sendError(error);
    }
  }
}

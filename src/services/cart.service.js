import CartRepository from "../repositories/cart.repository.js";
import { ERROR_NOT_FOUND_INDEX } from "../constants/messages.constant.js";

export default class CartService {
    #cartRepository;

    constructor() {
        this.#cartRepository = new CartRepository();
    }

    // Obtener todas las recetas aplicando filtros
    async findAll(paramFilters) {
        const $and = [];

        if (paramFilters?.name) $and.push({ name: { $regex: paramFilters.name, $options: "i" } });
        const filters = $and.length > 0 ? { $and } : {};

        return await this.#cartRepository.findAll(filters);
    }

    // Obtener una receta por su ID
    async findOneById(id) {
        return await this.#cartRepository.findOneById(id);
    }

    // Crear una nueva receta
    async insertOne(data) {
        return await this.#cartRepository.save(data);
    }

    // Actualizar una receta existente
    async updateOneById(id, data) {
        const cart = await this.#cartRepository.findOneById(id);
        const newValues = { ...cart, ...data };
        return await this.#cartRepository.save(newValues);
    }

    // Eliminar una receta por su ID
    async deleteOneById(id) {
        return await this.#cartRepository.deleteOneById(id);
    }

    // Agregar una producto a un receta o incrementar la cantidad de un producto existente
    async addOneProduct(id, productId, quantity = 0) {
        const cart = await this.#cartRepository.findOneById(id);

        const productIndex = cart.products.findIndex((item) => item.product.toString() === productId);

        if (productIndex >= 0) {
            cart.products[productIndex].quantity += quantity;
        } else {
            cart.products.push({ product: productId, quantity });
        }

        return await this.#cartRepository.save(cart);
    }

    // Elimina un producto de una receta o decrementa la cantidad de un producto existente
    async removeOneProduct(id, productId, quantity = 0) {
        const cart = await this.#cartRepository.findOneById(id);

        const productIndex = cart.products.findIndex((item) => item.product.toString() === productId);
        if (productIndex < 0) {
            throw new Error(ERROR_NOT_FOUND_INDEX);
        }

        if (cart.products[productIndex].quantity > quantity) {
            cart.products[productIndex].quantity -= quantity;
        } else {
            cart.products.splice(productIndex, 1);
        }

        return await this.#cartRepository.save(cart);
    }

    // Elimina todos los productos de una receta por su ID
    async removeAllProducts(id) {
        const cart = await this.#cartRepository.findOneById(id);
        cart.products = [];

        return await this.#cartRepository.save(cart);
    }
}
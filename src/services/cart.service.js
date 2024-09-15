import CartRepository from "../repositories/cart.repository.js";
import TicketRepository from "../repositories/ticket.repository.js";
import ProductRepository from "../repositories/product.repository.js";
import { ERROR_NOT_FOUND_INDEX } from "../constants/messages.constant.js";

export default class CartService {
    #cartRepository;
    #ticketRepository;
    #productRepository;

    constructor() {
        this.#cartRepository = new CartRepository();
        this.#ticketRepository = new TicketRepository();
        this.#productRepository = new ProductRepository();
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

    async purcharse(cid, data) {
        const cart = await this.#cartRepository.findOneById(cid);

        const conflictProducts = [];

        for(const item of cart.products) {
            const product = await this.#productRepository.findOneById(item.product);
            if(product.stock < item.quantity) {
                conflictProducts.push({product: item.product, currentQuantity: item.quantity, availableStock: product.stock})
            }
        }
        if(conflictProducts.length > 0) {
            return {succes:false, conflictProducts}
        }

        for(const item of cart.products) {
            const product = await this.#productRepository.findOneById(item.product);
            product.stock -= item.quantity;
            await this.#productRepository.save(product) 
        }
        const ticket = await this.#ticketRepository.save(cart.products, data.email)
        await this.#cartRepository.deleteOneById(cid)
        return {succes: true, ticket: ticket.id, code: ticket.code}
    }
};
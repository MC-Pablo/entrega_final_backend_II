import FactoryDAO from "../daos/factory.dao.js";
import ProductDTO from "../dtos/product.dto.js";
import { MONGODB } from "../constants/dao.constant.js";
import { ERROR_NOT_FOUND_ID } from "../constants/messages.constant.js";

export default class ProductRepository {
    #productDAO;
    #productDTO;

    constructor() {
        const factory = new FactoryDAO();
        this.#productDAO = factory.createProduct(MONGODB);
        this.#productDTO = new ProductDTO();
    }

    // Obtener todos los productos aplicando filtros
    async findAll(params) {
        const $and = [];

        if (params?.title) $and.push({ title: { $regex: params.title, $options: "i" } });
        const filters = $and.length > 0 ? { $and } : {};

        const products = await this.#productDAO.findAll(filters, params);
        const productsDTO = products?.docs?.map((product) => this.#productDTO.fromModel(product));
        products.docs = productsDTO;

        return products;
    }

    // Obtener un producto por su ID
    async findOneById(id) {
        const product = await this.#productDAO.findOneById(id);
        if (!product) throw new Error(ERROR_NOT_FOUND_ID);

        return this.#productDTO.fromModel(product);
    }

    // Crear o actualizar un producto
    async save(data) {
        const productDTO = this.#productDTO.fromData(data);
        const product = await this.#productDAO.save(productDTO);
        return this.#productDTO.fromModel(product);
    }

    // Eliminar un producto por su ID
    async deleteOneById(id) {
        const product = await this.findOneById(id);
        await this.#productDAO.deleteOneById(id);
        return product;
    }
}
import ProductRepository from "../repositories/product.repository.js";
import { deleteFile } from "../utils/fileSystem.js";
import paths from "../utils/paths.js";

export default class ProductService {
    #productRepository;

    constructor() {
        this.#productRepository = new ProductRepository();
    }

    // Obtener todos los productos aplicando filtros
    async findAll(params) {
        return await this.#productRepository.findAll(params);
    }

    // Obtener un producto por su ID
    async findOneById(id) {
        return await this.#productRepository.findOneById(id);
    }

    // Crear un nuevo producto
    async insertOne(data, filename) {
        return await this.#productRepository.save({
            ...data,
            thumbnail: filename ?? null,
        });
    }

    // Actualizar un producto existente
    async updateOneById(id, data, filename) {
        const currentProduct = await this.#productRepository.findOneById(id);
        const currentThumbnail = currentProduct.thumbnail;
        const newThumbnail = filename;

        const product = await this.#productRepository.save({
            ...currentProduct,
            ...data,
            thumbnail: newThumbnail ?? currentThumbnail,
        });

        if (filename && newThumbnail !== currentThumbnail) {
            await deleteFile(paths.images, currentThumbnail);
        }

        return product;
    }

    // Eliminar un producto por su ID
    async deleteOneById(id) {
        const product = await this.#productRepository.findOneById(id);
        await deleteFile(paths.images, product.thumbnail)
        return await this.#productRepository.deleteOneById(id);
    }
}
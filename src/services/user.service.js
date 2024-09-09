import UserRepository from "../repositories/user.repository.js";

export default class UserService {
    #userRepository;

    constructor() {
        this.#userRepository = new UserRepository();
    }

    // Obtener todos los usuarios aplicando filtros
    async findAll(paramFilters) {
        const $and = [];

        if (paramFilters?.name) $and.push({ name: { $regex: paramFilters.name, $options: "i" } });
        const filters = $and.length > 0 ? { $and } : {};

        return await this.#userRepository.findAll(filters);
    }

    // Obtener un usuario por su ID
    async findOneById(id) {
        return await this.#userRepository.findOneById(id);
    }

    // Obtener un usuario por su email y contraseña
    async findOneByEmailAndPassword(email, password) {
        return await this.#userRepository.findOneByEmailAndPassword(email, password);
    }

    // Crear un nuevo usuario
    async insertOne(data) {
        return await this.#userRepository.save(data);
    }

    // Actualizar un usuario existente
    async updateOneById(id, data) {
        const user = await this.#userRepository.findOneById(id);
        const newValues = { ...user, ...data };
        return await this.#userRepository.save(newValues);
    }

    // Eliminar un usuario por su ID
    async deleteOneById(id) {
        return await this.#userRepository.deleteOneById(id);
    }
}
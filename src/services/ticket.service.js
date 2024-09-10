import TicketRepository from "../repositories/ticket.repository.js";

export default class TicketService {
    #ticketRepository;

    constructor() {
        this.#ticketRepository = new TicketRepository();
    }

    // Obtener todos los tickets aplicando filtros
    async findAll(params) {
        return await this.#ticketRepository.findAll(params);
    }

    // Obtener un ticket por su ID
    async findOneById(id) {
        return await this.#ticketRepository.findOneById(id);
    }

    // #region Crear un nuevo ticket
    async insertOne(data) {
        return await this.#ticketRepository.save(data);
    }
    //#endregion

    // Eliminar un ticket por su ID
    async deleteOneById(id) {
        return await this.#ticketRepository.deleteOneById(id);
    }
}
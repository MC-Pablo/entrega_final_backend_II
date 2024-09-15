import FactoryDAO from "../daos/factory.dao.js";
import TicketDTO from "../dtos/ticket.dto.js";
import { MONGODB } from "../constants/dao.constant.js";
import { ERROR_NOT_FOUND_ID } from "../constants/messages.constant.js";

export default class TicketRepository {
    #ticketDAO;
    #ticketDTO;

    constructor() {
        const factory = new FactoryDAO();
        this.#ticketDAO = factory.createTicket(MONGODB);
        this.#ticketDTO = new TicketDTO();
    }

    // Obtener todos los tickets aplicando filtros
    async findAll(params) {
        const $and = [];

        if (params?.title) $and.push({ title: { $regex: params.title, $options: "i" } });
        const filters = $and.length > 0 ? { $and } : {};

        const tickets = await this.#ticketDAO.findAll(filters, params);
        const ticketsDTO = tickets?.docs?.map((ticket) => this.#ticketDTO.fromModel(ticket));
        tickets.docs = ticketsDTO;

        return tickets;
    }

    // Obtener un ticket por su ID
    async findOneById(id) {
        const ticket = await this.#ticketDAO.findOneById(id);
        if (!ticket) throw new Error(ERROR_NOT_FOUND_ID);

        return this.#ticketDTO.fromModel(ticket);
    }

    // Crear o actualizar un ticket
    async save(data, email) {

        const info = {products: data, email}

        const ticketDTO = this.#ticketDTO.fromData(info);
        const ticket = await this.#ticketDAO.save(ticketDTO);
        return this.#ticketDTO.fromModel(ticket);
    }

    // Eliminar un ticket por su ID
    async deleteOneById(id) {
        const ticket = await this.findOneById(id);
        await this.#ticketDAO.deleteOneById(id);
        return ticket;
    }
};
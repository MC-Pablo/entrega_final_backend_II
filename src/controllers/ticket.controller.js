import TicketService from "../services/ticket.service.js";

export default class TicketController {
    #ticketService;

    constructor() {
        this.#ticketService = new TicketService();
    }

    // Obtener todos los tickets
    async getAll(req, res) {
        try {
            const tickets = await this.#ticketService.findAll(req.query);
            res.sendSuccess200(tickets);
        } catch (error) {
            res.sendError(error);
        }
    }

    // Obtener un ticket por su ID
    async getById(req, res) {
        try {
            const ticket = await this.#ticketService.findOneById(req.params.id);
            res.sendSuccess200(ticket);
        } catch (error) {
            res.sendError(error);
        }
    }

    // Crear un nuevo ticket
    async create(req, res) {
        try {
            const ticket = await this.#ticketService.insertOne(req.body, req.file?.filename);
            res.sendSuccess201(ticket);
        } catch (error) {
            res.sendError(error);
        }
    }

    // Eliminar un ticket por su ID
    async delete(req, res) {
        try {
            const ticket = await this.#ticketService.deleteOneById(req.params.id);
            res.sendSuccess200(ticket);
        } catch (error) {
            res.sendError(error);
        }
    }
}
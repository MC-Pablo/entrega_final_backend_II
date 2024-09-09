import MessageService from "../services/message.service.js";

export default class MessageController {
    #messageService;

    constructor() {
        this.#messageService = new MessageService();
    }

    async send(req, res) {
        try {
            const { number, content } = req.body;

            await this.#messageService.send(number, content);
            res.sendSuccess201("SMS Enviado");
        } catch (error) {
            res.sendError(error);
        }
    }
}
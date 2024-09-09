import EmailService from "../services/email.service.js";
import { deleteFile } from "../utils/fileSystem.js";
import paths from "../utils/paths.js";

export default class EmailController {
    #emailService;

    constructor() {
        this.#emailService = new EmailService();
    }

    async send(req, res) {
        try {
            const { to, subject, content } = req.body;

            await this.#emailService.send(to, subject, content, req.file?.filename);
            res.sendSuccess201("Email Enviado");
        } catch (error) {
            if (req.file?.filename) await deleteFile(paths.images, req.file.filename);
            res.sendError(error);
        }
    }
}
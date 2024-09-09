import nodemailer from "nodemailer";
import path from "path";
import { deleteFile } from "../utils/fileSystem.js";
import paths from "../utils/paths.js";

export default class EmailService {
    #nodemailer;

    constructor() {
        this.#nodemailer = nodemailer;
    }

    // Método privado para crear y configurar el transporte de correo
    #createTransport() {
        return this.#nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: process.env.SMTP_PORT === "465",
            auth: {
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_PASSWORD,
            },
        });
    }

    // Método público para enviar un correo electrónico
    async send(to, subject, content, filename) {
        const transport = this.#createTransport();
        const attachments = [];

        // Verifica si se ha proporcionado el nombre de un archivo adjunto
        if (filename) {
            attachments.push({
                filename,
                path: path.join(paths.images, filename),
            });
        }

        // Envía el correo electrónico con los parámetros proporcionados
        await transport.sendMail({
            from: process.env.SMTP_EMAIL,
            to,
            subject,
            html: content,
            attachments,
        });

        // Elimina el archivo adjuntado si se ha proporcionado su nombre
        if (filename) {
            await deleteFile(paths.images, filename);
        }
    }
}
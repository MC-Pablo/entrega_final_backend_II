import twilio from "twilio";

export default class MessageService {
    #client;

    constructor() {
        this.#client = twilio( process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN );
    }

    // Método público para enviar un mensaje SMS
    async send(number, content) {
        await this.#client.messages.create({
            body: content,
            to: number,
            from: process.env.TWILIO_PHONE_NUMBER,
        });
    }
}
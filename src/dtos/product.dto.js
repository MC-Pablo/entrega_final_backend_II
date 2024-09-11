import { convertToBoolean } from "../utils/converter.js";

export default class ProductDTO {
    fromModel(model) {
        return {
            id: model.id,
            title: model.title,
            description: model.description,
            stock: model.stock,
            price: model.price,
            status: model.status,
            thumbnail: model.thumbnail,
        };
    }

    fromData(data) {
        return {
            id: data.id || null,
            title: data.title,
            description: data.description,
            stock: Number(data.stock),
            price: data.price,
            status: convertToBoolean(data.status),
            thumbnail: data.thumbnail,
        };
    }
}
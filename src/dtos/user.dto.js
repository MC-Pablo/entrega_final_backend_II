import { createHash } from "../utils/security.js";

export default class UserDTO {
    fromModel(model) {
        return {
            id: model.id,
            fullName: `${model.name} ${model.surname}`,
            email: model.email,
            roles: model.roles,
        };
    }

    fromData(data) {
        const name = data.fullName?.split(" ");

        return {
            id: data.id || null,
            name: name[0] ?? "",
            surname: name[1] ?? "",
            email: data.email,
            password: data.password ? createHash(data.password) : null,
            roles: data.roles,
        };
    }
}
import { Router } from "express";
import mongoose from "mongoose";
import { ERROR_INVALID_ID, ERROR_NOT_HAVE_PRIVILEGES, STATUS_CODES } from "../constants/messages.constant.js";
import { checkAuth } from "../middlewares/auth.middleware.js";

export default class BaseRouter {
    #router;
    #statusCodes;

    constructor() {
        this.#router = Router();
        this.#statusCodes = STATUS_CODES;
        this.#defineCustomResponses();
        this.#addIdValidation();
        this.initialize();
    }

    // Método protegido: Inicializa la configuración del Router
    initialize() {
        throw new Error("Este método debe ser sobrescrito en una clase hija");
    }

    // Método privado: Define respuestas personalizadas para las rutas
    #defineCustomResponses() {
        this.#router.use((req, res, next) => {
            res.sendSuccess200 = (payload) => res.status(200).json({ status: true, payload });
            res.sendSuccess201 = (payload) => res.status(201).json({ status: true, payload });
            res.sendError = (error) => this.#defineErrorResponse(error, res);
            next();
        });
    }

    // Método privado: Configura la respuesta de error basada en el mensaje de error
    #defineErrorResponse(error, res) {
        let errorMessage = error.message;

        if (error instanceof mongoose.Error.ValidationError) {
            errorMessage = Object.values(error.errors)[0].message;
        }

        const statusCode = this.#statusCodes[errorMessage] || 500;
        res.status(statusCode).json({ status: false, message: errorMessage });
    }

    // Método privado: Agrega una validación en el parámetro de ruta "id", "iid" o "rid"
    #addIdValidation() {
        const pattern = /^[0-9a-fA-F]{24}$/;

        this.#router.param("id", this.#validatePathParam(pattern, ERROR_INVALID_ID));
        this.#router.param("cid", this.#validatePathParam(pattern, ERROR_INVALID_ID));
        this.#router.param("pid", this.#validatePathParam(pattern, ERROR_INVALID_ID));
    }

    // Método privado: Valida un parámetro de ruta según el patrón dado
    #validatePathParam(pattern, errorMessage) {
        return (req, res, next, paramValue) => {
            if (!pattern.test(paramValue)) {
                return next(new Error(errorMessage));
            }
            next();
        };
    }

    // Método privado: Verifica si el rol del usuario cumple con las políticas requeridas
    #checkPolicy(policies = []) {
        // Si no hay políticas especificadas, permite el acceso sin restricciones
        if (policies.length === 0) return [];

        // Retorna un array de middlewares que se aplicarán a la ruta
        return [ checkAuth, (req, res, next) => {
            // Verifica si alguno de los roles requeridos está presente en los roles del usuario
            const hasRequiredRole = policies.some((policy) => req.roles?.includes(policy));

            // Si el usuario no tiene los roles requeridos, devuelve un error de falta de privilegios
            if (!hasRequiredRole) {
                return next(new Error(ERROR_NOT_HAVE_PRIVILEGES));
            }

            // Continúa con el siguiente middleware si el usuario tiene el rol requerido
            next();
        } ];
    }

    // Método privado: Agrega una ruta con políticas y callbacks especificados
    #addRoute(method, path, policies = [], ...callbacks) {
        // Registra la ruta en el enrutador con el método HTTP recibido
        this.#router[method](path, this.#checkPolicy(policies), ...callbacks);
    }

    // Método público: Define una ruta GET
    addGetRoute(path, policies = [], ...callbacks) {
        this.#addRoute("get", path, policies, ...callbacks);
    }

    // Método público: Define una ruta POST
    addPostRoute(path, policies = [], ...callbacks) {
        this.#addRoute("post", path, policies, ...callbacks);
    }

    // Método público: Define una ruta PUT
    addPutRoute(path, policies = [], ...callbacks) {
        this.#addRoute("put", path, policies, ...callbacks);
    }

    // Método público: Define una ruta DELETE
    addDeleteRoute(path, policies = [], ...callbacks) {
        this.#addRoute("delete", path, policies, ...callbacks);
    }

    // Método público: Retorna el router configurado
    getRouter() {
        return this.#router;
    }
}
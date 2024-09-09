export const ERROR_SERVER = "Hubo un error en el Servidor" ;
export const ERROR_NOT_FOUND_URL = "URL no encontrada" ;

export const ERROR_INVALID_ID = "ID inválido" ;
export const ERROR_NOT_FOUND_ID = "ID no encontrado" ;
export const ERROR_NOT_FOUND_INDEX = "Índice no encontrado" ;

export const ERROR_NOT_FOUND_CREDENTIALS = "Email o contraseña incorrecta";
export const ERROR_INVALID_TOKEN = "Token inválido" ;
export const ERROR_EXPIRED_TOKEN = "Token expirado" ;
export const ERROR_NOT_FOUND_TOKEN = "Token no encontrado" ;
export const ERROR_NOT_HAVE_PRIVILEGES = "No tenes los privilegios suficientes" ;

export const ERROR_GET_DOCUMENT = "Error al obtener documento" ;
export const ERROR_GET_ALL_DOCUMENT = "Error al obtener documentos" ;
export const ERROR_INSERT_DOCUMENT = "Error al insertar documento" ;
export const ERROR_UPDATE_DOCUMENT = "Error al actualizar documento" ;
export const ERROR_DELETE_DOCUMENT = "Error al eliminar documento" ;

export const JWT_TRANSLATIONS = {
    ["No auth token"]: ERROR_NOT_FOUND_TOKEN,
    ["jwt malformed"]: ERROR_INVALID_TOKEN,
    ["invalid algorithm"]: ERROR_INVALID_TOKEN,
    ["invalid token"]: ERROR_INVALID_TOKEN,
    ["invalid signature"]: ERROR_INVALID_TOKEN,
    ["jwt expired"]: ERROR_EXPIRED_TOKEN,
};

export const STATUS_CODES = {
    [ERROR_INVALID_ID]: 400,
    [ERROR_NOT_FOUND_CREDENTIALS]: 401,
    [ERROR_NOT_FOUND_TOKEN]: 401,
    [ERROR_INVALID_TOKEN]: 401,
    [ERROR_EXPIRED_TOKEN]: 401,
    [ERROR_NOT_HAVE_PRIVILEGES]: 403,
    [ERROR_NOT_FOUND_ID]: 404,
    [ERROR_NOT_FOUND_INDEX]: 404,
};
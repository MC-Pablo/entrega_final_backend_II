import bcrypt from "bcrypt";

// Crea un hash de una contraseña proporcionada
export const createHash = (password) => {
    // Convierte el tipo de dato de la contraseña en String (requerido para hash)
    password = String(password);

    // Genera un salt (por defecto es 10 rounds)
    const salt = bcrypt.genSaltSync();

    // Crea un hash de la contraseña usando la salt
    return bcrypt.hashSync(password, salt);
};

// Verifica si una contraseña proporcionada es válida para un usuario
export const isValidPassword = (password, hash) => {
    // Convierte el tipo de dato de la contraseña en String (requerido para hash)
    password = String(password);

    // Compara la contraseña hasheada del usuario con la contraseña proporcionada
    return bcrypt.compareSync(password, hash);
};
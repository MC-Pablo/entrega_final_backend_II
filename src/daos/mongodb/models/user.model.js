import { Schema, model } from "mongoose";
import paginate from "mongoose-paginate-v2";
import { STANDARD, ROLES } from "../../../constants/roles.constant.js";

const userSchema = new Schema({
    name: {
        type: String,
        required: [ true, "El nombre es obligatorio" ],
        uppercase: true,
        trim: true,
        minLength: [ 3, "El nombre debe tener al menos 3 caracteres" ],
        maxLength: [ 20, "El nombre debe tener como máximo 20 caracteres" ],
    },
    surname: {
        type: String,
        required: [ true, "El apellido es obligatorio" ],
        uppercase: true,
        trim: true,
        minLength: [ 3, "El apellido debe tener al menos 3 caracteres" ],
        maxLength: [ 20, "El nombre debe tener como máximo 20 caracteres" ],
    },
    email: {
        type: String,
        required: [ true, "El email es obligatorio" ],
        lowercase: true,
        trim: true,
        unique: true,
        validate: {
            validator: async function (email) {
                const countDocuments = await this.model("users").countDocuments({
                    _id: { $ne: this._id },
                    email, // Atributo de verificación de duplicado
                });
                return countDocuments === 0;
            },
            message: "El email ya está registrado",
        },
    },
    password: {
        type: String,
        required: [ true, "La contraseña es obligatoria" ],
    },
    roles: {
        type: [String],
        uppercase: true,
        enum: {
            values: ROLES,
            message: "Rol no válido",
        },
        default: [STANDARD], // El valor por defecto es "STANDARD"
    },
    carts: [{
        type: Schema.Types.ObjectId,
        ref: "carts", // Asegúrate de que el nombre del modelo coincida
    }],
}, {
    timestamps: true, // Añade timestamps para generar createdAt y updatedAt
    versionKey: false, // Elimina el campo __v de versión
});

// Agrega mongoose-paginate-v2 para habilitar las funcionalidades de paginación.
userSchema.plugin(paginate);

userSchema.pre('deleteOne', async function(next) {
    try {
        const Cart = model("carts");

        // Obtener el ID del usuario que se está eliminando
        const userId = this.getFilter()['_id'];

        // Eliminar los carritos asociados al usuario
        await Cart.deleteMany({ _id: { $in: userId.carts } });

        next();
    } catch (error) {
        next(error);
    }
});

const User = model("users", userSchema);

export default User;
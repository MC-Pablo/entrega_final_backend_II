import { Schema, model } from "mongoose";
import paginate from "mongoose-paginate-v2";

const cartSchema = new Schema({
    products: [
        {
            product: {
                type: Schema.Types.ObjectId,
                ref: "products",
                required: [ true, "El producto es obligatorio" ],
            },
            quantity: {
                type: Number,
                required: [ true, "La cantidad es obligatoria" ],
                min: [ 1, "La cantidad debe ser mayor que 0" ],
            },
            _id: false,
        },
    ],
    user: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: [true, "No se pudo vincular a un usuario"]
    }
}, {
    timestamps: true, // Añade timestamps para generar createdAt y updatedAt
    versionKey: false, // Elimina el campo __v de versión
});

// Agrega mongoose-paginate-v2 para habilitar las funcionalidades de paginación.
cartSchema.plugin(paginate);

const Cart = model("carts", cartSchema);

export default Cart;
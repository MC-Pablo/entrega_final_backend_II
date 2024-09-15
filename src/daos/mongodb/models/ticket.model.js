import { Schema, model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import paginate from "mongoose-paginate-v2";

const ticketSchema = new Schema({
  code: {
    type: String,
    unique: true,
    required: [true, "El código es obligatorio"],
    default: function () {
      return uuidv4();
    }
  },
  purchase_datetime: {
    type: Date,
    default: Date.now,
    required: [true, "La fecha de compra es obligatoria"]
  },
  products: [
    {
      product_id: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: [true, "El ID del producto es obligatorio"]
      },
      amount: {
        type: Number,
        required: [true, "La cantidad del producto es obligatoria"],
        min: [1, "La cantidad debe ser al menos 1"]
      }
    }
  ],
  purchaser: {
    type: String,
    required: [true, "El correo del comprador es obligatorio"],
    lowercase: true,
    trim: true,
    validate: {
      validator: function (email) {

        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      },
      message: "El correo electrónico proporcionado no es válido"
    }
  }
}, {
  timestamps: true, // Añade timestamps para createdAt y updatedAt
  versionKey: false // Elimina el campo __v de versión
});

ticketSchema.plugin(paginate);

const Ticket = model('tickets', ticketSchema);

export default Ticket;
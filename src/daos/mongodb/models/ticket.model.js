import { Schema, model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

// Definición del esquema para el modelo Ticket
const ticketSchema = new Schema({
  code: {
    type: String,
    unique: true,
    required: [true, "El código es obligatorio"],
    default: function () {
      return uuidv4(); // Genera un UUID v4 para el código
    }
  },
  purchase_datetime: {
    type: Date,
    default: Date.now,
    required: [true, "La fecha de compra es obligatoria"]
  },
  amount: {
    type: Number,
    required: [true, "El monto es obligatorio"],
    min: [0, "El monto debe ser mayor o igual a 0"]
  },
  purchaser: {
    type: String,
    required: [true, "El correo del comprador es obligatorio"],
    lowercase: true,
    trim: true,
    validate: {
      validator: function (email) {
        // Validación básica para un correo electrónico
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      },
      message: "El correo electrónico proporcionado no es válido"
    }
  }
}, {
  timestamps: true, // Añade timestamps para createdAt y updatedAt
  versionKey: false // Elimina el campo __v de versión
});

// Crear el modelo basado en el esquema
const Ticket = model('Ticket', ticketSchema);

export default Ticket;
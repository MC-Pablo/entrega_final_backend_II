import { Server } from "socket.io";
import IngredientService from "../services/ingredient.service.js";
import { writeFile } from "../utils/fileSystem.js";
import paths from "../utils/paths.js";
import { generateNameForFile } from "../utils/random.js";

const ingredientService = new IngredientService();
let serverSocket = null;

// Configura el servidor Socket
export const config = (serverHTTP) => {
    // Crea una nueva instancia de Server con el servidor HTTP proporcionado
    serverSocket = new Server(
        serverHTTP,
        {
            maxHttpBufferSize: 5e6, // Permitir archivos hasta 5MB (por defecto es 1MB)
        },
    );

    // Escucha el evento de conexión de un nuevo socket
    serverSocket.on("connection", async (socket) => {
        const response = await ingredientService.findAll({ limit: 100 });
        console.log("Socket connected");

        // Envía la lista de ingredientes al cliente que se conecta
        serverSocket.emit("ingredients-list", response);

        // Escucha el evento para insertar un nuevo ingrediente
        socket.on("insert-ingredient", async (data) => {
            if (data?.file) {
                const filename = generateNameForFile(data.file.name);
                await writeFile(paths.images, filename, data.file.buffer);

                await ingredientService.insertOne(data, filename);
                const response = await ingredientService.findAll({ limit: 100 });

                // Envía la lista de ingredientes actualizada después de insertar
                serverSocket.emit("ingredients-list", response);
            }
        });

        // Escucha el evento para eliminar un ingrediente
        socket.on("delete-ingredient", async (data) => {
            await ingredientService.deleteOneById(data.id);
            const response = await ingredientService.findAll({ limit: 100 });

            // Envía la lista de ingredientes actualizada después de eliminar
            serverSocket.emit("ingredients-list", response);
        });
    });
};

// Función para actualizar la lista de ingredientes
export const updateIngredientsList = async () => {
    const response = await ingredientService.findAll({ limit: 100 });

    // Envía la lista de ingredientes actualizada
    serverSocket.emit("ingredients-list", { response });
};
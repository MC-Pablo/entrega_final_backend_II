import { Server } from "socket.io";
import ProductService from "../services/product.service.js";
import { writeFile } from "../utils/fileSystem.js";
import paths from "../utils/paths.js";
import { generateNameForFile } from "../utils/random.js";

const productService = new ProductService();
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
        const response = await productService.findAll({ limit: 100 });
        console.log("Socket connected");

        // Envía la lista de productes al cliente que se conecta
        serverSocket.emit("products-list", response);

        // Escucha el evento para insertar un nuevo producte
        socket.on("insert-product", async (data) => {
            if (data?.file) {
                const filename = generateNameForFile(data.file.name);
                await writeFile(paths.images, filename, data.file.buffer);

                await productService.insertOne(data, filename);
                const response = await productService.findAll({ limit: 100 });

                // Envía la lista de productes actualizada después de insertar
                serverSocket.emit("products-list", response);
            }
        });

        // Escucha el evento para eliminar un producte
        socket.on("delete-product", async (data) => {
            await productService.deleteOneById(data.id);
            const response = await productService.findAll({ limit: 100 });

            // Envía la lista de productes actualizada después de eliminar
            serverSocket.emit("products-list", response);
        });
    });
};

// Función para actualizar la lista de productes
export const updateProductsList = async () => {
    const response = await productService.findAll({ limit: 100 });

    // Envía la lista de productes actualizada
    serverSocket.emit("products-list", { response });
};
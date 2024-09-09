const socket = io();

// Referencias a los elementos del DOM
const ingredientsTableRows = document.getElementById("ingredients-table-rows");
const ingredientsForm = document.getElementById("ingredients-form");
const inputIngredientId = document.getElementById("input-ingredient-id");
const btnDeleteIngredient = document.getElementById("btn-delete-ingredient");

// Manejo del formulario para insertar un ingrediente
ingredientsForm.addEventListener("submit", function(event) {
    event.preventDefault();

    // Obtiene los datos del formulario
    const form = event.target;
    const formData = new FormData(form);

    // Obtiene el archivo adjunto
    const file = formData.get("file");

    // Detiene la ejecución si no proporcionado una imagen
    if (!file) {
        console.error("No se ha proporcionado una imagen");
        return;
    }

    // Emisión del evento para insertar el ingrediente
    socket.emit("insert-ingredient", {
        title: formData.get("title"),
        description: formData.get("description"),
        code: formData.get("code"),
        price: formData.get("price"),
        stock: formData.get("stock"),
        status: formData.get("status"),
        category: formData.get("category"),
        availability: Boolean(formData.get("availability")),
        file: {
            name: file.name,
            type: file.type,
            size: file.size,
            buffer: file,
        },
    });

    // Restaura el formulario después de enviar los datos
    form.reset();
});

// Manejo del clic en el botón para eliminar un ingrediente
btnDeleteIngredient.addEventListener("click", function() {
    const id = inputIngredientId.value.trim();

    // Restaura el valor del input
    inputIngredientId.value = "";

    // Detiene la ejecución si no hay ID
    if (!id) {
        console.error("Ingredient ID is required");
        return;
    }

    // Emisión del evento para eliminar el ingrediente
    socket.emit("delete-ingredient", { id });
});

// Manejo de la lista de ingredientes recibida del servidor
socket.on("ingredients-list", function(data) {
    const ingredientsList = data.docs || [];

    // Limpia la tabla de ingredientes
    ingredientsTableRows.innerHTML = "";

    // Itera sobre cada ingrediente y crea una fila en la tabla
    ingredientsList.forEach(function(ingredient) {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${ingredient.id}</td>
            <td>${ingredient.title}</td>
            <td>${ingredient.price}</td>
        `;
        ingredientsTableRows.appendChild(tr);
    });
});
/* eslint-disable no-unused-vars */

// Función para habilitar o deshabilitar los botones con clase "button-icon"
const changeEnabledAllIconButtons = (state) => {
    const buttons = document.querySelectorAll(".button-icon");
    buttons.forEach((button) => button.disabled = !state);
};

// Función para agregar un ingrediente al receta
const addIngredient = (recipeId, currentIngredientId) => {
    // Deshabilita los botones ícono para evitar comportamientos inesperados por doble-clic
    changeEnabledAllIconButtons(false);

    const options = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 1 }),
    };

    fetch(`/api/recipes/${recipeId}/ingredients/${currentIngredientId}`, options)
        .then((response) => response.json())
        .catch((error) => console.error(error.message))
        .finally(() => {
            // Habilita los botones ícono después de completar la operación
            changeEnabledAllIconButtons(true);
        });
};

// Función para eliminar un ingrediente del receta
const removeIngredient = (recipeId, currentIngredientId) => {
    // Deshabilita los botones ícono para evitar comportamientos inesperados por doble-clic
    changeEnabledAllIconButtons(false);

    fetch(`/api/recipes/${recipeId}/ingredients/${currentIngredientId}`, { method: "DELETE" })
        .then((response) => response.json())
        .catch((error) => console.error(error.message))
        .finally(() => {
            // Habilita los botones ícono después de completar la operación
            changeEnabledAllIconButtons(true);
        });
};

// Función para eliminar todos los ingredientes del receta
const removeAllIngredients = (recipeId) => {
    fetch(`/api/recipes/${recipeId}/ingredients`, { method: "DELETE" })
        .then((response) => response.json())
        .catch((error) => console.error(error.message));
};
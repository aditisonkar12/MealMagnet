// ==========================
// DOM ELEMENTS
// ==========================

const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("meal-search");

const recipeTitle = document.querySelector(".recipe-title");
const recipeDescription = document.querySelector(".recipe-description");
const recipeImage = document.querySelector(".hero-image");

const ingredientsContainer = document.querySelector(".ingredients");
const ingredientsHeading = document.querySelector(".ingredients-heading");

// Category modal elements
const categoryModal = document.getElementById("category-modal");
const modalTitle = document.getElementById("modal-title");
const modalCloseBtn = document.querySelector(".modal-close");
const recipesGrid = document.getElementById("recipes-grid");
const categorySearchInput = document.getElementById("category-search");
const categoryButtons = document.querySelectorAll(".category-btn");

let allCategoryRecipes = [];

// ==========================
// FETCH RECIPES
// ==========================

async function fetchMeals(searchQuery) {

    try {

        const response = await fetch(
            `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(searchQuery)}`
        );

        if (!response.ok) {
            throw new Error("Unable to fetch recipes.");
        }

        const data = await response.json();

        return data.meals;

    } catch (error) {

        console.error(error);
        return null;

    }

}

// ==========================
// FETCH RECIPES BY CATEGORY
// ==========================

async function fetchMealsByCategory(category) {

    try {

        const response = await fetch(
            `https://www.themealdb.com/api/json/v1/1/filter.php?c=${encodeURIComponent(category)}`
        );

        if (!response.ok) {
            throw new Error("Unable to fetch recipes.");
        }

        const data = await response.json();

        return data.meals || [];

    } catch (error) {

        console.error(error);
        return [];

    }

}

// ==========================
// DISPLAY MESSAGE
// ==========================

function displayMessage(message) {

    recipeTitle.textContent = message;

    recipeDescription.textContent = "";

    recipeImage.style.backgroundImage = "";

    ingredientsHeading.style.display = "none";

    ingredientsContainer.innerHTML = "";

}

// ==========================
// DISPLAY INGREDIENTS
// ==========================

function displayIngredients(meal) {

    const ingredients = [];

    for (let index = 1; index <= 20; index++) {

        const ingredient = meal[`strIngredient${index}`];
        const measure = meal[`strMeasure${index}`];

        if (ingredient && ingredient.trim() !== "") {

            ingredients.push(
                `<li class="ing">${ingredient} ${measure}</li>`
            );

        }

    }

    ingredientsHeading.style.display = "block";

    ingredientsContainer.innerHTML = ingredients.join("");

}

// ==========================
// DISPLAY RECIPE
// ==========================

function displayRecipe(meal) {

    recipeTitle.textContent = meal.strMeal;

    recipeDescription.textContent = meal.strInstructions;

    recipeImage.style.backgroundImage = `url(${meal.strMealThumb})`;

    displayIngredients(meal);

}

// ==========================
// DISPLAY CATEGORY RECIPES
// ==========================

function displayCategoryRecipes(recipes, filterQuery = "") {

    if (!recipes || recipes.length === 0) {
        recipesGrid.innerHTML = '<div class="no-recipes-message">No recipes found.</div>';
        return;
    }

    let filteredRecipes = recipes;

    if (filterQuery.trim()) {
        filteredRecipes = recipes.filter(recipe =>
            recipe.strMeal.toLowerCase().includes(filterQuery.toLowerCase())
        );
    }

    if (filteredRecipes.length === 0) {
        recipesGrid.innerHTML = '<div class="no-recipes-message">No recipes match your search.</div>';
        return;
    }

    recipesGrid.innerHTML = filteredRecipes.map(recipe => `
        <div class="recipe-card" data-recipe-id="${recipe.idMeal}">
            <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}" class="recipe-card-image">
            <div class="recipe-card-info">
                <h3 class="recipe-card-title">${recipe.strMeal}</h3>
                <button class="recipe-card-btn" onclick="selectRecipe('${recipe.idMeal}')">View Recipe</button>
            </div>
        </div>
    `).join("");

}

// ==========================
// SELECT RECIPE FROM CATEGORY
// ==========================

async function selectRecipe(recipeId) {

    try {

        const response = await fetch(
            `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipeId}`
        );

        if (!response.ok) {
            throw new Error("Unable to fetch recipe details.");
        }

        const data = await response.json();

        if (data.meals && data.meals.length > 0) {

            displayRecipe(data.meals[0]);
            closeModal();

        }

    } catch (error) {

        console.error(error);
        alert("Error loading recipe. Please try again.");

    }

}

// ==========================
// OPEN/CLOSE MODAL
// ==========================

function openModal(category) {

    modalTitle.textContent = `${category} Recipes`;

    categoryModal.classList.add("active");

}

function closeModal() {

    categoryModal.classList.remove("active");

    recipesGrid.innerHTML = "";

    categorySearchInput.value = "";

}

    recipeImage.style.backgroundImage = `url(${meal.strMealThumb})`;

    displayIngredients(meal);

}

// ==========================
// SEARCH HANDLER
// ==========================

async function searchMeal(event) {

    event.preventDefault();

    const searchQuery = searchInput.value.trim();

    if (!searchQuery) {

        displayMessage("Please enter a recipe name.");

        return;

    }

    recipeTitle.textContent = "Searching...";

    recipeDescription.textContent = "Fetching delicious recipes for you...";

    ingredientsContainer.innerHTML = "";

    const meals = await fetchMeals(searchQuery);

    if (!meals || meals.length === 0) {

        displayMessage("No recipes found. Try another search.");

        return;

    }

    displayRecipe(meals[0]);

}

// ==========================
// EVENT LISTENERS
// ==========================

searchForm.addEventListener("submit", searchMeal);

// ==========================
// INITIAL STATE
// ==========================

ingredientsHeading.style.display = "none";
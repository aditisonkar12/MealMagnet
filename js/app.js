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
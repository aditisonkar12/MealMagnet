const searchmeal = async (e) => {
    e.preventDefault();

    //select elements
    const input = document.querySelector('.input');
    const title = document.querySelector('.title');
    const info = document.querySelector('.info');
    const img = document.querySelector('.img');
    const ingredientsOutput = document.querySelector('.ingredients');

    const showAlert = () => {
        alert('Meal Not Found! :(');
    };

    //get the user value
    const val = input.value.trim();
    console.log("User Input:", val);

    if (val) {
        const meals = await fetchMealdata(val);

        if (!meals) {
            showAlert();
            return;
        }

        const meal = meals[0]; // Take first result if multiple meals are returned
        const { strMeal, strMealThumb, strInstructions } = meal;

        title.textContent = strMeal;
        img.style.backgroundImage = `url(${strMealThumb})`; // Set image background
        info.textContent = strInstructions;

        // Extract and display ingredients
        const ingredients = [];
        for (let i = 1; i <= 20; i++) {
            if (meal[`strIngredient${i}`]) {
                ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
            } else {
                break;
            }
        }

        ingredientsOutput.innerHTML = `<span>${ingredients.map((ing) => `<li class="ing">${ing}</li>`).join("")}</span>`;

    } else {
        alert("Please try searching for another meal! :)")
    }

};

//fetch data
//we will fetch data from any food site on the internet
const fetchMealdata = async (val) => {
    try {
        const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${val}`);
        console.log("Respoonse Status:", res.status);

        if (!res.ok) throw new Error("failed to fetch API");

        const data = await res.json();
        console.log("API Response:", data);

        return data.meals || null;
    } catch (error) {
        console.error("API Error:", error);
        return null;
    }
};


const form = document.querySelector('form');
form.addEventListener('submit', searchmeal);

const magnifier = document.querySelector('.magnifier');
magnifier.addEventListener('click', searchmeal);
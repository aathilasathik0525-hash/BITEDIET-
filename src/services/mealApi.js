const BASE_URL = "https://www.themealdb.com/api/json/v1/1";

export async function searchMeals(searchText) {
  const response = await fetch(
    `${BASE_URL}/search.php?s=${searchText}`
  );

  const data = await response.json();

  return data.meals || [];
}
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API = "https://www.themealdb.com/api/json/v1/1";

const normalize = (m) => ({
  id: m.idMeal,
  name: m.strMeal,
  image: m.strMealThumb,
  category: m.strCategory || "Various",
  area: m.strArea || "Various",
  instructions: m.strInstructions || "",
  tags: m.strTags?.split(",").filter(Boolean) || [],
  ingredients: Array.from({ length: 20 }, (_, i) => {
    const ing = m[`strIngredient${i + 1}`];
    const measure = m[`strMeasure${i + 1}`];
    return ing?.trim() ? `${measure?.trim() || ""} ${ing}`.trim() : null;
  }).filter(Boolean),
});

export const getPrice = (id) => {
  const seed = parseInt(String(id).slice(-3)) || 5;
  return ((seed % 20) + 5 + 0.99).toFixed
    ? ((seed % 20) + 5 + 0.99)
    : 5.99;
};

// Search by name
export const fetchMeals = createAsyncThunk(
  "meals/fetch",
  async (query = "chicken", { rejectWithValue }) => {
    try {
      const res = await fetch(
        `${API}/search.php?s=${encodeURIComponent(query)}`
      );
      if (!res.ok) throw new Error("Failed to fetch meals");
      const data = await res.json();
      return (data.meals || [])
        .map(normalize)
        .map((m) => ({ ...m, price: getPrice(m.id) }));
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Filter by category — API returns only { idMeal, strMeal, strMealThumb }
export const fetchMealsByCategory = createAsyncThunk(
  "meals/fetchByCategory",
  async (category, { rejectWithValue }) => {
    try {
      const res = await fetch(
        `${API}/filter.php?c=${encodeURIComponent(category)}`
      );
      if (!res.ok) throw new Error("Failed to fetch category");
      const data = await res.json();
      const meals = data.meals || [];
      return meals.map((m) => ({
        id: m.idMeal,
        name: m.strMeal,
        image: m.strMealThumb,
        category: category,
        area: "Various",
        instructions: "",
        ingredients: [],
        price: getPrice(m.idMeal),
      }));
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Single meal
export const fetchMealById = createAsyncThunk(
  "meals/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API}/lookup.php?i=${id}`);
      const data = await res.json();
      if (!data.meals?.[0]) throw new Error("Meal not found");
      const meal = normalize(data.meals[0]);
      return { ...meal, price: getPrice(meal.id) };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const mealsSlice = createSlice({
  name: "meals",
  initialState: {
    items: [],
    selected: null,
    status: "idle",
    detailStatus: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMeals.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchMeals.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchMeals.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchMealsByCategory.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchMealsByCategory.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchMealsByCategory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchMealById.pending, (state) => {
        state.detailStatus = "loading";
      })
      .addCase(fetchMealById.fulfilled, (state, action) => {
        state.detailStatus = "succeeded";
        state.selected = action.payload;
      })
      .addCase(fetchMealById.rejected, (state, action) => {
        state.detailStatus = "failed";
        state.error = action.payload;
      });
  },
});

export default mealsSlice.reducer;
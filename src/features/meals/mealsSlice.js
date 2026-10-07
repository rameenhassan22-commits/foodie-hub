import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API = "https://www.themealdb.com/api/json/v1/1";

// Normalize a meal from TheMealDB to a consistent shape
const normalize = (m) => ({
  id: m.idMeal,
  name: m.strMeal,
  image: m.strMealThumb,
  category: m.strCategory,
  area: m.strArea,
  instructions: m.strInstructions,
  tags: m.strTags?.split(",").filter(Boolean) || [],
  ingredients: Array.from({ length: 20 }, (_, i) => {
    const ing = m[`strIngredient${i + 1}`];
    const measure = m[`strMeasure${i + 1}`];
    return ing?.trim() ? `${measure?.trim() || ""} ${ing}`.trim() : null;
  }).filter(Boolean),
});

// Fake price generator (API provides no price)
export const getPrice = (id) => {
  const seed = parseInt(String(id).slice(-3)) || 5;
  return (seed % 20) + 5 + 0.99;
};

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
      // Search list
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
      // Single meal
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
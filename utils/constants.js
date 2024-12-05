import { collection, query, where, onSnapshot } from "firebase/firestore";

export const screens = {
  SplashScreen: "Splash",
  AuthScreen: "Auth",
  Question: "Question",
  Signup: "Signup",
  Signin: "Signin",
  HomeScreen: "HomeScreen",
  Inbox: "InboxScreen",
  ChatScreen: "ChatScreen",
  Diary: "DiaryScreen",
  DiaryLog: "DiaryLog",
  PlanScreen: "PlanScreen",
  UserProfile: "UserProfile",
  TrainerHome: "TrainerHome",
  ExerciseSearch: "ExerciseSearch",
  Payment: "PaymentScreen",
  PaymentConfirm: "PaymentConfirm",
  PlanDetails: "PlanDetails",
  AddWorkouts: "AddWorkouts",
  WorkoutLibrary: "WorkoutLibrary",
  MealsScreen: "MealsScreen",
  Recipie: "Recipie",
  MyMeals: "MyMeals",
  VideoView: "VideoView",
  TrackProgress: "TrackProgess",
  PostScreen: "PostScreen",
  DetailRecipe: "DetailRecipe",
  WorkoutPlanScreen: "WorkoutPlanScreen",
  WorkoutPlanDetailScreen: "WorkoutPlanDetailScreen",
};

export const Trainer_Email = "info@fit-centre.co.uk";

export const images = {
  googleSignIn: require("../assets/images/google.png"),
  profileImage: require("../assets/images/avatar.png"),
  homeIcon: require("../assets/icons/homeIcon.png"),
  diary: require("../assets/icons/diary.png"),
  dumbell: require("../assets/images/dumbell.png"),
  planIcon: require("../assets/icons/plan.png"),
  postIcon: require("../assets/icons/post.png"),
  profileIcon: require("../assets/icons/profile.png"),
  colourFullLogo: require("../assets/images/fittnessCentre.png"),
  headerLogo: require("../assets/images/headerLogo.png"),
  fcTextLogo: require("../assets/images/fcTextLogo1.png"),
  fc: require("../assets/images/fc.png"),
  meal_bw: require("../assets/images/meal_bw.png"),
  fittness: require("../assets/images/fitness.png"),
  lightblue_bggradeint: require("../assets/images/lightblue_bggradeint.jpeg"),
  profile_filled: require("../assets/images/profile_filled.png"),
  diary_filled: require("../assets/images/diary_filled.png"),
  home_unfilled: require("../assets/images/home_unfilled.png"),
  post_filled: require("../assets/images/post_filled.png"),
  fc_header_img: require("../assets/images/fc-header.png"),
};

export const logWorkouts = [
  { label: "Chest", value: "Chest" },
  { label: "Biceps", value: "Biceps" },
  { label: "Back", value: "Back" },
  { label: "Triceps", value: "Triceps" },
  { label: "Legs", value: "Legs" },
];

const MET_VALUES = {
  running: 8,
  weightlifting: {
    Chest: 3.5,
    Biceps: 3,
    Back: 3.5,
    Triceps: 3,
    Legs: 4,
    // Add more workouts and their MET values as needed
  },
  // Add more exercises and their MET values as needed
};

function calculateCaloriesBurnt(exercise, bodyWeight, durationInMinutes) {
  const lowerCaseExercise = exercise.toLowerCase();
  let MET;

  // Check if the exercise is a specific weightlifting exercise
  if (
    MET_VALUES["weightlifting"] &&
    MET_VALUES["weightlifting"][lowerCaseExercise]
  ) {
    MET = MET_VALUES["weightlifting"][lowerCaseExercise];
  } else {
    MET = MET_VALUES[lowerCaseExercise];
  }

  if (!MET) {
    console.error("MET value not found for the provided exercise.");
    return null;
  }

  const durationInHours = durationInMinutes / 60;
  const caloriesBurnt = MET * bodyWeight * durationInHours;
  return caloriesBurnt;
}

export function getChatTimeFormat() {
  const now = new Date();

  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");

  const currentTime = `${hours}:${minutes}`;

  return currentTime;
}

export function getRandomInt() {
  return Math.floor(Math.random() * (1 - 100)) + 1;
}

export const getBlobFroUri = async (uri) => {
  const blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response);
    };
    xhr.onerror = function (e) {
      reject(new TypeError("Network request failed"));
    };
    xhr.responseType = "blob";
    xhr.open("GET", uri, true);
    xhr.send(null);
  });

  return blob;
};
// export const getBlobFroUri = async (uri) => {
//   const response = await fetch(uri);
//   const blob = await response.blob();
//   return blob;
// };

export const DATA = [
  {
    id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
    title: "First Item",
  },
  {
    id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
    title: "Second Item",
  },
  {
    id: "58694a0f-3da1-471f-bd96-145571e29d72",
    title: "Third Item",
  },
  {
    id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
    title: "First Item",
  },
  {
    id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
    title: "Second Item",
  },
  {
    id: "58694a0f-3da1-471f-bd96-145571eer3329d72",
    title: "Third Item",
  },
  {
    id: "bd7acbea-c1b1-46c2-aed5-3ad53abdwewb28ba",
    title: "First Item",
  },
  {
    id: "3ac68afc-c605-48d3-a4f8-fbd91aadewdd97f63",
    title: "Second Item",
  },
  {
    id: "58694a0f-3da1-471f-bd96def-145571e29ddd72",
    title: "Third Item",
  },
];

export const sample_recipes = [
  {
    name: "Spaghetti Carbonara",
    image: "https://via.placeholder.com/150",
    ingredients: [
      { name: "Spaghetti", grams: 200 },
      { name: "Pancetta", grams: 100 },
      { name: "Large eggs", grams: 120 }, // Assuming 2 large eggs ~ 120g
      { name: "Pecorino cheese", grams: 50 },
      { name: "Parmesan", grams: 50 },
      { name: "Garlic cloves", grams: 10 }, // Assuming 2 cloves ~ 10g
      { name: "Salt and black pepper", grams: 5 }, // Small quantity
    ],
    macros: {
      carbs: "30g",
      proteins: "25g",
      fats: "15g",
    },
    description:
      "A classic Italian pasta dish with creamy egg and cheese sauce, pancetta, and a hint of garlic.",
    cookingMethod: [
      "1. Boil spaghetti in salted water until al dente, then drain.",
      "2. Cook pancetta in a pan until crispy.",
      "3. Mix eggs, Pecorino, and Parmesan in a bowl.",
      "4. Add garlic to the pancetta and cook briefly.",
      "5. Combine spaghetti with the pancetta and remove from heat.",
      "6. Quickly mix in the egg and cheese mixture, stirring to coat the pasta.",
      "7. Season with salt and black pepper and serve immediately.",
    ],
  },
  {
    name: "Chicken Caesar Salad",
    image: "https://via.placeholder.com/150",
    ingredients: [
      { name: "Romaine lettuce", grams: 300 },
      { name: "Chicken breasts", grams: 300 },
      { name: "Parmesan cheese", grams: 50 },
      { name: "Bread (for croutons)", grams: 50 },
      { name: "Caesar dressing", grams: 60 },
      { name: "Salt and black pepper", grams: 5 }, // Small quantity
    ],
    macros: {
      carbs: "15g",
      proteins: "30g",
      fats: "20g",
    },
    description:
      "A fresh salad with grilled chicken, crispy croutons, and tangy Caesar dressing.",
    cookingMethod: [
      "1. Grill chicken breasts until fully cooked, then slice.",
      "2. Cut bread into cubes, toss with olive oil, and bake until crispy to make croutons.",
      "3. Wash and chop the romaine lettuce.",
      "4. Toss lettuce with Caesar dressing.",
      "5. Top with sliced chicken, croutons, and grated Parmesan cheese.",
      "6. Season with salt and black pepper to taste.",
    ],
  },
  {
    name: "Beef Tacos",
    image: "https://via.placeholder.com/150",
    ingredients: [
      { name: "Ground beef", grams: 500 },
      { name: "Taco seasoning", grams: 30 },
      { name: "Taco shells", grams: 120 }, // Assuming 8 taco shells ~ 120g
      { name: "Shredded lettuce", grams: 100 },
      { name: "Diced tomatoes", grams: 100 },
      { name: "Shredded cheese", grams: 100 },
      { name: "Sour cream", grams: 60 },
    ],
    macros: {
      carbs: "25g",
      proteins: "20g",
      fats: "18g",
    },
    description:
      "Tasty tacos filled with seasoned beef, fresh vegetables, and topped with cheese and sour cream.",
    cookingMethod: [
      "1. Cook ground beef in a pan over medium heat until browned.",
      "2. Add taco seasoning and a small amount of water, simmer until thickened.",
      "3. Warm taco shells according to package instructions.",
      "4. Fill each taco shell with cooked beef.",
      "5. Top with shredded lettuce, diced tomatoes, shredded cheese, and sour cream.",
    ],
  },
  {
    name: "Vegetable Stir-fry",
    image: "https://via.placeholder.com/150",
    ingredients: [
      { name: "Bell pepper", grams: 150 },
      { name: "Broccoli head", grams: 200 },
      { name: "Carrots", grams: 120 },
      { name: "Onion", grams: 100 },
      { name: "Garlic cloves", grams: 10 }, // Assuming 2 cloves ~ 10g
      { name: "Soy sauce", grams: 30 },
      { name: "Olive oil", grams: 20 },
    ],
    macros: {
      carbs: "20g",
      proteins: "5g",
      fats: "10g",
    },
    description:
      "A quick and healthy stir-fry with a variety of colorful vegetables and a savory soy sauce.",
    cookingMethod: [
      "1. Chop all vegetables into bite-sized pieces.",
      "2. Heat olive oil in a large pan or wok over medium-high heat.",
      "3. Add garlic and onions, stir-fry until fragrant.",
      "4. Add carrots and cook for 2 minutes.",
      "5. Add bell pepper and broccoli, cook until tender but still crisp.",
      "6. Pour in soy sauce and stir to coat vegetables evenly.",
      "7. Serve hot.",
    ],
  },
  {
    name: "Pancakes",
    image: "https://via.placeholder.com/150",
    ingredients: [
      { name: "Flour", grams: 200 },
      { name: "Eggs", grams: 120 }, // Assuming 2 eggs ~ 120g
      { name: "Milk", grams: 300 },
      { name: "Butter", grams: 50 },
      { name: "Sugar", grams: 30 },
      { name: "Baking powder", grams: 10 },
      { name: "Maple syrup", grams: 60 },
    ],
    macros: {
      carbs: "40g",
      proteins: "8g",
      fats: "10g",
    },
    description:
      "Fluffy pancakes served with butter and maple syrup, perfect for a weekend breakfast.",
    cookingMethod: [
      "1. In a bowl, mix flour, sugar, and baking powder.",
      "2. In another bowl, whisk milk and eggs together.",
      "3. Combine wet and dry ingredients, mix until smooth.",
      "4. Melt butter in a pan over medium heat.",
      "5. Pour batter onto the pan to form pancakes, cook until bubbles form on the surface.",
      "6. Flip and cook until golden brown on both sides.",
      "7. Serve with butter and maple syrup.",
    ],
  },
  {
    name: "Grilled Salmon",
    image: "https://via.placeholder.com/150",
    ingredients: [
      { name: "Salmon fillets", grams: 400 }, // Assuming 2 fillets ~ 400g
      { name: "Lemon", grams: 60 }, // Assuming 1 lemon ~ 60g
      { name: "Garlic cloves", grams: 10 }, // Assuming 2 cloves ~ 10g
      { name: "Olive oil", grams: 20 },
      { name: "Salt and black pepper", grams: 5 }, // Small quantity
      { name: "Fresh dill", grams: 10 },
    ],
    macros: {
      carbs: "0g",
      proteins: "25g",
      fats: "12g",
    },
    description:
      "Juicy grilled salmon fillets with a hint of lemon and garlic, garnished with fresh dill.",
    cookingMethod: [
      "1. Preheat grill to medium-high heat.",
      "2. Brush salmon fillets with olive oil, season with salt and pepper.",
      "3. Place salmon on the grill, skin-side down, cook for 6-8 minutes.",
      "4. Flip and cook for another 2-4 minutes until fully cooked.",
      "5. Remove from grill and squeeze lemon juice over the fillets.",
      "6. Garnish with minced garlic and fresh dill before serving.",
    ],
  },
  {
    name: "Tomato Soup",
    image: "https://via.placeholder.com/150",
    ingredients: [
      { name: "Tomatoes", grams: 600 },
      { name: "Onion", grams: 100 },
      { name: "Garlic cloves", grams: 10 }, // Assuming 2 cloves ~ 10g
      { name: "Carrot", grams: 60 },
      { name: "Olive oil", grams: 20 },
      { name: "Vegetable broth", grams: 500 },
      { name: "Salt and black pepper", grams: 5 }, // Small quantity
      { name: "Basil", grams: 10 },
    ],
    macros: {
      carbs: "15g",
      proteins: "4g",
      fats: "5g",
    },
    description:
      "A comforting tomato soup made with fresh tomatoes, onions, garlic, and basil.",
    cookingMethod: [
      "1. Chop tomatoes, onion, and carrot into small pieces.",
      "2. Heat olive oil in a large pot over medium heat.",
      "3. Add onion and garlic, cook until softened.",

      "4. Add carrots and cook for another 5 minutes.",
      "5. Add tomatoes and vegetable broth, bring to a boil.",
      "6. Reduce heat and simmer for 20 minutes.",
      "7. Use a blender to puree the soup until smooth.",
      "8. Season with salt and black pepper.",
      "9. Garnish with fresh basil before serving.",
    ],
  },
  {
    name: "Chicken Curry",
    image: "https://via.placeholder.com/150",
    ingredients: [
      { name: "Chicken breasts", grams: 300 },
      { name: "Onion", grams: 100 },
      { name: "Garlic cloves", grams: 10 }, // Assuming 2 cloves ~ 10g
      { name: "Coconut milk", grams: 400 }, // Assuming 1 can ~ 400g
      { name: "Curry powder", grams: 30 },
      { name: "Bell pepper", grams: 150 },
      { name: "Carrot", grams: 60 },
      { name: "Rice", grams: 200 },
    ],
    macros: {
      carbs: "30g",
      proteins: "20g",
      fats: "15g",
    },
    description:
      "A flavorful chicken curry with coconut milk and a blend of aromatic spices, served with rice.",
    cookingMethod: [
      "1. Cook rice according to package instructions.",
      "2. Chop chicken, onion, bell pepper, and carrot into bite-sized pieces.",
      "3. Heat oil in a large pan over medium heat.",
      "4. Add onion and garlic, cook until softened.",
      "5. Add chicken and cook until browned.",
      "6. Stir in curry powder, cook for 2 minutes.",
      "7. Add bell pepper and carrot, cook for another 5 minutes.",
      "8. Pour in coconut milk, bring to a simmer.",
      "9. Cook for 15 minutes, stirring occasionally, until vegetables are tender.",
      "10. Serve curry over the cooked rice.",
    ],
  },
  {
    name: "Fruit Smoothie",
    image: "https://via.placeholder.com/150",
    ingredients: [
      { name: "Banana", grams: 120 }, // Assuming 1 banana ~ 120g
      { name: "Strawberries", grams: 100 },
      { name: "Blueberries", grams: 100 },
      { name: "Orange juice", grams: 200 },
      { name: "Honey", grams: 20 },
      { name: "Ice cubes", grams: 100 },
    ],
    macros: {
      carbs: "25g",
      proteins: "2g",
      fats: "0g",
    },
    description:
      "A refreshing fruit smoothie made with a mix of banana, strawberries, and blueberries.",
    cookingMethod: [
      "1. Peel and slice the banana.",
      "2. Combine banana, strawberries, blueberries, orange juice, honey, and ice cubes in a blender.",
      "3. Blend until smooth.",
      "4. Pour into glasses and serve immediately.",
    ],
  },
  {
    name: "Margherita Pizza",
    image: "https://via.placeholder.com/150",
    ingredients: [
      { name: "Pizza dough", grams: 400 },
      { name: "Mozzarella cheese", grams: 200 },
      { name: "Tomatoes", grams: 240 }, // Assuming 4 tomatoes ~ 240g
      { name: "Fresh basil", grams: 10 },
      { name: "Olive oil", grams: 20 },
      { name: "Salt", grams: 5 }, // Small quantity
    ],
    macros: {
      carbs: "35g",
      proteins: "15g",
      fats: "12g",
    },
    description:
      "A classic Margherita pizza with fresh tomatoes, mozzarella cheese, and basil leaves.",
    cookingMethod: [
      "1. Preheat oven to 220°C (430°F).",
      "2. Roll out pizza dough on a floured surface.",
      "3. Slice tomatoes and mozzarella cheese.",
      "4. Arrange tomato slices on the dough.",
      "5. Top with mozzarella slices.",
      "6. Drizzle olive oil over the pizza and season with salt.",
      "7. Bake in the oven for 15-20 minutes, until the crust is golden and cheese is bubbly.",
      "8. Garnish with fresh basil leaves before serving.",
    ],
  },
];

export const breakfast_recipes = [
  {
    name: "Avocado Toast",
    image: "https://via.placeholder.com/150",
    ingredients: [
      { name: "Whole grain bread", grams: 60 },
      { name: "Avocado", grams: 100 },
      { name: "Eggs", grams: 100 },
      { name: "Cherry tomatoes", grams: 50 },
      { name: "Salt and pepper", grams: 5 },
    ],
    macros: {
      carbs: "30g",
      proteins: "15g",
      fats: "20g",
    },
    description:
      "Creamy avocado spread on toasted whole grain bread, topped with poached eggs and cherry tomatoes.",
    cookingMethod: [
      "1. Toast the bread slices.",
      "2. Mash the avocado and spread it on the toast.",
      "3. Poach the eggs and place them on top of the avocado.",
      "4. Slice cherry tomatoes and arrange them around the eggs.",
      "5. Season with salt and pepper to taste.",
    ],
  },
  {
    name: "Greek Yogurt Parfait",
    image: "https://via.placeholder.com/150",
    ingredients: [
      { name: "Greek yogurt", grams: 200 },
      { name: "Mixed berries", grams: 100 },
      { name: "Granola", grams: 50 },
      { name: "Honey", grams: 15 },
    ],
    macros: {
      carbs: "40g",
      proteins: "20g",
      fats: "10g",
    },
    description:
      "Layers of creamy Greek yogurt, fresh mixed berries, and crunchy granola, drizzled with honey.",
    cookingMethod: [
      "1. In a glass, layer Greek yogurt, mixed berries, and granola.",
      "2. Repeat layers until the glass is full.",
      "3. Drizzle honey over the top layer.",
      "4. Serve immediately to keep the granola crunchy.",
    ],
  },
];

export const lunch_recipes = [
  {
    name: "Quinoa Salad Bowl",
    image: "https://via.placeholder.com/150",
    ingredients: [
      { name: "Quinoa", grams: 150 },
      { name: "Mixed vegetables", grams: 200 },
      { name: "Feta cheese", grams: 50 },
      { name: "Olive oil", grams: 15 },
      { name: "Lemon juice", grams: 10 },
    ],
    macros: {
      carbs: "45g",
      proteins: "15g",
      fats: "15g",
    },
    description:
      "A nutritious bowl of quinoa mixed with roasted vegetables and crumbled feta cheese, dressed with olive oil and lemon juice.",
    cookingMethod: [
      "1. Cook quinoa according to package instructions.",
      "2. Roast mixed vegetables in the oven.",
      "3. Mix cooked quinoa with roasted vegetables.",
      "4. Crumble feta cheese over the top.",
      "5. Drizzle with olive oil and lemon juice.",
    ],
  },
  {
    name: "Turkey and Avocado Wrap",
    image: "https://via.placeholder.com/150",
    ingredients: [
      { name: "Whole wheat wrap", grams: 60 },
      { name: "Turkey slices", grams: 100 },
      { name: "Avocado", grams: 50 },
      { name: "Lettuce", grams: 30 },
      { name: "Tomato", grams: 50 },
      { name: "Mustard", grams: 10 },
    ],
    macros: {
      carbs: "35g",
      proteins: "25g",
      fats: "15g",
    },
    description:
      "A hearty wrap filled with lean turkey, creamy avocado, fresh vegetables, and a touch of mustard.",
    cookingMethod: [
      "1. Lay out the whole wheat wrap.",
      "2. Spread mustard on the wrap.",
      "3. Layer turkey slices, sliced avocado, lettuce, and tomato.",
      "4. Roll the wrap tightly, tucking in the sides.",
      "5. Cut in half diagonally and serve.",
    ],
  },
];

export const dinner_recipes = [
  {
    name: "Baked Salmon with Roasted Vegetables",
    image: "https://via.placeholder.com/150",
    ingredients: [
      { name: "Salmon fillet", grams: 200 },
      { name: "Mixed vegetables", grams: 250 },
      { name: "Olive oil", grams: 20 },
      { name: "Lemon", grams: 30 },
      { name: "Herbs and spices", grams: 5 },
    ],
    macros: {
      carbs: "20g",
      proteins: "35g",
      fats: "25g",
    },
    description:
      "Tender baked salmon served with a colorful medley of roasted vegetables, seasoned with herbs and a squeeze of lemon.",
    cookingMethod: [
      "1. Preheat oven to 200°C (400°F).",
      "2. Season salmon with herbs and spices.",
      "3. Chop vegetables and toss with olive oil and seasonings.",
      "4. Place salmon and vegetables on a baking sheet.",
      "5. Bake for 15-20 minutes until salmon is cooked through and vegetables are tender.",
      "6. Squeeze lemon over the dish before serving.",
    ],
  },
  {
    name: "Vegetarian Stir-Fry with Tofu",
    image: "https://via.placeholder.com/150",
    ingredients: [
      { name: "Firm tofu", grams: 200 },
      { name: "Mixed vegetables", grams: 300 },
      { name: "Soy sauce", grams: 30 },
      { name: "Sesame oil", grams: 10 },
      { name: "Garlic", grams: 10 },
      { name: "Ginger", grams: 5 },
    ],
    macros: {
      carbs: "25g",
      proteins: "20g",
      fats: "15g",
    },
    description:
      "A flavorful vegetarian stir-fry featuring crispy tofu and a variety of colorful vegetables in a savory sauce.",
    cookingMethod: [
      "1. Press and cube tofu, then pan-fry until crispy.",
      "2. In a wok, stir-fry minced garlic and ginger in sesame oil.",
      "3. Add chopped vegetables and cook until tender-crisp.",
      "4. Add tofu and soy sauce, stir to combine.",
      "5. Cook for an additional 2-3 minutes to meld flavors.",
      "6. Serve hot, optionally over rice or noodles.",
    ],
  },
];

export const libraryOptions = ["Workouts", "Nutrition", "Podcasts"];
export const exercises = [
  {
    id: 1,
    category: "chest",
    exercises: [
      { id: 101, name: "Barbell Bench Press (Flat)" },
      { id: 102, name: "Dumbbell Bench Press (Flat)" },
      { id: 103, name: "Incline Barbell Bench Press" },
      { id: 104, name: "Incline Dumbbell Bench Press" },
      { id: 105, name: "Decline Barbell Bench Press" },
      { id: 106, name: "Decline Dumbbell Bench Press" },
      { id: 107, name: "Chest Press Machine (Incline)" },
      { id: 108, name: "Chest Press Machine (Flat)" },
      { id: 109, name: "Chest Press Machine (Decline)" },
      { id: 110, name: "Peck Deck" },
      { id: 111, name: "Cable Fly" },
      { id: 112, name: "Pushups (Chest Focused)" },
      { id: 113, name: "Dips (Chest Focused)" },
      { id: 114, name: "Flat Dumbbell Fly" },
      { id: 115, name: "Incline Dumbbell Fly" },
      { id: 116, name: "Decline Dumbbell Fly" },
    ],
  },
  {
    id: 2,
    category: "back",
    exercises: [
      { id: 201, name: "Seated Row" },
      { id: 202, name: "Single Arm Seated Row" },
      { id: 203, name: "Lat Pulldown (Lat Focused)" },
      { id: 204, name: "Lat Pulldown (Upper back focused)" },
      { id: 205, name: "Single Arm Lat Pulldown (Lat focused)" },
      { id: 206, name: "Single Arm Dumbbell Row" },
      { id: 207, name: "Deadlift" },
      { id: 208, name: "Bent Over Barbell Row" },
      { id: 209, name: "Bent Over Dumbbell Row" },
      { id: 210, name: "High to Low row (Pulldown Variation)" },
      { id: 211, name: "Mid Row (Upper Back Focus)" },
      { id: 212, name: "Low to High Row (Upper Back Focus)" },
      { id: 213, name: "Pullover Machine (Lat Focused)" },
      { id: 214, name: "Horizontal Barbell Row (Upper Back Focused)" },
      { id: 215, name: "Pull-ups" },
      { id: 216, name: "T-Bar Row" },
    ],
  },
  {
    id: 3,
    category: "biceps",
    exercises: [
      { id: 301, name: "Barbell Curl" },
      { id: 302, name: "Dumbbell Curl" },
      { id: 303, name: "Cable Curl" },
      { id: 304, name: "Concentration Curl" },
      { id: 305, name: "EZ Bar Curl" },
      { id: 306, name: "Incline Bench Curl" },
    ],
  },
  {
    id: 4,
    category: "triceps",
    exercises: [
      { id: 401, name: "Skull Crushers" },
      { id: 402, name: "Cable Pushdown" },
      { id: 403, name: "Triceps Extension (Single Arm)" },
      { id: 404, name: "Dips (Triceps Focused)" },
      { id: 405, name: "Close Grip Bench" },
      { id: 406, name: "Triceps Kickbacks" },
      { id: 407, name: "Overhead Triceps Extension Dumbbells" },
      { id: 408, name: "Overhead Triceps Extension Cables" },
    ],
  },
  {
    id: 5,
    category: "shoulders",
    exercises: [
      { id: 501, name: "Lateral Raises (Standing)" },
      { id: 502, name: "Lateral Raises (Seated)" },
      { id: 503, name: "Cable Raise" },
      { id: 504, name: "Rear Delt Fly Dumbbell" },
      { id: 505, name: "Rear Delt Fly Machine" },
      { id: 506, name: "Shoulder Press Dumbbell" },
      { id: 507, name: "Shoulder Press Barbell" },
      { id: 508, name: "Shoulder Press Machine" },
      { id: 509, name: "Seated Shoulder Press Barbell" },
      { id: 510, name: "Seated Shoulder Press Dumbbell" },
      { id: 511, name: "Seated Shoulder Press Smith Machine" },
    ],
  },
  {
    id: 6,
    category: "legs (quads)",
    exercises: [
      { id: 601, name: "Squats Barbell" },
      { id: 602, name: "Leg Extension" },
      { id: 603, name: "Leg Press" },
      { id: 604, name: "Lunges (Quad Focus)" },
      { id: 605, name: "Heel Elevated Goblet Squats/Front Squats" },
      { id: 606, name: "Hack Squat" },
      { id: 607, name: "Pendulum Squat" },
    ],
  },
  {
    id: 7,
    category: "legs (hamstrings)",
    exercises: [
      { id: 701, name: "Squats (Barbell)" },
      { id: 702, name: "Leg Press" },
      { id: 703, name: "Hamstring Curls Seated" },
      { id: 704, name: "Hamstring Curls Lying" },
      { id: 705, name: "Good Mornings" },
      { id: 706, name: "Romanian Deadlifts (RDL’s)" },
    ],
  },
  {
    id: 8,
    category: "legs (glutes)",
    exercises: [
      { id: 801, name: "Hip Thrusts" },
      { id: 802, name: "Lunges (Glute Focused)" },
      { id: 803, name: "Leg Press (Glute Focused)" },
      { id: 804, name: "Hyper Extension (Glute Focused)" },
    ],
  },
  {
    id: 9,
    category: "calfs",
    exercises: [
      { id: 901, name: "Calf Raises Smith Machine" },
      { id: 902, name: "Donkey Calf Raises Machine" },
      { id: 903, name: "Seated Calf Raises Machine" },
    ],
  },
  {
    id: 10,
    category: "abs",
    exercises: [
      { id: 1001, name: "Leg Raises" },
      { id: 1002, name: "Knee Raises" },
      { id: 1003, name: "Planks" },
      { id: 1004, name: "Cable Crunch" },
      { id: 1005, name: "Sit Ups (Flat/Decline)" },
    ],
  },
];

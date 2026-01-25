
export const ACTIVITY_CALORIES_PER_MINUTE = 5; // Default fallback
export const WORK_CALORIES_PER_HOUR = 60;
export const BALANCE_THRESHOLD = 100;

export interface FoodDatabaseEntry {
  category: string;
  items: { [key: string]: { name: string; kcal: number; unit: string; type: 'count' | 'weight' | 'volume' } };
}

export interface ActivityDatabaseEntry {
  category: string;
  items: { [key: string]: { name: string; kcalPerUnit: number; unitType: 'min' | 'set' } };
}

export const ACTIVITY_DATABASE: { [key: string]: ActivityDatabaseEntry } = {
  general: {
    category: 'General',
    items: {
      walking: { name: 'Walking', kcalPerUnit: 4, unitType: 'min' },
      running: { name: 'Running', kcalPerUnit: 11, unitType: 'min' },
      cycling: { name: 'Cycling', kcalPerUnit: 8, unitType: 'min' },
      swimming: { name: 'Swimming', kcalPerUnit: 10, unitType: 'min' },
      yoga: { name: 'Yoga', kcalPerUnit: 3, unitType: 'min' },
    }
  },
  gym: {
    category: 'Gym / Lifting',
    items: {
      squat: { name: 'Squats', kcalPerUnit: 25, unitType: 'set' },
      bench: { name: 'Bench Press', kcalPerUnit: 20, unitType: 'set' },
      deadlift: { name: 'Deadlift', kcalPerUnit: 30, unitType: 'set' },
      overhead: { name: 'Overhead Press', kcalPerUnit: 18, unitType: 'set' },
      latpull: { name: 'Lat Pulldown', kcalPerUnit: 12, unitType: 'set' },
      legpress: { name: 'Leg Press', kcalPerUnit: 22, unitType: 'set' },
      biceps: { name: 'Bicep Curls', kcalPerUnit: 8, unitType: 'set' },
      hiit: { name: 'HIIT / Circuit', kcalPerUnit: 12, unitType: 'min' },
    }
  },
  sports: {
    category: 'Sports',
    items: {
      football: { name: 'Football (Soccer)', kcalPerUnit: 9, unitType: 'min' },
      basketball: { name: 'Basketball', kcalPerUnit: 10, unitType: 'min' },
      tennis: { name: 'Tennis', kcalPerUnit: 8, unitType: 'min' },
      badminton: { name: 'Badminton', kcalPerUnit: 6, unitType: 'min' },
      volleyball: { name: 'Volleyball', kcalPerUnit: 4, unitType: 'min' },
      boxing: { name: 'Boxing', kcalPerUnit: 12, unitType: 'min' },
      climbing: { name: 'Rock Climbing', kcalPerUnit: 9, unitType: 'min' },
    }
  }
};

export const FOOD_DATABASE: { [key: string]: FoodDatabaseEntry } = {
  fruit: {
    category: 'Fruit',
    items: {
      apple: { name: 'Apple', kcal: 95, unit: 'whole', type: 'count' },
      banana: { name: 'Banana', kcal: 105, unit: 'whole', type: 'count' },
      orange: { name: 'Orange', kcal: 65, unit: 'whole', type: 'count' },
      berries: { name: 'Berries', kcal: 85, unit: 'cup', type: 'volume' },
      grapes: { name: 'Grapes', kcal: 62, unit: 'cup', type: 'volume' },
      mango: { name: 'Mango', kcal: 200, unit: 'whole', type: 'count' },
      pineapple: { name: 'Pineapple', kcal: 50, unit: 'slice', type: 'count' },
      kiwi: { name: 'Kiwi', kcal: 42, unit: 'whole', type: 'count' },
      strawberry: { name: 'Strawberry', kcal: 4, unit: 'berry', type: 'count' },
      avocado: { name: 'Avocado', kcal: 160, unit: 'half', type: 'count' },
      lemon: { name: 'Lemon', kcal: 17, unit: 'whole', type: 'count' }
    }
  },
  meat: {
    category: 'Protein & Fats',
    items: {
      chicken: { name: 'Chicken Breast', kcal: 1.65, unit: 'gram', type: 'weight' },
      beef: { name: 'Beef Steak', kcal: 2.50, unit: 'gram', type: 'weight' },
      fish: { name: 'White Fish', kcal: 1.20, unit: 'gram', type: 'weight' },
      eggs: { name: 'Egg', kcal: 78, unit: 'large', type: 'count' },
      tofu: { name: 'Tofu', kcal: 0.8, unit: 'gram', type: 'weight' },
      pork: { name: 'Pork Chop', kcal: 2.4, unit: 'gram', type: 'weight' },
      salmon: { name: 'Salmon', kcal: 2.0, unit: 'gram', type: 'weight' }
    }
  },
  seeds: {
    category: 'Seeds & Nuts',
    items: {
      peanut: { name: 'Peanut', kcal: 5.67, unit: 'gram', type: 'weight' },
      almond: { name: 'Almond', kcal: 5.76, unit: 'gram', type: 'weight' },
      pistachio: { name: 'Pistachio', kcal: 5.62, unit: 'gram', type: 'weight' },
      walnut: { name: 'Walnut', kcal: 6.54, unit: 'gram', type: 'weight' },
      cashew: { name: 'Cashew', kcal: 5.53, unit: 'gram', type: 'weight' },
      pumpkin: { name: 'Pumpkin Seeds', kcal: 5.59, unit: 'gram', type: 'weight' },
      chia: { name: 'Chia Seeds', kcal: 4.86, unit: 'gram', type: 'weight' },
      peanutbutter: { name: 'Peanut Butter', kcal: 94, unit: 'spoon', type: 'count' }
    }
  },
  sweets: {
    category: 'Sweets/Snacks',
    items: {
      cake: { name: 'Cake', kcal: 350, unit: 'slice', type: 'count' },
      cookie: { name: 'Cookie', kcal: 150, unit: 'piece', type: 'count' },
      chocolate: { name: 'Dark Chocolate', kcal: 170, unit: 'bar segment', type: 'count' },
      icecream: { name: 'Ice Cream', kcal: 140, unit: 'scoop', type: 'count' },
      chips: { name: 'Potato Chips', kcal: 150, unit: 'small bag', type: 'count' },
      popcorn: { name: 'Popcorn', kcal: 31, unit: 'cup', type: 'volume' },
      pretzels: { name: 'Pretzels', kcal: 110, unit: 'handful', type: 'count' },
      yogurt: { name: 'Greek Yogurt', kcal: 130, unit: 'cup', type: 'volume' },
      proteinbar: { name: 'Protein Bar', kcal: 210, unit: 'bar', type: 'count' },
      donut: { name: 'Donut', kcal: 260, unit: 'whole', type: 'count' },
      muffin: { name: 'Muffin', kcal: 340, unit: 'whole', type: 'count' },
      brownie: { name: 'Brownie', kcal: 220, unit: 'square', type: 'count' },
      jerky: { name: 'Beef Jerky', kcal: 80, unit: 'piece', type: 'count' },
      crackers: { name: 'Crackers', kcal: 70, unit: 'serving', type: 'count' },
      gummybears: { name: 'Gummy Bears', kcal: 140, unit: 'handful', type: 'count' },
      trailmix: { name: 'Trail Mix', kcal: 160, unit: 'handful', type: 'count' },
      cupcake: { name: 'Cupcake', kcal: 240, unit: 'whole', type: 'count' },
      croissant: { name: 'Croissant', kcal: 270, unit: 'whole', type: 'count' },
      pudding: { name: 'Pudding', kcal: 120, unit: 'cup', type: 'volume' },
      macaron: { name: 'Macaron', kcal: 80, unit: 'piece', type: 'count' }
    }
  },
  drinks: {
    category: 'Beverages',
    items: {
      espresso: { name: 'Espresso', kcal: 5, unit: 'shot', type: 'count' },
      latte: { name: 'Caffe Latte', kcal: 150, unit: 'cup', type: 'volume' },
      cappuccino: { name: 'Cappuccino', kcal: 120, unit: 'cup', type: 'volume' },
      americano: { name: 'Americano', kcal: 5, unit: 'cup', type: 'volume' },
      flatwhite: { name: 'Flat White', kcal: 120, unit: 'cup', type: 'volume' },
      greentea: { name: 'Green Tea', kcal: 2, unit: 'cup', type: 'volume' },
      blacktea: { name: 'Black Tea', kcal: 2, unit: 'cup', type: 'volume' },
      herbaltea: { name: 'Herbal Tea', kcal: 2, unit: 'cup', type: 'volume' },
      icedtea: { name: 'Iced Tea (Sweet)', kcal: 90, unit: 'glass', type: 'volume' },
      matcha: { name: 'Matcha Latte', kcal: 180, unit: 'cup', type: 'volume' },
      beer: { name: 'Beer (330ml)', kcal: 150, unit: 'bottle', type: 'count' },
      wine: { name: 'Wine', kcal: 125, unit: 'glass', type: 'volume' },
      whiskey: { name: 'Whiskey', kcal: 70, unit: 'shot', type: 'count' },
      soda: { name: 'Soda/Cola', kcal: 150, unit: 'can', type: 'count' },
      orangejuice: { name: 'Orange Juice', kcal: 110, unit: 'glass', type: 'volume' },
      energydrink: { name: 'Energy Drink', kcal: 110, unit: 'can', type: 'count' },
      smoothie: { name: 'Fruit Smoothie', kcal: 220, unit: 'glass', type: 'volume' },
      water: { name: 'Water', kcal: 0, unit: 'glass', type: 'volume' }
    }
  },
  carbs: {
    category: 'Carbs/Grains',
    items: {
      rice: { name: 'Rice (Cooked)', kcal: 1.30, unit: 'gram', type: 'weight' },
      pasta: { name: 'Pasta (Cooked)', kcal: 1.31, unit: 'gram', type: 'weight' },
      bread: { name: 'Bread Slice', kcal: 80, unit: 'slice', type: 'count' },
      potato: { name: 'Baked Potato', kcal: 0.9, unit: 'gram', type: 'weight' },
    }
  },
  veggies: {
    category: 'Vegetables',
    items: {
      broccoli: { name: 'Broccoli', kcal: 0.35, unit: 'gram', type: 'weight' },
      spinach: { name: 'Spinach', kcal: 0.23, unit: 'gram', type: 'weight' },
      carrots: { name: 'Carrots', kcal: 0.41, unit: 'gram', type: 'weight' },
      salad: { name: 'Mixed Greens', kcal: 15, unit: 'bowl', type: 'count' },
      bellpepper: { name: 'Bell Pepper', kcal: 0.31, unit: 'gram', type: 'weight' },
      cucumber: { name: 'Cucumber', kcal: 0.15, unit: 'gram', type: 'weight' },
      tomato: { name: 'Tomato', kcal: 0.18, unit: 'gram', type: 'weight' },
      zucchini: { name: 'Zucchini', kcal: 0.17, unit: 'gram', type: 'weight' }
    }
  }
};

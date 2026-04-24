/**
 * gradingService.js
 * All 4 health grading algorithms for FoodTrust AI
 */

/**
 * Custom Health Score (0–10)
 * Starts at 10 and subtracts penalty points based on nutritional content.
 * Also applies health-mode specific modifiers.
 */
function calcCustomScore(nutrition, healthMode = 'default') {
  const { sugar = 0, saturatedFat = 0, transFat = 0, calories = 0, fat = 0, protein = 0 } = nutrition;

  let score = 10;

  // Base deductions
  if (sugar > 15) score -= 3;
  if (saturatedFat > 5) score -= 2;
  if (transFat > 0) score -= 3;
  if (calories > 400) score -= 1;

  // Health mode modifiers
  if (healthMode === 'diabetic') {
    if (sugar > 5) score -= 2;
  }
  if (healthMode === 'weightLoss') {
    if (calories > 300) score -= 1;
    if (fat > 10) score -= 1;
  }
  if (healthMode === 'gym') {
    if (protein > 20) score += 1;
    if (sugar > 10) score -= 2;
  }

  return Math.max(0, Math.min(10, parseFloat(score.toFixed(1))));
}

/**
 * Nutri-Score (A–E) — European system
 * Negative: energy, saturatedFat, sugars, sodium
 * Positive: fiber, protein
 */
function calcNutriScore(nutrition) {
  const { calories = 0, saturatedFat = 0, sugar = 0, sodium = 0, fiber = 0, protein = 0 } = nutrition;

  // Negative points
  let negPts = 0;
  if (calories > 335) negPts += 1;
  if (calories > 670) negPts += 2;
  if (calories > 1005) negPts += 3;
  if (calories > 1340) negPts += 4;
  if (saturatedFat > 1) negPts += 1;
  if (saturatedFat > 2) negPts += 2;
  if (saturatedFat > 4) negPts += 3;
  if (sugar > 4.5) negPts += 1;
  if (sugar > 9) negPts += 2;
  if (sugar > 13.5) negPts += 3;
  if (sodium > 200) negPts += 1;
  if (sodium > 400) negPts += 2;
  if (sodium > 600) negPts += 3;

  // Positive points
  let posPts = 0;
  if (fiber > 0.9) posPts += 1;
  if (fiber > 1.9) posPts += 2;
  if (fiber > 2.8) posPts += 3;
  if (protein > 1.6) posPts += 1;
  if (protein > 3.2) posPts += 2;
  if (protein > 4.8) posPts += 3;

  const finalScore = negPts - posPts;

  if (finalScore <= -1) return 'A';
  if (finalScore <= 2) return 'B';
  if (finalScore <= 10) return 'C';
  if (finalScore <= 18) return 'D';
  return 'E';
}

/**
 * Nutri-Grade (A–D) — Singapore system
 * Based on sugar and saturated fat per 100g
 */
function calcNutriGrade(nutrition) {
  const { sugar = 0, saturatedFat = 0 } = nutrition;

  if (sugar < 1 && saturatedFat < 0.7) return 'A';
  if (sugar < 5 && saturatedFat < 1.2) return 'B';
  if (sugar < 10 && saturatedFat < 2.8) return 'C';
  return 'D';
}

/**
 * Japanese Grade — Balance-based system
 * Considers macronutrient ratio and overall nutritional balance
 */
function calcJapaneseGrade(nutrition) {
  const { calories = 0, protein = 0, fat = 0, sugar = 0, fiber = 0, sodium = 0 } = nutrition;

  let score = 100;

  // Penalize imbalance
  if (calories > 400) score -= 20;
  if (fat > 15) score -= 20;
  if (sodium > 600) score -= 15;
  if (sugar > 10) score -= 10;

  // Reward good nutrition
  if (protein > 5) score += 10;
  if (fiber > 2) score += 10;

  score = Math.max(0, Math.min(100, score));

  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Fair';
  return 'Poor';
}

/**
 * Master function — Compute all 4 grades at once
 */
function computeAllGrades(nutrition, healthMode = 'default') {
  return {
    customScore: calcCustomScore(nutrition, healthMode),
    nutriScore: calcNutriScore(nutrition),
    nutriGrade: calcNutriGrade(nutrition),
    japaneseGrade: calcJapaneseGrade(nutrition),
  };
}

module.exports = { computeAllGrades, calcCustomScore, calcNutriScore, calcNutriGrade, calcJapaneseGrade };

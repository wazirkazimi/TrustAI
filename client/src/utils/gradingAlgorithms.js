/**
 * gradingAlgorithms.js — Frontend mirrors of backend grading logic
 * Used for instant client-side preview before server responds
 */

export function calcCustomScore(nutrition, healthMode = 'default') {
  const { sugar = 0, saturatedFat = 0, transFat = 0, calories = 0, fat = 0, protein = 0 } = nutrition;
  let score = 10;
  if (sugar > 15) score -= 3;
  if (saturatedFat > 5) score -= 2;
  if (transFat > 0) score -= 3;
  if (calories > 400) score -= 1;
  if (healthMode === 'diabetic' && sugar > 5) score -= 2;
  if (healthMode === 'weightLoss') { if (calories > 300) score -= 1; if (fat > 10) score -= 1; }
  if (healthMode === 'gym') { if (protein > 20) score += 1; if (sugar > 10) score -= 2; }
  return Math.max(0, Math.min(10, parseFloat(score.toFixed(1))));
}

export function calcNutriScore(nutrition) {
  const { calories = 0, saturatedFat = 0, sugar = 0, sodium = 0, fiber = 0, protein = 0 } = nutrition;
  let neg = 0, pos = 0;
  if (calories > 335) neg++; if (calories > 670) neg++; if (calories > 1005) neg++;
  if (saturatedFat > 1) neg++; if (saturatedFat > 2) neg++; if (saturatedFat > 4) neg++;
  if (sugar > 4.5) neg++; if (sugar > 9) neg++; if (sugar > 13.5) neg++;
  if (sodium > 200) neg++; if (sodium > 400) neg++; if (sodium > 600) neg++;
  if (fiber > 0.9) pos++; if (fiber > 1.9) pos++; if (fiber > 2.8) pos++;
  if (protein > 1.6) pos++; if (protein > 3.2) pos++; if (protein > 4.8) pos++;
  const s = neg - pos;
  if (s <= -1) return 'A';
  if (s <= 2)  return 'B';
  if (s <= 10) return 'C';
  if (s <= 18) return 'D';
  return 'E';
}

export function calcNutriGrade(nutrition) {
  const { sugar = 0, saturatedFat = 0 } = nutrition;
  if (sugar < 1  && saturatedFat < 0.7) return 'A';
  if (sugar < 5  && saturatedFat < 1.2) return 'B';
  if (sugar < 10 && saturatedFat < 2.8) return 'C';
  return 'D';
}

export function calcJapaneseGrade(nutrition) {
  const { calories = 0, fat = 0, sodium = 0, sugar = 0, protein = 0, fiber = 0 } = nutrition;
  let score = 100;
  if (calories > 400) score -= 20;
  if (fat > 15) score -= 20;
  if (sodium > 600) score -= 15;
  if (sugar > 10) score -= 10;
  if (protein > 5) score += 10;
  if (fiber > 2)   score += 10;
  score = Math.max(0, Math.min(100, score));
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Fair';
  return 'Poor';
}

export function computeAllGrades(nutrition, healthMode = 'default') {
  return {
    customScore:   calcCustomScore(nutrition, healthMode),
    nutriScore:    calcNutriScore(nutrition),
    nutriGrade:    calcNutriGrade(nutrition),
    japaneseGrade: calcJapaneseGrade(nutrition),
  };
}

/** Helper — returns Tailwind color classes for a score 0-10 */
export function scoreColors(score) {
  if (score >= 7) return { bg: 'bg-green-500',  text: 'text-green-600',  light: 'bg-green-50',  label: 'Good' };
  if (score >= 4) return { bg: 'bg-amber-400',  text: 'text-amber-600',  light: 'bg-amber-50',  label: 'Okay' };
  return           { bg: 'bg-red-500',    text: 'text-red-600',    light: 'bg-red-50',    label: 'Poor' };
}

/** Helper — Nutri-Score badge color */
export function nutriScoreBg(grade) {
  return { A: 'bg-green-600', B: 'bg-lime-500', C: 'bg-amber-400', D: 'bg-orange-500', E: 'bg-red-600' }[grade] || 'bg-gray-400';
}

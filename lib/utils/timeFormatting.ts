// lib/utils/timeFormatting.ts

/**
 * Formats time strings from minutes to hours when appropriate
 * Examples:
 * - "30" → "30 min"
 * - "60" → "1 hour"
 * - "90" → "1.5 hours"
 * - "240" → "4 hours"
 */
export function formatCookingTime(timeStr: string): string {
  if (!timeStr) return '';

  const minutes = parseInt(timeStr, 10);

  if (isNaN(minutes)) {
    return timeStr;
  }

  if (minutes < 60) {
    return `${minutes} min`;
  }
  
  const hours = minutes / 60;
  
  if (hours === 1) {
    return '1 hour';
  }
  
  // Check for whole numbers of hours
  if (minutes % 60 === 0) {
    return `${hours} hours`;
  }
  
  // For fractional hours, show as decimal (e.g., 1.5)
  // Using toFixed(1) and then parseFloat to remove trailing .0
  const decimalHours = parseFloat(hours.toFixed(1));
  return `${decimalHours} hours`;
}
  
  /**
   * Formats prep and cook times for display
   * Handles both individual times and calculates total
   */
  export function formatRecipeTimes(prepTime: string, cookTime: string): {
    prep: string;
    cook: string;
    total: string;
  } {
    const prepMinutes = parseInt(prepTime) || 0;
    const cookMinutes = parseInt(cookTime) || 0;
    const totalMinutes = prepMinutes + cookMinutes;
    
    return {
      prep: formatCookingTime(`${prepMinutes}`),
      cook: formatCookingTime(`${cookMinutes}`),
      total: formatCookingTime(`${totalMinutes}`)
    };
  }
  
  // Update your RecipeCard component (app/components/RecipeCard.tsx) to use this:
  // import { formatCookingTime } from '@/lib/utils/timeFormatting';
  // Then in the card:
  // <span className="flex items-center gap-1">
  //   <FaClock className="text-[var(--accent-primary)]" />
  //   {formatCookingTime(recipe.totalTime)}
  // </span>
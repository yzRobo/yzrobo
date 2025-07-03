// lib/utils/timeFormatting.ts

/**
 * Formats time strings from minutes to hours when appropriate
 * Examples:
 * - "30 min" → "30 min"
 * - "60 min" → "1 hour"
 * - "90 min" → "1.5 hours"
 * - "120 min" → "2 hours"
 */
export function formatCookingTime(timeStr: string): string {
    // Handle null/undefined
    if (!timeStr) return '';
    
    // Extract minutes from strings like "90 min", "120 minutes", etc.
    const match = timeStr.match(/(\d+)\s*min/i);
    if (!match) return timeStr;
    
    const minutes = parseInt(match[1]);
    
    // Keep as minutes if less than 60
    if (minutes < 60) return timeStr;
    
    // Convert to hours
    const hours = minutes / 60;
    
    // Format based on whether it's a whole number
    if (hours === 1) {
      return '1 hour';
    } else if (hours % 1 === 0) {
      return `${hours} hours`;
    } else {
      // For fractional hours, show as decimal (e.g., 1.5 hours)
      return `${hours} hours`;
    }
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
      prep: formatCookingTime(`${prepMinutes} min`),
      cook: formatCookingTime(`${cookMinutes} min`),
      total: formatCookingTime(`${totalMinutes} min`)
    };
  }
  
  // Update your RecipeCard component (app/components/RecipeCard.tsx) to use this:
  // import { formatCookingTime } from '@/lib/utils/timeFormatting';
  // Then in the card:
  // <span className="flex items-center gap-1">
  //   <FaClock className="text-[var(--accent-primary)]" />
  //   {formatCookingTime(recipe.totalTime)}
  // </span>
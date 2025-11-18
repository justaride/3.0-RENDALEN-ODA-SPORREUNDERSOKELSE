// Data processing utilities for Rendalen Boligbehovsundersøkelse
// CRITICAL: Proper handling of multi-choice questions
import type { ChartData, Response, AGE_ORDER, LOCATION_ORDER } from '../types/survey';

/**
 * CRITICAL FUNCTION: Count multi-choice responses correctly
 *
 * Multi-choice fields are stored as semicolon-separated strings.
 * We must count each choice INDIVIDUALLY, not as combinations.
 *
 * WRONG: ["A;B", "A;C"] -> {"A;B": 1, "A;C": 1}
 * RIGHT: ["A;B", "A;C"] -> {"A": 2, "B": 1, "C": 1}
 *
 * @param responses - Array of response values (can be string or null)
 * @returns Record of choice -> count
 */
export function countMultipleChoices(responses: (string | null)[]): Record<string, number> {
  const counts: Record<string, number> = {};

  responses.forEach(response => {
    if (!response) return;

    // Split by semicolon to get individual choices
    const choices = response.split(';').map(c => c.trim()).filter(c => c.length > 0);

    choices.forEach(choice => {
      // Skip invalid/empty values
      if (choice === 'Unset' || choice === '.' || choice === '') {
        return;
      }

      // Count each choice individually
      counts[choice] = (counts[choice] || 0) + 1;
    });
  });

  return counts;
}

/**
 * Count single-choice responses
 * @param responses - Array of response values
 * @returns Record of choice -> count
 */
export function countSingleChoice(responses: (string | null)[]): Record<string, number> {
  const counts: Record<string, number> = {};

  responses.forEach(response => {
    if (!response || response === 'Unset' || response === '.' || response === '') {
      return;
    }

    const trimmed = response.trim();
    counts[trimmed] = (counts[trimmed] || 0) + 1;
  });

  return counts;
}

/**
 * Convert counts to ChartData format
 * @param counts - Record of choice -> count
 * @param totalResponses - Total number of responses for percentage calculation
 * @returns Array of ChartData objects
 */
export function countsToChartData(
  counts: Record<string, number>,
  totalResponses: number
): ChartData[] {
  return Object.entries(counts).map(([name, count]) => ({
    name,
    value: count,
    count,
    percent: (count / totalResponses) * 100
  }));
}

/**
 * Sort chart data by popularity (highest count first)
 * @param data - Chart data to sort
 * @returns Sorted chart data
 */
export function sortByPopularity(data: ChartData[]): ChartData[] {
  return [...data].sort((a, b) => b.count! - a.count!);
}

/**
 * Sort chart data alphabetically
 * @param data - Chart data to sort
 * @returns Sorted chart data
 */
export function sortAlphabetically(data: ChartData[]): ChartData[] {
  return [...data].sort((a, b) => a.name.localeCompare(b.name, 'no'));
}

/**
 * Sort chart data by a predefined order (e.g., age groups)
 * @param data - Chart data to sort
 * @param order - Predefined order array
 * @returns Sorted chart data
 */
export function sortByCustomOrder<T extends readonly string[]>(
  data: ChartData[],
  order: T
): ChartData[] {
  return [...data].sort((a, b) => {
    const indexA = order.indexOf(a.name as T[number]);
    const indexB = order.indexOf(b.name as T[number]);

    // If both items are in the order array, sort by their position
    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB;
    }

    // Items not in order array go to the end
    if (indexA === -1 && indexB !== -1) return 1;
    if (indexA !== -1 && indexB === -1) return -1;

    // If neither is in order, sort alphabetically
    return a.name.localeCompare(b.name, 'no');
  });
}

/**
 * Extract field value from response
 * @param response - Survey response
 * @param category - Category name (e.g., 'demografi')
 * @param field - Field name within category
 * @returns Field value or null
 */
export function extractFieldValue(
  response: Response,
  category: keyof Response['data'],
  field: string
): string | null {
  const categoryData = response.data[category];
  if (!categoryData || typeof categoryData !== 'object') {
    return null;
  }

  return (categoryData as any)[field] || null;
}

/**
 * Extract array of field values from all responses
 * @param responses - Array of responses
 * @param category - Category name
 * @param field - Field name within category
 * @returns Array of field values
 */
export function extractFieldValues(
  responses: Response[],
  category: keyof Response['data'],
  field: string
): (string | null)[] {
  return responses.map(response => extractFieldValue(response, category, field));
}

/**
 * Get top N items from chart data
 * @param data - Chart data
 * @param n - Number of top items to return
 * @returns Top N chart data items
 */
export function getTopN(data: ChartData[], n: number): ChartData[] {
  return sortByPopularity(data).slice(0, n);
}

/**
 * Calculate percentage from count and total
 * @param count - Item count
 * @param total - Total count
 * @param decimals - Number of decimal places (default 1)
 * @returns Percentage value
 */
export function calculatePercentage(
  count: number,
  total: number,
  decimals: number = 1
): number {
  if (total === 0) return 0;
  return Number(((count / total) * 100).toFixed(decimals));
}

/**
 * Format number with thousand separators (Norwegian format)
 * @param value - Number to format
 * @returns Formatted string
 */
export function formatNumber(value: number): string {
  return value.toLocaleString('no-NO');
}

/**
 * Format percentage value
 * @param value - Percentage value
 * @param decimals - Number of decimal places (default 1)
 * @returns Formatted percentage string
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Clean and normalize text for display
 * @param text - Text to clean
 * @returns Cleaned text
 */
export function cleanText(text: string): string {
  return text
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/\n+/g, ' ');
}

/**
 * Check if a field is a multi-select field
 * Multi-select fields typically contain "flere valg mulig" or "flere svar mulig" in the field name
 * @param fieldName - Name of the field
 * @returns true if field is multi-select
 */
export function isMultiSelectField(fieldName: string): boolean {
  return fieldName.includes('flere_valg_mulig') || fieldName.includes('flere_svar_mulig');
}

/**
 * Process field data into chart format
 * Automatically detects if field is multi-select based on field name
 * @param responses - Array of responses
 * @param category - Category name
 * @param field - Field name
 * @returns Chart data
 */
export function processFieldToChartData(
  responses: Response[],
  category: keyof Response['data'],
  field: string
): ChartData[] {
  const values = extractFieldValues(responses, category, field);
  const isMultiSelect = isMultiSelectField(field);

  const counts = isMultiSelect
    ? countMultipleChoices(values)
    : countSingleChoice(values);

  return countsToChartData(counts, responses.length);
}

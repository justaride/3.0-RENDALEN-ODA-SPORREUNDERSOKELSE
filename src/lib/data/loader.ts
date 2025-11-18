// Data loader for Rendalen Boligbehovsundersøkelse
import surveyDataRaw from './survey-data.json';
import type { SurveyData, Response } from '../types/survey';

/**
 * Load survey data from JSON file
 * @returns {SurveyData} The complete survey data
 */
export function loadSurveyData(): SurveyData {
  return surveyDataRaw as SurveyData;
}

/**
 * Get all responses from the first sheet
 * @returns {Response[]} Array of all responses
 */
export function getAllResponses(): Response[] {
  const data = loadSurveyData();
  if (data.sheets.length === 0) {
    return [];
  }
  return data.sheets[0].responses;
}

/**
 * Get total number of responses
 * @returns {number} Total count of responses
 */
export function getTotalResponses(): number {
  return getAllResponses().length;
}

/**
 * Get responses filtered by a condition
 * @param predicate - Filter function
 * @returns {Response[]} Filtered responses
 */
export function getFilteredResponses(
  predicate: (response: Response) => boolean
): Response[] {
  return getAllResponses().filter(predicate);
}

/**
 * Get survey data (alias for loadSurveyData for consistency)
 * @returns {SurveyData} The complete survey data
 */
export function getSurveyData(): SurveyData {
  return loadSurveyData();
}

/**
 * Get survey metadata
 */
export function getSurveyMetadata() {
  const data = loadSurveyData();
  return data.metadata;
}

/**
 * Get sheet statistics
 */
export function getSheetStatistics() {
  const data = loadSurveyData();
  if (data.sheets.length === 0) {
    return null;
  }
  return data.sheets[0].statistics;
}

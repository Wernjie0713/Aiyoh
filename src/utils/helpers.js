/**
 * Utility helper functions for the application
 */

/**
 * Creates a delay using Promise to simulate processing time
 * @param {number} ms - Milliseconds to delay
 * @returns {Promise} Promise that resolves after the specified time
 */
export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Other utility functions can be added here as needed
 */ 
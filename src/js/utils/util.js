/**
 * Checks if a value is a string.
 *
 * @param {Any} value - Value.
 * @returns {Boolean}
 */
export const isString = value => typeof value === 'string';

/**
 * Disables/Enables Tartib.
 *
 * @param {Object} tartib - Instance.
 * @param {Boolean} disabled - A state to set.
 */
export const setDisable = (tartib, disabled) => {
    tartib.config.disabled = disabled;
}
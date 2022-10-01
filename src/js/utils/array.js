const array = Array;
/**
 * Checks if a value is an array.
 *
 * @param {*} subject - A value to test whether it's an array.
 * @returns {Boolean}
 */
export const isArray = (subject) => array.isArray(subject);


/**
 * 
 * @param {Iterable} arrayLike - An iterable or array-like object to convert to an array.
 * @returns 
 */
export const toArray = (arrayLike) => array.from(arrayLike);
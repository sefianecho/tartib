/**
 * Iterate in an object, stop and return false if callback function returns true.
 *
 * @param {Object} object - Any object.
 * @param {CallableFunction} fn - Any Callback function.
 * @returns {Boolean}
 */
export const objectIterator = (object, fn) => {
    for (const key in object) {
        if (Object.hasOwnProperty.call(object, key)) {
            fn(object[key], key, object);
        }
    }
}
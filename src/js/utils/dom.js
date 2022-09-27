import { INSERT_AFTER, INSERT_BEFORE, ROOT } from "../constants";
import { isString } from "./util";

/**
 * Gets a DOM element.
 *
 * @param {String|Element} ref - CSS selector or DOM element.
 * @param {Element} context - Element to search from.
 * @param {Boolean} all - Get all elements.
 * @returns {Element|null}
 */
export const getElement = (ref, context, all) => isString(ref) ? ref && (context || ROOT)['querySelector' + (all ? 'All' : '')](ref)
                                : ref instanceof Element ? ref
                                : null;


/**
 * Gets element bounds.
 *
 * @param {HTMLElement} el Element.
 * @returns {Object}
 */
export const getBounds = (el) => el && el.getBoundingClientRect();


/**
 * Inserts an element.
 *
 * @param {String} position - Where to insert the element.
 * @param {Element} reference - Insert element before or after this element. 
 * @param {Element} element - Element to insert. 
 */
export const insertElement = (position, reference, element) => {
    let sibling = {
        [INSERT_BEFORE]: 'previous',
        [INSERT_AFTER]: 'next'
    }

    // Check if the element is not already exist.
    if (reference[sibling[position] + 'ElementSibling'] !== element) {
        reference.insertAdjacentElement(position, element);
    }
}
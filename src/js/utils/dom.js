import { BODY, HTML, INSERT_AFTER, INSERT_BEFORE, ROOT } from "../constants";
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

/**
 * Gets an element's parent.
 *
 * @param {Element} el - Any html element.
 * @returns {Element}
 */
export const getParent = el => el.parentElement;


/**
 * Gets scrollable ancestors elements.
 *
 * @param {Element} el - Element to get its scrollable ancestors.
 * @returns {Array}
 */
export const getScrollableAncestors = (el) => {
    let scrollableAncestors = [];
    let elHeight = el.scrollHeight;
    let elWidth = el.scrollWidth;

    while (el !== null) {
        let overflow = getComputedStyle(el).overflow;
        let { width, height } = getBounds(el);
        let isRoot = el === HTML;

        if (isRoot) {
            height = HTML.clientHeight;
        }

        if (
            (overflow === 'auto' || overflow === 'scroll' || (isRoot && overflow === 'visible'))
            &&
            (height < elHeight || width < elWidth)
            &&
            el !== BODY
        ) {
            scrollableAncestors.push(el);
        }

        el = getParent(el);
    }

    return scrollableAncestors;
}
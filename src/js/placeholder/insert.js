import { INSERT_AFTER, INSERT_BEFORE } from "../constants";

/**
 * Inserts a placeholder element into the list.
 *
 * @param {String} where - Where to insert the element.
 * @param {Element} reference - Insert placeholder element before or after this element. 
 * @param {Element} element - Element to insert. 
 */
export const insertPlaceholder = (where, reference, placeholder) => {
    let sibling = {
        [INSERT_BEFORE]: 'previous',
        [INSERT_AFTER]: 'next'
    }

    // Check if the element is not already exist.
    if (reference[sibling[where] + 'ElementSibling'] !== placeholder) {
        reference.insertAdjacentElement(where, placeholder);
    }
}
import { ITEM_SELECTOR, PLACEHOLDER_CLASSNAME } from "../utils/classes";
import { getElement } from "../utils/dom";

/**
 * Sortable list.
 *
 * @param {Element} el - Sortable List element.
 * @returns {Object}
 */
export const List = el => ({

    /**
     * Gets List item.
     *
     * @param {Element} target - Event Target.
     * @returns {Element|null}
     */
    _getItem: target => target.closest(ITEM_SELECTOR),

    /**
     * Gets sortable list items.
     *
     * @param {Element} list - Sortabale list.
     * @returns {Array<Element>}
     */
    _getItems() {
         let nodeList = getElement(ITEM_SELECTOR, el, true);
         let items = [];
         let length = nodeList.length;

         for (let i = 0; i < length; i++) {
             const element = nodeList[i];
             // Exclude placeholder item.
             if (! element.classList.contains(PLACEHOLDER_CLASSNAME)) {
                 items.push(element);
             }
         }
         return items;
     }

})
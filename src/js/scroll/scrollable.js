import { BODY, HTML } from "../constants";
import { getBounds, getParent } from "../utils/dom";

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
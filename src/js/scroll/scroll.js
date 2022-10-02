import { METHODS } from "../constants";

/**
 * Scrolls ancestors that hides parts of the sortable list.
 *
 * @param {Element} el - Scrollable element.
 * @param {Object} elBounds - Scrollable element bounding rect.
 * @param {Object} itemBounds - Item's bounding rect.
 * @param {Boolean} isVertical - Indicates whether to scroll Vertically or horizontally.
 */
export const scroll = (el, elBounds, itemBounds, axis) => {

    let { _lowerBound, _upperBound, _scrollProperty, _scrollDimension, _dimension } = METHODS[axis];
    let scrollTowards;

    // Scroll up or left.
    if (itemBounds[_lowerBound] < elBounds[_lowerBound] && el[_scrollProperty] > 0) {
        scrollTowards = _lowerBound;
    } else if (
                itemBounds[_upperBound] > elBounds[_upperBound] &&
                (el[_scrollProperty] < el[_scrollDimension] - elBounds[_dimension])
            ) {
        scrollTowards = _upperBound;
    }

    if (scrollTowards) {
        el[_scrollProperty] += itemBounds[scrollTowards] - elBounds[scrollTowards];
    }
}
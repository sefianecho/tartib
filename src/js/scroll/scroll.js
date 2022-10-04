import { abs, METHODS } from "../constants";

/**
 * Scrolls ancestors that hides parts of the sortable list.
 *
 * @param {Element} el - Scrollable element.
 * @param {Object} elBounds - Scrollable element bounding rect.
 * @param {Object} itemBounds - Item's bounding rect.
 * @param {Boolean} isVertical - Indicates whether to scroll Vertically or horizontally.
 * @param {Boolean} isRTL - Indicates whether the list is in RTL direction.
 */
export const scroll = (el, elBounds, itemBounds, axis, isRTL) => {

    /**
     * All these variables are property names (methods), depending on the axis.
     */
    let { _lowerBound, _upperBound, _scrollProperty, _scrollDimension, _dimension } = METHODS[axis];

    /**
     * Scroll direction (top | right | bottom | left).
     * @type {String}
     */
    let scrollTowards;
    let scrollAmount = abs(el[_scrollProperty]);
    let isScrolled = scrollAmount > 0;
    let isFullScrolled = scrollAmount < el[_scrollDimension] - elBounds[_dimension];

    // Scroll up or left.
    if (( isRTL ? isFullScrolled : isScrolled) && itemBounds[_lowerBound] < elBounds[_lowerBound]) {
        scrollTowards = _lowerBound;
        // Scroll bottom or right.
    } else if ((isRTL ? isScrolled : isFullScrolled) && itemBounds[_upperBound] > elBounds[_upperBound]) {
        scrollTowards = _upperBound;
    }

    if (scrollTowards) {
        el[_scrollProperty] += itemBounds[scrollTowards] - elBounds[scrollTowards];
    }
}
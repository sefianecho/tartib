/**
 * Scrolls ancestors that hides parts of the sortable list.
 *
 * @param {Element} el - Scrollable element.
 * @param {Object} elBounds - Scrollable element bounding rect.
 * @param {Object} itemBounds - Item's bounding rect.
 * @param {Boolean} isVertical - Indicates whether to scroll Vertically or horizontally.
 */
export const autoScroll = (el, elBounds, itemBounds, isVertical) => {

    let scrollProperty = 'scroll';
    // scrollHeight or scrollWidth.
    let scrollDimension = scrollProperty;
    // width or height.
    let dimension;
    // top or left.
    let lowerBound;
    // bottom or right.
    let upperBound;
    let scrollBound;

    if (isVertical) {
        scrollProperty += 'Top';
		scrollDimension += 'Height';
		dimension = 'height';
		lowerBound = 'top';
		upperBound = 'bottom';
    } else {
        scrollProperty += 'Left';
		scrollDimension += 'Width';
		dimension = 'width';
		lowerBound = 'left';
		upperBound = 'right';
    }

    // Scroll up or left.
    if (itemBounds[lowerBound] < elBounds[lowerBound] && el[scrollProperty] > 0) {
        scrollBound = lowerBound;
    } else if (itemBounds[upperBound] > elBounds[upperBound] && (el[scrollProperty] < el[scrollDimension] - elBounds[dimension])) {
        scrollBound = upperBound;
    }

    if (scrollBound) {
        el[scrollProperty] += itemBounds[scrollBound] - elBounds[scrollBound];
    }
}
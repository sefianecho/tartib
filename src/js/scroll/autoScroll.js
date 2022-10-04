import { HTML } from "../constants";
import { getBounds } from "../utils/dom";
import { scroll } from "./scroll";

/**
 * Auto scrolls parent scrollables that hide part of the list, when dragging
 * a list item.
 *
 * @param {Array} scrollables - Scrollable elements.
 * @param {DOMRect} itemBounds - List item bounding rect.
 * @param {Boolean} isRTL - Indicates if the list is in RTL direction.
 */
export const autoScroll  = (scrollables, itemBounds, isRTL) => {
    scrollables.forEach(scrollable => {
        let bounds = getBounds(scrollable);

        if (scrollable === HTML) {
            let domHeight = HTML.clientHeight;
            let width = bounds.width;

            bounds = {
                top: 0,
                left: 0,
                right: width,
                bottom: domHeight,
                height: domHeight,
                width
            }
        }

        // Scroll for each axis.
        scroll(scrollable, bounds, itemBounds, 'x', isRTL);
        scroll(scrollable, bounds, itemBounds, 'y', false);
    });
}


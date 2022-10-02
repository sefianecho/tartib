import { HTML } from "../constants";
import { getBounds } from "../utils/dom";
import { scroll } from "./scroll";

export const autoScroll  = (scrollables, itemBounds) => {

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

        // Auto Scroll Vertically.
            scroll(scrollable, bounds, itemBounds, true);
        // Auto Scroll Horizontally.
            scroll(scrollable, bounds, itemBounds, false);
    });
}


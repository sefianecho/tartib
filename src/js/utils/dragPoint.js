import { METHODS } from "../constants";
import { getBounds } from "./dom";
import { isObject, objectIterator } from "./object";
import { isString } from "./util";


/**
 * Gets drag from point.
 *
 * @param {Element} item    - Dragged item.
 * @param {Ojbect} dragFrom - Pointer position relative to the dragged item.
 * @param {Object} pointer    - Pointer position.
 * @param {Element} handle - Drag handle.
 * @param {Boolean} isRTL - Whether Scrollable is in rtl direction.
 * @returns {Object}
 */
export const getDragPoint = (item, dragFrom, pointer, handle, isRTL) => {
    dragFrom = isObject(dragFrom) ? dragFrom : {};

    let bounds = getBounds(handle || item);
    let itemBounds = handle ? getBounds(item) : bounds;
    let point = {};
    let dragVal;

    objectIterator(pointer, (val, axis) => {
        dragVal = dragFrom[axis];

        if (dragVal === '' || isNaN(dragVal)) {
            // If it's a percentage.
            if (isString(dragVal) && /^\d*.?\d+\s*%$/.test(dragVal.trim())) {
                dragVal = parseFloat(dragVal) * bounds[METHODS[axis]._dimension] / 100;
            } else {
                // Invalid value.
                dragVal = null;
            }
        } else {
            // Number or a String number, convert it to number.
            dragVal *= 1;
        }


        if (dragVal != null) {

            if (isRTL && axis === 'x') {
                dragVal = bounds.width - dragVal;
            }

            dragVal += bounds[axis];
        } else {
            dragVal = val;
        }

        point[axis] = dragVal - itemBounds[axis];
    });

    return point;
}
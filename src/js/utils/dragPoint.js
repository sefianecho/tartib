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
            if (isString(dragVal) && /^\d*.?\d+\s*%$/.test(dragVal.trim())) {
                dragVal = parseFloat(dragVal) * bounds[METHODS[axis]._dimension] / 100;
            } else {
                dragVal = null;
            }
        } else {
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
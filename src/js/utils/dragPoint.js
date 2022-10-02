import { getBounds } from "./dom";
import { objectIterator } from "./object";
import { isString } from "./util";


/**
 * Gets drag from point.
 *
 * @param {Element} item    - Dragged item.
 * @param {Ojbect} dragFrom - Pointer position relative to the dragged item.
 * @param {Object} mouse    - Mouse position.
 * @returns {Object}
 */
export const getDragPoint = (item, dragFrom, mouse) => {

    dragFrom = dragFrom || { x: '', y: '' };

    let bounds = getBounds(item);
    let percentage;
    let point = {}

    objectIterator(dragFrom, (val, key) => {

        if (val === '' || isNaN(val)) {
            percentage = isString(val) && val.trim().match(/^(\d*.?\d+)\s*%$/);
            if (percentage) {
                val = percentage[1] * (key === 'x' ? bounds.width : bounds.height) / 100;
            } else {
                val = mouse[key] - bounds[key];
            }
        }

        point[key] = val * 1;
    });

    return point;
}
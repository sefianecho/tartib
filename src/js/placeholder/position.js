import { INSERT_AFTER, INSERT_BEFORE, METHODS } from "../constants";

/**
 * Gets placeholder's next position.
 *
 * @param {Object} targetBounds        - Target element bounding rect object.
 * @param {Number} mouseStart          - Mouse starting position.
 * @param {Number} mousePosition       - Mouse position.
 * @param {Boolean} isVertical         - Indicate whether the sorting is vertically or horizontally.
 * @param {String|undefined} placeholderPosition - Used for the diagonal positionning, the position of the placeholder in the other axis.
 * @returns {String}
 */
export const getPlaceholderPosition = (targetBounds, mouseStart, mousePosition, axis, isRTL, placeholderPosition) => {

    isRTL = axis === 'x' && isRTL;

    let position;
    let methods = METHODS[axis];

    // This indicates whether the mouse intersected the,
    // next element half (50% of its dimension) width or height.
    let nextElMouseIntersection = mousePosition > targetBounds[axis] + targetBounds[methods._dimension] * 0.5;
    // Mouse movement, whether if its moving down or to the right.
    let movement = mouseStart[axis] < mousePosition;

    // Mouse is moving down or to the right.
    // Otherwise, mouse is moving up or to the left.
    if (movement) {
        if (nextElMouseIntersection || placeholderPosition) {
            position = isRTL ? INSERT_BEFORE : INSERT_AFTER;
        }
    } else {
        // Mouse intersected the previous element.
        if (! nextElMouseIntersection || placeholderPosition) {
            position = isRTL ? INSERT_AFTER : INSERT_BEFORE;
        }
    }

    return position;
}
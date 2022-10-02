import { INSERT_AFTER, INSERT_BEFORE } from "../constants";

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
export const getPlaceholderPosition = (targetBounds, mouseStart, mousePosition, isVertical, placeholderPosition) => {

    let position;
    let axis;
    let dimension;

    if (isVertical) {
        axis = 'y';
        dimension = 'height';
    } else {
        axis = 'x';
        dimension = 'width';
    }

    // This indicates whether the mouse intersected the,
    // next element half (50% of its dimension) horizontally or vertically.
    let nextElMouseIntersection = mousePosition > targetBounds[axis] + targetBounds[dimension] * 0.5;
    // Mouse movement, whether if its moving down or to the right.
    let movement = mouseStart[axis] < mousePosition;

    // Mouse is moving down or to the right.
    // Otherwise, mouse is moving up or to the left.
    if (movement) {
        if (nextElMouseIntersection || placeholderPosition) {
            position = INSERT_AFTER;
        }
    } else {
        // Mouse intersected the previous element.
        if (! nextElMouseIntersection || placeholderPosition) {
            position = INSERT_BEFORE;
        }
    }

    return position;
}
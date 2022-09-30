import { floor, HTML, INSERT_BEFORE, ROOT } from "./constants";
import { getPlaceholderPosition } from "./position";
import { autoScroll } from "./autoScroll";
import { getBounds, getElement, getParent, getScrollableAncestors, insertElement } from "./utils/dom";
import { getDragPoint } from "./dragPoint";
import { EventBinder } from "./core/events/binder";

export const sort = (tartib) => {

    const { el: list, config } = tartib;

    const listeners = EventBinder();

    let draggedItem;

    let placeholder;

    let scrollableAncestors;

    let startPoint = {}

    let dragPoint = {}

    let startMoving = false;

    let isDragging = false;


    /**
     * Starts dragging.
     *
     * @param {Event} e - Mousedown.
     */
    const dragStart = e => {

        let { dragHandle, dragFrom, disabled, autoScroll } = config;
        let target = e.target;

        draggedItem = target.closest('.tartib__item');

        if (disabled || !draggedItem || (dragHandle && target !== getElement(dragHandle, draggedItem))) {
            return;
        }

        draggedItem.releasePointerCapture(e.pointerId);

        placeholder = draggedItem.cloneNode();

        startPoint = {
            x: e.clientX,
            y: e.clientY
        }

        dragPoint = getDragPoint(dragHandle ? target : draggedItem, dragFrom, startPoint);
        scrollableAncestors = autoScroll ? getScrollableAncestors(list) : [];

        isDragging = true;
    }

    /**
     * Drags item.
     *
     * @param {Event} e - Mousemove.
     */
    const dragMove = e => {
        if (isDragging) {
            let { target, clientX: mouseX, clientY: mouseY } = e;
            let itemBounds;

            if (! startMoving) {
                let { cursor, elevation, placeholder: placeholderClassname, opacity } = config;

                itemBounds = getBounds(draggedItem);
                setItemPosition(mouseX, mouseY);

                draggedItem.classList.add('tartib__item--dragged');
                draggedItem.style.width = itemBounds.width + 'px';
                draggedItem.style.height = itemBounds.height + 'px';

                if (cursor) {
                    HTML.style.cursor = cursor;
                }

                if (elevation) {
                    draggedItem.classList.add('tartib--elevation');
                }

                if (opacity > 0 && opacity < 1) {
                    draggedItem.style.opacity = opacity;
                }

                placeholder.classList.add(placeholderClassname || 'tartib__placeholder');

                insertElement(INSERT_BEFORE, draggedItem, placeholder);

                placeholder.style.height = itemBounds.height + 'px';
                startMoving = true;
            }
            // Move Item.
            itemBounds = getBounds(draggedItem);
            setItemPosition(mouseX, mouseY, config.axis);

            /**
             * Scroll to view where to drop.
             */
            scrollableAncestors.forEach(scrollable => {
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
                    autoScroll(scrollable, bounds, itemBounds, true);
                // Auto Scroll Horizontally.
                    autoScroll(scrollable, bounds, itemBounds, false);
            });

            /**
             * Sort items.
             * 
             */
            target = target.closest('.tartib__item');

            if (target && list.contains(target) && target !== placeholder) {
                let targetBounds = getBounds(target);
                let { top, right, bottom, left } = getBounds(placeholder);
                let movingVertically = mouseX <= floor(right) && mouseX >= floor(left);
                let movingHorizontally = mouseY <= floor(bottom) && mouseY >= floor(top);
                let position;

                // Sorting item diagonally.
                if (! movingHorizontally && ! movingVertically) {
                    // Get position horizontally, pass it to the vertical position.
                    position = getPlaceholderPosition(targetBounds, startPoint, mouseY, true, getPlaceholderPosition(targetBounds, startPoint, mouseX));
                } else {
                    // Sorting item vertically.
                    if (! movingHorizontally) {
                        position = getPlaceholderPosition(targetBounds, startPoint, mouseY, true);
                    }

                    // Sorting item horizontally.
                    if (! movingVertically) {
                        position = getPlaceholderPosition(targetBounds, startPoint, mouseX);
                    }
                }

                if (position) {
                    insertElement(position, target, placeholder);
                    startPoint.y = mouseY;
                    startPoint.x = mouseX;
                }
            }
        }
    }

    /**
     * Ends drag.
     *
     * @param {Event} e - Mouseup.
     */
    const dragEnd = e => {
        if (isDragging) {
            draggedItem.style = '';
            draggedItem.classList.remove('tartib__item--dragged', 'tartib--elevation');
            if (getParent(placeholder) === list) {
                list.replaceChild(draggedItem, placeholder);
                placeholder = null;
            }
            HTML.style.cursor = '';
            isDragging = startMoving = false;
        }
    }

    /**
     * Sets item position.
     *
     * @param {Number} x - Mouse X coordinate.
     * @param {Number} y - Mouse Y coordinate.
     * @param {Object} axis - Axis option.
     */
    const setItemPosition = (x, y, axis) => {
        if (axis !== 'x') {
            draggedItem.style.top = y - dragPoint.y + 'px';
        }

        if (axis !== 'y') {
            draggedItem.style.left = x - dragPoint.x + 'px';
        }
    }

    listeners._add(list, 'pointerdown', dragStart);
    listeners._add(ROOT, 'pointermove', dragMove);
    listeners._add(ROOT, 'pointerup', dragEnd);
}
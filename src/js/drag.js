import { floor, HTML, INSERT_BEFORE, ROOT } from "./constants";
import { getPlaceholderPosition } from "./position";
import { autoScroll } from "./autoScroll";
import { getBounds, getParent, getScrollableAncestors, insertElement } from "./utils/dom";
import { getDragPoint } from "./dragPoint";

export const sort = (tartib) => {

    const list = tartib.el;

    let draggedItem;

    let placeholder;

    let draggedItemRect;

    let scrollableAncestors;

    let startX;

    let startY;

    let dragPoint = {}

    let startMoving = false;

    let isDragging = false;


    /**
     * Starts dragging.
     *
     * @param {Event} e - Mousedown.
     */
    const dragStart = e => {
        draggedItem = e.target.closest('.tartib__item');

        if (draggedItem) {

            draggedItem.releasePointerCapture(e.pointerId);

            placeholder = draggedItem.cloneNode();
            

            draggedItemRect = getBounds(draggedItem);
            startX = e.clientX;
            startY = e.clientY;

            dragPoint = getDragPoint(draggedItem, tartib.config.dragFrom, { x: startX, y: startY });

            scrollableAncestors = getScrollableAncestors(list);

            isDragging = true;
        }
    }

    /**
     * Drags item.
     *
     * @param {Event} e - Mousemove.
     */
    const dragMove = e => {
        if (isDragging) {
            let { target, clientX: mouseX, clientY: mouseY } = e;

            if (! startMoving) {

                let { cursor, elevation, placeholder: placeholderClassname } = tartib.config;


                draggedItem.classList.add('tartib__item--dragged');
                draggedItem.style.width = draggedItemRect.width + 'px';
                draggedItem.style.height = draggedItemRect.height + 'px';

                if (cursor) {
                    HTML.style.cursor = cursor;
                }

                if (elevation) {
                    draggedItem.classList.add('tartib--elevation');
                }

                placeholder.classList.add(placeholderClassname || 'tartib__placeholder');

                insertElement(INSERT_BEFORE, draggedItem, placeholder);

                placeholder.style.height = draggedItemRect.height + 'px';
                startMoving = true;
            }

            // Move Item.
            draggedItem.style.top = mouseY - dragPoint.y + 'px';
            draggedItem.style.left = mouseX - dragPoint.x + 'px';

            let itemBounds = getBounds(draggedItem);
            let { top, right, bottom, left } = getBounds(placeholder);
            let isSortingY = mouseX <= floor(right) && mouseX >= floor(left);
            let isSortingX = mouseY <= floor(bottom) && mouseY >= floor(top);

            /**
             * Scroll to view where to drop.
             */
            scrollableAncestors.forEach(scrollable => {
                let bounds = getBounds(scrollable);

                if (scrollable === HTML) {
                    let domHeight = HTML.clientHeight;

                    bounds = {
                        top: 0,
                        left: 0,
                        right: bounds.width,
                        width: bounds.width,
                        bottom: domHeight,
                        height: domHeight
                    }
                }

                // Auto Scroll Vertically.
                if (isSortingY) {
                    autoScroll(scrollable, bounds, itemBounds, true);
                }

                // Auto Scroll Horizontally.
                if (isSortingX) {
                    autoScroll(scrollable, bounds, itemBounds, false);
                }
            });

            /**
             * Sort items.
             */
            if (target.closest('.tartib__item') && target !== placeholder) {
                let targetBounds = getBounds(target);
                let position;

                // Sorting item diagonally.
                if (! isSortingX && ! isSortingY) {
                    // Get position horizontally, pass it to the vertical position.
                    position = getPlaceholderPosition(targetBounds, startY, mouseY, true, getPlaceholderPosition(targetBounds, startX, mouseX));
                } else {
                    // Sorting item vertically.
                    if (! isSortingX) {
                        position = getPlaceholderPosition(targetBounds, startY, mouseY, true);
                    }

                    // Sorting item horizontally.
                    if (! isSortingY) {
                        position = getPlaceholderPosition(targetBounds, startX, mouseX);
                    }
                }

                if (position) {
                    insertElement(position, target, placeholder);
                    startY = mouseY;
                    startX = mouseX;
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


    list.addEventListener('pointerdown', dragStart);
    ROOT.addEventListener('pointermove', dragMove);
    ROOT.addEventListener('pointerup', dragEnd);
}
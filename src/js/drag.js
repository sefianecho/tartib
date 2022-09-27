import { floor, INSERT_BEFORE, ROOT } from "./constants";
import { getPlaceholderPosition } from "./position";
import { getBounds, insertElement } from "./utils/dom";

export const sort = (instance) => {

    const list = instance.el;

    let draggedItem;

    let placeholder;

    let draggedItemRect;

    let startX;

    let startY;

    let cursorX;

    let cursorY;

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
            placeholder = draggedItem.cloneNode();
            placeholder.classList.add('tartib__placeholder');

            draggedItemRect = getBounds(draggedItem);
            startX = e.clientX;
            startY = e.clientY;

            cursorX = startX - draggedItemRect.left;
            cursorY = startY - draggedItemRect.top;

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
            let target = e.target;
            let mouseX = e.clientX;
            let mouseY = e.clientY;

            if (! startMoving) {
                draggedItem.classList.add('tartib__item--dragged');
                draggedItem.style.width = draggedItemRect.width + 'px';
                draggedItem.style.height = draggedItemRect.height + 'px';
                placeholder.style.height = draggedItemRect.height + 'px';
                // placeholder.style.width = draggedItemRect.width + 'px';

                insertElement(INSERT_BEFORE, draggedItem, placeholder);
                startMoving = true;
            }


            let { top, right, bottom, left } = getBounds(placeholder);
            let isSortingY = mouseX <= floor(right) && mouseX >= floor(left);
            let isSortingX = mouseY <= floor(bottom) && mouseY >= floor(top);

            // Move Item.
            draggedItem.style.top = mouseY - cursorY + 'px';
            draggedItem.style.left = mouseX - cursorX + 'px';

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
            draggedItem.classList.remove('tartib__item--dragged');
            if (placeholder.parentElement === list) {
                list.replaceChild(draggedItem, placeholder);
            }
            isDragging = startMoving = false;
        }
    }


    list.addEventListener('mousedown', dragStart);
    ROOT.addEventListener('mousemove', dragMove);
    ROOT.addEventListener('mouseup', dragEnd);
}
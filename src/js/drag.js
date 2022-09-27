import { INSERT_BEFORE, ROOT } from "./constants";
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
            let mouseX = e.clientX;
            let mouseY = e.clientY;

            if (! startMoving) {
                draggedItem.classList.add('tartib__item--dragged');
                draggedItem.style.width = draggedItemRect.width + 'px';
                draggedItem.style.height = draggedItemRect.height + 'px';

                insertElement(INSERT_BEFORE, draggedItem, placeholder);

                placeholder.style.height = draggedItemRect.height + 'px';
                placeholder.style.width = draggedItemRect.width + 'px';

                startMoving = true;
            }

            // Move Item.
            draggedItem.style.top = mouseY - cursorY + 'px';
            draggedItem.style.left = mouseX - cursorX + 'px';


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
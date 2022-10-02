import { CHANGE_EVENT, ELEVATION_CLASSNAME, END_EVENT, floor, HTML, INSERT_BEFORE, ITEM_DRAGGED_CLASSNAME, ITEM_SELECTOR, PLACEHOLDER_CLASSNAME, ROOT, SORT_EVENT, START_EVENT } from "./constants";
import { getPlaceholderPosition } from "./position";
import { autoScroll } from "./autoScroll";
import { classList, getBounds, getElement, getItem, getParent, getScrollableAncestors, inlineStyles, insertElement } from "./utils/dom";
import { getDragPoint } from "./dragPoint";
import { EventBinder } from "./core/events/binder";
import { toArray } from "./utils/array";

export const sort = (tartib) => {

    const { el: list, config, _e: { _emit } } = tartib;

    const listeners = EventBinder();

    let draggedItem;

    let placeholder;

    let scrollableAncestors;

    let itemClassList;

    let itemBounds;

    let startList;

    let startPoint = {}

    let dragPoint = {}

    let eventObject;

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

        draggedItem = getItem(target);

        if (disabled || !draggedItem || (dragHandle && target !== getElement(dragHandle, draggedItem))) {
            return;
        }

        draggedItem.releasePointerCapture(e.pointerId);
        placeholder = draggedItem.cloneNode();
        startList = toArray(getElement(ITEM_SELECTOR, list, true));

        itemClassList = classList(draggedItem);

        startPoint = {
            x: e.clientX,
            y: e.clientY
        }

        eventObject = {
            target: draggedItem,
            relatedTarget: null,
            placeholder,
            el: list,
            items: startList
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

            if (! startMoving) {

                setItemPosition(mouseX, mouseY);

                let { cursor, elevation, placeholder: placeholderClassname, opacity, active } = config;
                let { width, height, x, y } = getBounds(draggedItem);

                height += 'px';
                width += 'px';

                inlineStyles(draggedItem, {
                    width,
                    height,
                    opacity: opacity > 0 && opacity < 1 ? opacity : false,
                });
                inlineStyles(HTML, { cursor });
                inlineStyles(placeholder, { height });

                _emit(START_EVENT, eventObject, { x, y });

                itemClassList._add([ITEM_DRAGGED_CLASSNAME, elevation && ELEVATION_CLASSNAME, active]);

                classList(placeholder)._add(placeholderClassname || PLACEHOLDER_CLASSNAME);
                insertElement(INSERT_BEFORE, draggedItem, placeholder);
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
            target = getItem(target);

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

                    _emit(SORT_EVENT, eventObject, { 
                        relatedTarget: target,
                        x: itemBounds.x,
                        y: itemBounds.y,
                    });
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

            if (getParent(placeholder) === list) {
                list.replaceChild(draggedItem, placeholder);
                placeholder = null;
            }

            let endList = toArray(getElement(ITEM_SELECTOR, list, true));
            let data = {
                placeholder,
                x: itemBounds.x,
                y: itemBounds.y,
                items: endList
            }

            inlineStyles(draggedItem);
            inlineStyles(HTML, { cursor: '' });

            itemClassList._remove([ITEM_DRAGGED_CLASSNAME, ELEVATION_CLASSNAME, config.active]);

            if (startList.some((item, index) => item !== endList[index])) {
                _emit(CHANGE_EVENT, eventObject, data);
            }

            if (startMoving) {
                _emit(END_EVENT, eventObject, data);
            }

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
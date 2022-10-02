import { ELEVATION_CLASSNAME, ITEM_DRAGGED_CLASSNAME, PLACEHOLDER_CLASSNAME } from "../utils/classes";
import { getPlaceholderPosition } from "../placeholder/position";
import { autoScroll } from "../scroll/autoScroll";
import { classList, getBounds, getElement, getItem, getItems, getParent, inlineStyles } from "../utils/dom";
import { getDragPoint } from "../utils/dragPoint";
import { EventBinder } from "./events/binder";
import { getScrollableAncestors } from "../scroll/scrollable";
import { insertPlaceholder } from "../placeholder/insert";
import { CHANGE_EVENT, END_EVENT, HTML, INSERT_BEFORE, MOVE_EVENT, ROOT, SORT_EVENT, START_EVENT } from "../constants";

/**
 * Sorts a list by dragging its items.
 *
 * @param {Tartib} tartib - Instance.
 */
export const sortable = (tartib) => {

    const { el: list, config, _e: { _emit } } = tartib;

    const floor = Math.floor;

    /**
     * Event binder methods.
     */
    const { _bind, _clear } = EventBinder();

    /**
     * Dragged List Item.
     *
     * @type {Element}
     */
    let draggedItem;

    /**
     * Placeholder Item.
     *
     * @type {Element}
     */
    let placeholder;

    /**
     * List scrollable ancestors elements.
     *
     * @type {Array<Element>}
     */
    let scrollableAncestors;

    /**
     * Dragged Item classList.
     *
     * @type {Object}
     */
    let itemClassList;

    /**
     * Dragged Item Bounding rect.
     *
     * @type {DOMRect}
     */
    let itemBounds;

    /**
     * Array of list items.
     *
     * @type {Array<Element>}
     */
    let startList;

    /**
     * Start pointer coordinates.
     *
     * @type {Object} 
     */
    let startPoint = {}

    /**
     * Drag at coordinates.
     *
     * @type {Object}
     */
    let dragPoint = {}

    /**
     * Event Object Data.
     *
     * @type {Object}
     */
    let eventObject;

    /**
     * Indicates whether a dragged item start moving.
     */
    let startMoving = false;

    /**
     * Indicates whether an item is dragged.
     */
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

        /**
         * Exit, if disabled or pointer down wasn't in a list item,
         * or in a drag handle.
         */
        if (disabled || !draggedItem || (dragHandle && target !== getElement(dragHandle, draggedItem))) {
            return;
        }

        target.releasePointerCapture(e.pointerId);
        placeholder = draggedItem.cloneNode();
        placeholder.id = '';
        startList = getItems(list);

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
            items: startList,
            getData(attribute) {
                return _getAttributeMap(attribute, this.items);
            }
        }

        dragPoint = getDragPoint(dragHandle ? target : draggedItem, dragFrom, startPoint);
        scrollableAncestors = autoScroll ? getScrollableAncestors(list) : [];
        isDragging = true;
    }

    /**
     * moves an item.
     *
     * @param {Event} e - Mousemove.
     */
    const dragMove = e => {
        if (isDragging) {
            let { target: relatedTarget, clientX: mouseX, clientY: mouseY } = e;
            let data;

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
                insertPlaceholder(INSERT_BEFORE, draggedItem, placeholder);
                startMoving = true;
            }
            // Move Item.
            itemBounds = getBounds(draggedItem);
            setItemPosition(mouseX, mouseY, config.axis);

            data = {
                x: itemBounds.x,
                y: itemBounds.y
            }

            /**
             * Fire move event.
             */
            _emit(MOVE_EVENT, eventObject, data, { relatedTarget });

            /**
             * Scroll to view where to drop.
             */
            autoScroll(scrollableAncestors, itemBounds);

            relatedTarget = getItem(relatedTarget);

            if (list.contains(relatedTarget) && relatedTarget !== placeholder) {
                let bounds = getBounds(relatedTarget);
                let { top, right, bottom, left } = getBounds(placeholder);
                let movingVertically = mouseX <= floor(right) && mouseX >= floor(left);
                let movingHorizontally = mouseY <= floor(bottom) && mouseY >= floor(top);
                let position;

                // Sorting item diagonally.
                if (! movingHorizontally && ! movingVertically) {
                    // Get position horizontally, pass it to the vertical position.
                    position = getPlaceholderPosition(bounds, startPoint, mouseY, 'y', getPlaceholderPosition(bounds, startPoint, mouseX, 'x'));
                } else {
                    // Sorting item vertically.
                    if (! movingHorizontally) {
                        position = getPlaceholderPosition(bounds, startPoint, mouseY, 'y');
                    }

                    // Sorting item horizontally.
                    if (! movingVertically) {
                        position = getPlaceholderPosition(bounds, startPoint, mouseX, 'x');
                    }
                }

                if (position) {
                    insertPlaceholder(position, relatedTarget, placeholder);
                    startPoint.y = mouseY;
                    startPoint.x = mouseX;

                    /**
                     * Fire sort event.
                     */
                    _emit(SORT_EVENT, eventObject, data, { 
                        relatedTarget,
                        items: getItems(list),
                    });
                }
            }
        }
    }

    /**
     * Ends dragging.
     *
     * @param {Event} e - Mouseup.
     */
    const dragEnd = e => {
        if (isDragging) {

            if (getParent(placeholder) === list) {
                list.replaceChild(draggedItem, placeholder);
                placeholder = null;
            }

            let endList = getItems(list);
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
                /**
                 * Fire change event.
                 */
                _emit(CHANGE_EVENT, eventObject, data);
            }

            if (startMoving) {
                /**
                 * Fire end event.
                 */
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


    /**
     * Gets an array, each value is an attribute value of a list item.
     *
     * @param {String} attribute - Element attribute name.
     * @param {Array<Element>} items - Sortable list items.
     * @returns {Array}
     */
    const _getAttributeMap = (attribute, items) => items.map(item => item.getAttribute(attribute || 'id'));

    /**
     * Events.
     */
    _bind(list, 'pointerdown', dragStart);
    _bind(ROOT, 'pointermove', dragMove);
    _bind(ROOT, 'pointerup', dragEnd);

    return {
        _clear,
        _getAttributeMap
    }
}
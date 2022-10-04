import { ELEVATION_CLASSNAME, ITEM_DRAGGED_CLASSNAME, PLACEHOLDER_CLASSNAME } from "../utils/classes";
import { getPlaceholderPosition } from "../placeholder/position";
import { autoScroll } from "../scroll/autoScroll";
import { classList, getBounds, getElement, getParent, inlineStyles } from "../utils/dom";
import { getDragPoint } from "../utils/dragPoint";
import { EventBinder } from "./events/binder";
import { getScrollableAncestors } from "../scroll/scrollable";
import { insertPlaceholder } from "../placeholder/insert";
import { CHANGE_EVENT, END_EVENT, floor, HTML, INSERT_BEFORE, MOVE_EVENT, ROOT, SORT_EVENT, START_EVENT } from "../constants";
import { List } from "./list";

/**
 * Sorts a list by dragging its items.
 *
 * @param {Tartib} tartib - Instance.
 */
export const sortable = (tartib) => {

    const { el, config, _e: { _emit } } = tartib;

    /**
     * List.
     */
    const { _getItem, _getItems } = List(el);

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
     * Right To Left Direction.
     */
    let isRTL;

    /**
     * Lock movement to one axis.
     *
     * @type {Object}
     */
    let axisLock;

    /**
     * Starts dragging.
     *
     * @param {Event} e - Mousedown.
     */
    const dragStart = e => {

        let { dragHandle, dragFrom, disabled, autoScroll, rtl, axis } = config;
        let { target, pointerId, clientX, clientY } = e;

        
        draggedItem = _getItem(target);

        /**
         * Exit, if disabled or pointer down wasn't in a list item,
         * or in a drag handle.
         */
        if (disabled || !draggedItem || (dragHandle && target !== getElement(dragHandle, draggedItem))) {
            return;
        }

        isRTL = rtl;
        axisLock = {
            x: axis !== 'y',
            y: axis !== 'x'
        }

        target.releasePointerCapture(pointerId);
        placeholder = draggedItem.cloneNode();
        placeholder.id = '';
        startList = _getItems();

        itemClassList = classList(draggedItem);

        startPoint = {
            x: clientX,
            y: clientY
        }

        eventObject = {
            el,
            x: 0,
            y: 0,
            target: draggedItem,
            relatedTarget: null,
            placeholder,
            items: startList,
            getData(attribute) {
                return _getAttributeMap(attribute, this.items);
            }
        }

        dragPoint = getDragPoint(draggedItem, dragFrom, startPoint, dragHandle ? target : null, isRTL);
        scrollableAncestors = autoScroll ? getScrollableAncestors(el) : [];
        isDragging = true;
    }

    /**
     * moves an item.
     *
     * @param {Event} e - Mousemove.
     */
    const dragMove = e => {
        if (isDragging) {
            let { target: relatedTarget, clientX, clientY } = e;
            let data;

            if (! startMoving) {
                setItemPosition(startPoint.x, startPoint.y, {});

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

            /**
             * Move item.
             */
            setItemPosition(clientX, clientY, axisLock);

            itemBounds = getBounds(draggedItem);

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
            autoScroll(scrollableAncestors, itemBounds, isRTL);

            relatedTarget = _getItem(relatedTarget);

            if (el.contains(relatedTarget) && relatedTarget !== placeholder) {
                let bounds = getBounds(relatedTarget);
                let { top, right, bottom, left } = getBounds(placeholder);
                let movingVertically = clientX <= floor(right) && clientX >= floor(left) && axisLock.y;
                let movingHorizontally = clientY <= floor(bottom) && clientY >= floor(top) && axisLock.x;
                let position;

                // Sorting item diagonally.
                if (! movingHorizontally && ! movingVertically && (axisLock.x && axisLock.y)) {
                    // Get position horizontally, pass it to the vertical position.
                    position = getPlaceholderPosition(bounds, startPoint, clientX, 'x', isRTL);
                    position = getPlaceholderPosition(bounds, startPoint, clientY, 'y', false, position);
                } else {
                    // Sorting item vertically.
                    if (! movingHorizontally) {
                        position = getPlaceholderPosition(bounds, startPoint, clientY, 'y', false);
                    }

                    // Sorting item horizontally.
                    if (! movingVertically) {
                        position = getPlaceholderPosition(bounds, startPoint, clientX, 'x', isRTL);
                    }
                }

                if (position) {
                    insertPlaceholder(position, relatedTarget, placeholder);
                    startPoint.y = clientY;
                    startPoint.x = clientX;

                    /**
                     * Fire sort event.
                     */
                    _emit(SORT_EVENT, eventObject, data, { 
                        relatedTarget,
                        items: _getItems(),
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

            if (getParent(placeholder) === el) {
                el.replaceChild(draggedItem, placeholder);
                placeholder = null;
            }

            let endList = _getItems();
            let data = {
                placeholder,
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

        if (axis.y) {
            draggedItem.style.top = y - dragPoint.y + 'px';
        }

        if (axis.x) {
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
    _bind(el, 'pointerdown', dragStart);
    _bind(ROOT, 'pointermove', dragMove);
    _bind(ROOT, 'pointerup', dragEnd);

    return {
        _clear,
        _getAttributeMap,
        _getItems
    }
}
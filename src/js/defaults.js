export const defaults = {
    /**
     * Object with x, y properties,
     * drag items from the same position, x and y represent the coordinates,
     * relative to the dragged item's top left corner, x and y can be,
     * numbers or percentages, e.g. { x: '50%' } to center it horizontally.
     *
     * @type {Object}
     */
    dragFrom: {},

    /**
     * Set the cursor while dragging an item (CSS cursor property).
     *
     * @type {String}
     */
    cursor: '',

    /**
     * Adds a box shadow to the dragged item.
     *
     * @type {Boolean}
     */
    elevation: true,

    /**
     * Adds class(es) to the dragged item, theose classes,
     * will be removed when the item is dropped.
     *
     * @type {String}
     */
    active: '',

    /**
     * Add classes to the placeholder (The empty slot).
     *
     * @type {String}
     */
    placeholder: '',

    /**
     * A Selector or an Element, use it as a drag area within the item.
     *
     * @type {String|Element}
     */
    dragHandle: '',

    /**
     * Lock movement to only one axis 'x' or 'y'.
     *
     * @type {String}
     */
    axis: '',

    /**
     * Disable/Enable sorting.
     *
     * @type {Boolean}
     */
    disabled: false,

    /**
     * Apply opacity to the dragged item (during dragging),
     * value must be between 0 and 1 exclusive
     *
     * @type {Number}
     */
    opacity: 1,

    /**
     * Auto scroll while dragging an item, to show out of viewport items.
     *
     * @type {Boolean}
     */
    autoScroll: true,

    /**
     * Right to Left direction.
     *
     * @type {Boolean}
     */
    rtl: false,
}
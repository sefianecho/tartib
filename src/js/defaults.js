export const defaults = {
    /**
     * x, y coordinates relative to the dragged element top left corner.
     * x and y can be numbers or percentages, e.g. '50%'
     *
     * @type {Object}
     */
    dragFrom: {},

    /**
     * Set cursor while dragging an item.
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
     * Adds class(es) to the dragged item. this(those) class(es),
     * will be removed when dragging is done.
     *
     * @type {String}
     */
    active: '',

    /**
     * Adds class(es) to the placeholder.
     *
     * @type {String}
     */
    placeholder: '',

    /**
     * A Selector or an Element to drag the item from.
     *
     * @type {String|Element}
     */
    dragHandle: '',

    /**
     * Lock movement to only one axis 'x' or 'y'.
     *
     * @type {String}
     */
    axis: false,

    /**
     * Disable sorting.
     *
     * @type {Boolean}
     */
    disabled: false,

    /**
     * Sets opacity to the dragged item, value must be between 0 and 1 exclusive.
     *
     * @type {Number}
     */
    opacity: false,

    /**
     * Auto scroll while dragging an item, to show out of viewport items.
     *
     * @type {Boolean}
     */
    autoScroll: true,

    /**
     * Sort right to left for the x axis.
     *
     * @type {Boolean}
     */
    rtl: false,
}
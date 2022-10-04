import '../sass/tartib.scss';
import { EventListener } from './core/events/listener';
import { defaults } from './defaults';
import { sortable } from './core/sortable';
import { merge, objectIterator } from './utils/object';
import { setDisable } from './utils/util';
import { getElement } from './utils/dom';

export default class Tartib {

    /**
     * Tartib version.
     */
    static version = VERSION;

    /**
     * Tartib defaults.
     */
    static defaults = defaults;

    /**
     * Constructor.
     *
     * @param {String|Element} reference - List element or its selector.
     * @param {Object} options - Tartib options.
     */
    constructor(reference, options) {
        const tartib = this;
        tartib.el = getElement(reference);
        tartib.config = merge({}, Tartib.defaults, options);
        tartib._e = EventListener();
        tartib._s = sortable(tartib);
    }

    /**
     * Sets options.
     *
     * @param {Object} options - Tartib new options.
     */
    setOptions(options) {
        merge(this.config, options);
    }

    /**
     * Attaches an event listener.
     *
     * @param {String} type - Event type.
     * @param {CallableFunction} handler - Event handler.
     */
    on(type, handler) {
        this._e._on(type, handler);
    }

    /**
     * Removes an event listener.
     *
     * @param {String} type - Event type.
     * @param {CallableFunction} handler - Event handler.
     */
    off(type, handler) {
        this._e._off(type, handler);
    }

    /**
     * Gets an array of each item's attribute value.
     *
     * @param {String} attribute - Element attribute name.
     * @returns {Array<String>}
     */
    getData(attribute) {
        let sortable = this._s;
        return sortable._getAttributeMap(attribute, sortable._getItems());
    }

    /**
     * Disable sorting.
     */
    disable() {
        setDisable(this, true);
    }

    /**
     * Enable sorting.
     */
    enable() {
        setDisable(this, false);
    }

    /**
     * Removes this instance functionality.
     */
    destroy() {
        const tartib = this;

        tartib._s._clear();
        objectIterator(tartib, (val, prop) => {
            delete tartib[prop];
        });
    }
}
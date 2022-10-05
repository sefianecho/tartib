import { ROOT } from "../constants";
import { objectIterator } from "./object";
import { isString } from "./util";

/**
 * Gets a DOM element.
 *
 * @param {String|Element} ref - CSS selector or DOM element.
 * @param {Element} context - Element to search from.
 * @param {Boolean} all - Get all elements.
 * @returns {NodeList|Element|null}
 */
export const getElement = (ref, context, all) => isString(ref) ? ref && (context || ROOT)['querySelector' + (all ? 'All' : '')](ref)
                                : ref instanceof Element ? ref
                                : null;


/**
 * Gets element bounds.
 *
 * @param {HTMLElement} el Element.
 * @returns {Object}
 */
export const getBounds = (el) => el && el.getBoundingClientRect();

/**
 * Gets an element's parent.
 *
 * @param {Element} el - Any html element.
 * @returns {Element}
 */
export const getParent = el => el.parentElement;

/**
 * Adds inline styles to an element.
 *
 * @param {Element} el - Any Element.
 * @param {Object} styles - Inline styles.
 */
export const inlineStyles = (el, styles) => {

    if (styles) {
        objectIterator(styles, (value, property) => {
            el.style[property] = value;
        });
    } else {
        el.style = null;
    }
}

/**
 * Updates element's classes.
 *
 * @param {Element} el - Any DOM Element.
 * @param {String|Array} classes - Element classes.
 * @param {Boolean} remove - Whether to remove classes.
 */
const updateList = (el, classes, remove) => {

    if (isString(classes)) {
        classes = [classes];
    }

    classes.forEach(classname => {
        isString(classname) && classname.split(/\s+/).forEach(cls => {
            if (cls) {
                el.classList[remove ? 'remove' : 'add'](cls);
            }
        });
    });
}

/**
 * Adds/Removes classes.
 *
 * @param {Element} el - Any DOM Element.
 * @returns {Object}
 */
export const classList = (el) => ({
    /**
     * Adds classes to el classList.
     *
     * @param {Array|String} classes - Classes to add.
     */
    _add(classes) {
        this._classes = classes;
        updateList(el, classes);
    },

    /**
     * Removes all added classes from el classList.
     */
    _remove() {
        updateList(el, this._classes, true);
    }
});
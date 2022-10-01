import { CHANGE_EVENT, END_EVENT, SORT_EVENT, START_EVENT } from "../../constants";
import { merge, objectIterator } from "../../utils/object";

/**
 * Tartib events.
 *
 * @returns {Object}
 */
export const EventListener = () => {

    /**
     * Tartib event handlers.
     */
    const handlers = {
        [START_EVENT]: [],
        [SORT_EVENT]: [],
        [CHANGE_EVENT]: [],
        [END_EVENT]: []
    }

    return {
        /**
         * Emits an event.
         *
         * @param {String} type - Event type.
         * @param  {Element|Object} source - Event Source.
         */
        _emit(type, ...args) {
            handlers[type].forEach(handler => {
                handler(merge({}, { type }, ...args));
            });
        },

        /**
         * Adds an event listener.
         *
         * @param {String} type - Event type.
         * @param {CallableFunction} handler - Event handler.
         */
        _on(type, handler) {
            handlers[type] && handlers[type].push(handler);
        },

        /**
         * Removes event listener(s).
         *
         * @param {String} type - Event type.
         * @param {CallableFunction} handler - Event handler.
         */
        _off(type, handler) {
            let handlersArray = handlers[type];

            if (handlersArray) {
                // Remove the handler if it's specified,
                // Remove all handlers of this event if handler is omitted.
                handlers[type] = handler ? handlersArray.filter(attachedHanlder => attachedHanlder !== handler) : [];
            } else if (type === null) {
                objectIterator(handlers, (arr, type) => {
                    handlers[type] = [];
                });
            }

        }
    }
}
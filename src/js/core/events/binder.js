/**
 * Binds/Unbinds events listeners.
 *
 * @returns {Object}
 */
export const EventBinder = () => {
    const listeners = [];

    /**
     * Binds/Unbinds an event listener.
     *
     * @param {Array} listener - Event listener array.
     * @param {Boolean} unbind - Indicates whether to unbind the listener or not.
     */
    const binder = (listener, unbind) => {
        listener[0][(unbind ? 'remove': 'add') + 'EventListener'](listener[1], listener[2]);
    }

    return {
        /**
         * Registers and Adds an event listener.
         */
        _bind(target, type, handler) {
            let listener = [target, type, handler];
            binder(listener);
            listeners.push(listener);
        },

        /**
         * Removes all events listeners.
         */
        _clear() {
            listeners.forEach(listener => {
                binder(listener, true);
            });
        }
    }
}
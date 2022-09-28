import '../sass/tartib.scss';
import { defaults } from './defaults';
import { sort } from './drag';
import { getElement } from './utils/dom';


export default class Tartib {

    static defaults = defaults;

    constructor(reference, options) {
        this.el = getElement(reference);
        this.config = Object.assign({}, Tartib.defaults, options);
        sort(this);
    }


}

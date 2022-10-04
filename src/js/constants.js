export const ROOT = document;
export const HTML = ROOT.documentElement;
export const BODY = ROOT.body;

export const INSERT_BEFORE = 'beforebegin';
export const INSERT_AFTER = 'afterend';

export const START_EVENT = 'start';
export const MOVE_EVENT = 'move';
export const SORT_EVENT = 'sort';
export const CHANGE_EVENT = 'change';
export const END_EVENT = 'end';

export const { floor, abs } = Math;


export const METHODS = {
    x: {
		_scrollProperty: 'scrollLeft',
		_scrollDimension: 'scrollWidth',
		_lowerBound: 'left',
		_upperBound: 'right',
		_dimension: 'width'
	},
	
	y: {
		_scrollProperty: 'scrollTop',
		_scrollDimension: 'scrollHeight',
		_lowerBound: 'top',
		_upperBound: 'bottom',
		_dimension: 'height'
	}
}
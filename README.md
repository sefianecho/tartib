# Tartib

Reorder a list of DOM elements, by dragging an element within the list to occupy another position, other elements will shift to create a slot for the dragged element.

## Features
- No dependencies.
- Lightweight.
- Mobile friendly.
- Sort list with items aligned horizontally, vertically or in a grid.

## Demo

## Getting started
Install using package manager:
```bash
npm install tartib
```
or

```bash
yarn add tartib
```
and import files:

```javascript
// Import javascript.
import tartib from 'tartib';

// Import css.
import 'tartib/dist/css/tartib.min.css';
```

## CDN
Add a direct link to your page.

- Jsdelivr CDN
```html
<!-- Style -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tartib/dist/css/tartib.min.css">

<!-- Script -->
<script src="https://cdn.jsdelivr.net/npm/tartib/dist/js/tartib.min.js"></script>
```

- Unpkg CDN
```html
<!-- Style -->
<link rel="stylesheet" href="https://unpkg.com/tartib/dist/css/tartib.min.css">

<!-- Script -->
<script src="https://unpkg.com/tartib/dist/js/tartib.min.js"></script>
```

## Usage
```html
<ul id="my-list" class="tartib">
  <li class="tartib__item">One</li>
  <li class="tartib__item">Two</li>
  <li class="tartib__item">Three</li>
  <li class="tartib__item">Four</li>
</ul>
```
```javascript
// The second argument (options) is optional.
const tartib = new Tartib('#my-list', {
  // Options...
});
```

## Options
| **Option** | **Type** | **Default** | **Description** |
|------------| ---------| ------------ | ---------------- |
| dragFrom   | `Object` |  `{}`        | Object with x, y properties, drag items from the same position, x and y represent the coordinates relative to the dragged item's top left corner, x and y can be numbers or percentages, e.g. `{ x: '50%' }` to center it horizontally. |
| cursor | `String` | `''` | Set the cursor while dragging an item (CSS cursor property). |
| elevation | `Boolean` | `true` | Adds a box shadow to the dragged item. |
| active | `String` | `''` | Add classes (space separated) to the dragged item, those classes will be removed when the item is dropped |
| placeholder | `String` | `''` | Add classes to the placeholder (The empty slot). |
| dragHandle | `String\|Element` | `''` | A selector or an Element, use it as a drag area within the item. |
| axis | `String` | `''` | Lock movement to only one axis `'x'` or `'y'` |
| disabled | `Boolean` | `false` | Disable/Enable sorting |
| opacity | `Number` | `1` | Apply opacity to the dragged item (during dragging), value must be between 0 and 1 exclusive |
| autoScroll | `Boolean` | `true` | Auto scroll while dragging an item, to show out of viewport items. |
| rtl | `Boolean` | `false` | Right to Left direction |

## Events

| **Event**  | **Argument** | **Description**               |
|------- | --------------- | ------------------------------ |
| `start` | `event` | is fired when the item starts to move. |
| `move` | `event` | is fired when the item is moving |
| `sort` | `event` | is fired when the item changes its position. |
| `change` | `event` | is fired when the list items order changes. |
| `end` | `event` | is fired when the item is dropped. |

### Event Handler parameter
- x: `number` — Item x coordinate.
- y: `number` — Item y coordinate.
- target: `Element` — The Dragged Item.
- relatedTarget: `Element` — When hover over or touch other list item while dragging an item.
- placeholder: `Element` — Item slot.
- items: `Array` — List items.
- getData(attribute : `String`) : `Array` — Array of each item attribute value.

## Methods
- **setOptions**(options: `Object`) — Sets one or more options.
- **on**(type: `String`, handler: `callback`) — Adds an event listener.
- **off**(type`?`: `String`, handler`?`: `callback`) — Removes an event handler, if the handler argument is omitted then all handlers attach to this event will be removed, calling this method without arguments will remove all handlers of all events.
- **getData**(attribute: `String`) : `Array` — Array of each item attribute value.
- **disable**() — Disables sorting.
- **enable**() — Enables sorting.
- **destroy**() — Removes this instance functionality (free up memory).

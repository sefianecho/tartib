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
| dragHandle | `String|Element` | `''` | A selector or an Element, use it as a drag area within the item. |
| axis | `String` | `''` | Lock movement to only one axis `'x'` or `'y'` |
| disabled | `Boolean` | `false` | Disable/Enable sorting |
| opacity | `Number` | `1` | Apply opacity to the dragged item (during dragging), value must be between 0 and 1 exclusive |
| autoScroll | `Boolean` | `true` | Auto scroll while dragging an item, to show out of viewport items. |
| rtl | `Boolean` | `false` | Right to Left direction |

## Events

| **Event**  | **Argument** | **Description**               |
|------- | --------------- | ------------------------------ |
| `start` | `event` | Fires when an item start moving (dragging) |
| `move` | `event` | Fires when an item is moving (being dragged) |
| `sort` | `event` | Similar to the `move` event, it only fires when the item change its position |
| `change` | `event` | Fires when an item is dropped and the list item's order is changed |
| `end` | `event` | Fires when an item is dropped |

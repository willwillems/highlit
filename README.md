# Highlit

Highlit is an extremely lightweight highlighting and marking ES library that leverages the native Selection and Range APIs. The code is made to be simple and readable. Check it out to see how it works.

## Usage

This tool is designed to be simple and efficient. The `highlight` function uses the HTML5 Selection API to create a highlight based on the current selection, and the `render` function uses the Range API to apply the highlight to the document.

```js
import { highlight, render } from 'highlit';

const highlights = [/* ... */]

highlights.forEach(highlight => render(highlight, {
   class: 'highlight', // optional
   backgroundColor: 'rgb(219, 181, 32)', // optional
   tag: 'mark', // optional
}))

// highlight is automatically rendered using the provided render function
const result = highlight({
   exceptSelectors: ['pre', 'code'], // optional
   render: renderFunction // optional
})

```
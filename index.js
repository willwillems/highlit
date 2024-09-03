import { generateUUID, isNodeInSelectors } from './lib.js';

const DEFAULT_HIGHLIGHT_COLOR = 'rgba(255, 205, 10, 0.8)'
const DEFAULT_HIGHLIGHT_TAG = 'mark'

/**
 * @typedef {Object} HighlightParent
 * @property {string} cssSelector - CSS selector for the parent element
 * @property {string} xpathSelector - XPath selector for the parent element
 */

/**
 * @typedef {Object} Highlight
 * @property {string} id - Unique identifier for the highlight
 * @property {Node} startContainer - The Node within which the Range starts
 * @property {number} startOffset - The offset within the startContainer where the Range starts
 * @property {Node} endContainer - The Node within which the Range ends
 * @property {number} endOffset - The offset within the endContainer where the Range ends
 */

/**
 * @typedef {Object} HighlightReturn
 * @extends Highlight
 * @property {string} textContent - The text content of the Range
 * @property {string} textPrefix - The text immediately before the highlighted text in the start node
 * @property {string} textSuffix - The text immediately after the highlighted text in the end node
 */

/**
 * Renders a highlight in the document.
 * @param {Highlight} highlight - The highlight object to render.
 * @param {Object} [options] - Rendering options.
 * @param {string} [options.class] - CSS class to apply to the highlight.
 * @param {string} [options.backgroundColor] - Background color for the highlight.
 * @param {string} [options.tag='mark'] - HTML tag to use for wrapping the highlight.
 */
export function render(highlight, options = {}) {
  const { class: className, backgroundColor = DEFAULT_HIGHLIGHT_COLOR, tag = DEFAULT_HIGHLIGHT_TAG } = options;
  const range = document.createRange();
  range.setStart(highlight.startContainer, highlight.startOffset);
  range.setEnd(highlight.endContainer, highlight.endOffset);

  const wrapper = document.createElement(tag);
  if (className) wrapper.className = className;
  if (backgroundColor) wrapper.style.backgroundColor = backgroundColor;
  wrapper.dataset.highlightId = highlight.id;
  console.log(range)
  range.surroundContents(wrapper);
}

/**
 * Highlights the current selection in the document.
 * @param {Object} options - Highlighting options.
 * @param {string[]} [options.exceptSelectors] - Selectors to exclude from highlighting.
 * @param {(highlight: Highlight, options?: Object) => void} [options.render] - Render function to use.
 * @returns {Promise<HighlightReturn | null>} Information about the highlighted range, or null if no selection or within except selectors.
 */
export async function highlight(options = { render }) {
  const exceptSelectors = options.exceptSelectors || [];
  const _render = options.render || render;
  
  const selection = window.getSelection();
  if (!selection) return null;
  
  if (selection.rangeCount === 0) return null;

  const range = selection.getRangeAt(0);

  // Check if start or end node is within except selectors
  if (isNodeInSelectors(range.startContainer, exceptSelectors) ||
      isNodeInSelectors(range.endContainer, exceptSelectors)) {
    return null;
  }

  /** @type {Highlight} */
  const highlight = {
    id: await generateUUID(),
    startContainer: range.startContainer,
    startOffset: range.startOffset,
    endContainer: range.endContainer,
    endOffset: range.endOffset
  };
  const textContent = range.toString();

  // Get the text prefix from the start node
  const startNode = range.startContainer;
  const textPrefix = startNode.textContent ? startNode.textContent.slice(0, range.startOffset) : '';

  // Get the text suffix from the end node
  const endNode = range.endContainer;
  const textSuffix = endNode.textContent ? endNode.textContent.slice(range.endOffset) : '';

  await _render(highlight);

  /** @type {HighlightReturn} */
  return {
    ...highlight,
    textContent,
    textPrefix,
    textSuffix
  };
}

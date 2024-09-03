/**
 * Generates a UUID from an optional string
 * @param {string} [str] string to create a uuid for
 * @returns {Promise<string>} uuid
 */
export async function generateUUID(str) {
    if(str) {
        const encoder = new TextEncoder();
        const data = encoder.encode(str);
        const hash = await crypto.subtle.digest("SHA-256", data);
        str = Array.from(new Uint8Array(hash)).map(byte => byte.toString(16).padStart(2, "0")).join("");
    }
    
    const values = crypto.getRandomValues(new Uint8Array(16));
    values[6] = (values[6] & 0x0f) | 0x40;
    values[8] = (values[8] & 0x3f) | 0x80;
    
    return values.reduce((acc, value, index) => {
        if (index === 4 || index === 6 || index === 8 || index === 10) acc += "-";
        return acc + (value + 0x100).toString(16).substr(1);
    }, "");
}

/**
 * Checks if a node is within an element matching any of the given selectors.
 * @param {Node} node - The node to check.
 * @param {string[]} selectors - The selectors to match against.
 * @returns {boolean} True if the node is within a matching element, false otherwise.
 */
export function isNodeInSelectors(node, selectors) {
    /** @type {Node | null} */
    let currentNode = node;
    while (currentNode && currentNode !== document.body) {
        if (currentNode.nodeType === Node.ELEMENT_NODE) {
            const element = /** @type {Element} */ (currentNode);
            if (selectors.some(selector => element.matches(selector))) {
                return true;
            }
        }
        currentNode = currentNode.parentNode;
    }
    return false;
}

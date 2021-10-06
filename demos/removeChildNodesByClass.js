/**
 * @author  Ikaros Kappler
 * @date    2021-10-06
 * @version 1.0.0
 */

function removeChildNodesByClass(node, className) {
  const elements = node.getElementsByClassName(className);
  while (elements.length > 0) {
    elements[0].parentNode.removeChild(elements[0]);
  }
}

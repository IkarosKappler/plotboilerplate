/**
 * A helper function to clear a DOM node: removes all child nodes.
 *
 * @author  Ikaros Kappler
 * @date    2021-10-06
 * @version 1.0.0
 */
function removeAllChildNodes(node) {
  while (node.lastChild) {
    node.removeChild(node.lastChild);
  }
}

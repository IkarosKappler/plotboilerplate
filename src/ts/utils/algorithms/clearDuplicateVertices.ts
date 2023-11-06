/**
 * Remove duplicate vertices (2d) from an array.
 *
 * This method war taken and refactored from an older demo.
 *
 * @author   Ikaros Kappler
 * @date     2021-07-13
 * @modified 2023-10-28 Refactored and ported to Typescript.
 * @version  1.0.0
 */

import { Vertex } from "../../Vertex";

const EPS: number = 0.000001;

/**
 * Filter the array and clear all duplicates.
 *
 * The original array is left unchanged. The vertices in the array are not cloned.
 *
 * @param {Vertex[]} vertices
 * @param {number=EPS} epsilon
 * @return {Vertex[]}
 */
export const clearDuplicateVertices = (vertices: Vertex[], epsilon?: number) => {
  if (typeof epsilon === "undefined") {
    epsilon = EPS;
  }
  const result: Array<Vertex> = [];
  for (var i = 0; i < vertices.length; i++) {
    if (!containsElementFrom(vertices, vertices[i], i + 1, epsilon)) {
      result.push(vertices[i]);
    }
  }
  return result;
};

const isCloseTo = (vertA: Vertex, vertB: Vertex, eps: number): boolean => {
  return vertA.distance(vertB) < eps;
};

const containsElementFrom = (vertices: Array<Vertex>, vertex: Vertex, fromIndex: number, epsilon: number): boolean => {
  for (var i = fromIndex; i < vertices.length; i++) {
    if (isCloseTo(vertices[i], vertex, epsilon)) {
      return true;
    }
  }
  return false;
};

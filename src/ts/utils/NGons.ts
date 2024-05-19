/**
 * Generate regular polygons (N-Gons) and stars (N-Stars).
 *
 * @author   Ikaros Kappler
 * @date     2023-11-24 (plain Javascript)
 * @modified 2024-01-29 Ported to Typescript.
 * @version 1.0.0
 */

import { Polygon } from "../Polygon";
import { Vertex } from "../Vertex";

export const NGons = {
  ngon: (n: number, radius: number) => {
    const center = new Vertex(0, 0);
    const verts: Array<Vertex> = [];
    for (var i = 0; i < n; i++) {
      var vert = new Vertex(radius, 0);
      vert.rotate(((Math.PI * 2) / n) * i, center);
      verts.push(vert);
    }
    return new Polygon(verts);
  },

  nstar: (n: number, radiusA: number, radiusB: number) => {
    const center = new Vertex(0, 0);
    const verts: Array<Vertex> = [];
    for (var i = 0; i < n; i++) {
      var vert = new Vertex(i % 2 === 0 ? radiusA : radiusB, 0);
      vert.rotate(((Math.PI * 2) / n) * i, center);
      verts.push(vert);
    }
    return new Polygon(verts);
  }
};

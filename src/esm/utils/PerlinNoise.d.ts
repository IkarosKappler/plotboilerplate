declare class Grad {
    x: number;
    y: number;
    z: number;
    constructor(x: number, y: number, z: number);
    dot2(x: number, y: number): number;
    dot3(x: number, y: number, z: number): number;
}
export declare class PerlinNoise {
    perm: number[];
    gradP: Grad[];
    constructor();
    seed(seed: number): PerlinNoise;
    simplex2(xin: number, yin: number): number;
    simplex3(xin: number, yin: number, zin: number): number;
    perlin2(x_init: number, y_init: number): number;
    perlin3(x_init: number, y_init: number, z_init: number): number;
}
export {};

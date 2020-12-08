interface IEarcutProps {
    vertices: Array<number>;
    holes: Array<number>;
    dimensions: number;
}
declare type IArrayVert = Array<number>;
export declare const flatten: (data: Array<Array<IArrayVert>>) => IEarcutProps;
export {};

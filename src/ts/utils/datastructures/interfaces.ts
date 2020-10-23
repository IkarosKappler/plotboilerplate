/**
 * Some often-used interfaces.
 *
 * @author  Ikaros Kappler
 * @date    2020-10-23
 * @version 1.0.0
 **/

export type Interval = [ number, number ];

export type IndexPair = {
    i : number;
    j : number;
}

export type Matrix<T> = Array<Array<T>>;

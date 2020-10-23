/**
 * An equivalent of lodash.array_fill(...).
 *
 * @author Ikaros Kappler
 * @date 2020-10-23
 * @version 1.0.0
 **/

import { arrayFill } from "./arrayFill";
import { Matrix } from "../datastructures/interfaces";

export const matrixFill = <T extends any>( countA:number, countB:number, initialValue:T ) : Matrix<T> => {
    const arr : Matrix<T> = Array<Array<T>>( countA );
    for( var i = 0; i < countA; i++ ) {
	arr[i] = arrayFill<T>( countB, initialValue );
    }
    return arr;
};



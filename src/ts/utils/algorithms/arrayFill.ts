/**
 * An equivalent of lodash.array_fill(...).
 *
 * @author Ikaros Kappler
 * @date 2020-10-23
 * @version 1.0.0
 **/

export const arrayFill = <T extends any>( count:number, initialValue:T ) : Array<T> => {
    const arr : Array<T> = Array<T>( count );
    for( var i = 0; i < count; i++ )
	arr[i] = initialValue;
    return arr;
};


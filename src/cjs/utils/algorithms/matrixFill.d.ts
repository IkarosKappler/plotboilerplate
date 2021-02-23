/**
 * @author Ikaros Kappler
 * @date 2020-10-23
 * @version 1.0.0
 **/
import { Matrix } from "../datastructures/interfaces";
/**
 * A matrix-fill helper function. Equivalent of lodash.array_fill(...).
 */
export declare const matrixFill: <T extends unknown>(countA: number, countB: number, initialValue: T) => Matrix<T>;

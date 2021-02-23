/**
 * @classdesc A static UIDGenerator.
 *
 * @author  Ikaros Kappler
 * @date    2021-01-20
 * @version 1.0.0
 */
import { UID } from "./interfaces";
export declare abstract class UIDGenerator {
    private static current;
    static next(): UID;
}

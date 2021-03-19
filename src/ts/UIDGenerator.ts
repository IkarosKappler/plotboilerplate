/**
 * @classdesc A static UIDGenerator.
 *
 * @author  Ikaros Kappler
 * @date    2021-01-20
 * @version 1.0.0
 */

import { UID } from "./interfaces";

export abstract class UIDGenerator {
  private static current: number = 0;
  public static next(): UID {
    return `${UIDGenerator.current++}`;
  }
}

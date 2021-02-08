/**
 * @classdesc A static UIDGenerator.
 *
 * @author  Ikaros Kappler
 * @date    2021-01-20
 * @version 1.0.0
 */
export class UIDGenerator {
    static next() { return `${UIDGenerator.current++}`; }
    ;
}
UIDGenerator.current = 0;
;
//# sourceMappingURL=UIDGenerator.js.map
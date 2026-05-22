/**
 * Wraps a Record<string,string> and adds type conversion methods (developed this in
 * some other project) and added this here (2023-10-28).
 *
 * @author   Ikars Kappler
 * @version  1.0.0
 * @date     2023-03-13
 * @modified 2024-08-26 Added the `hasParam` method.
 * @modified 2026-05-22 Added the `isValueAllowed` function param to the getter methods.
 */
export declare class Params {
    baseParams: Record<string, string>;
    constructor(baseParams: Record<string, string>);
    hasParam(name: string): boolean;
    getString(name: string, fallback: string, isValueAllowed?: (value: string) => boolean): string;
    getNumber(name: string, fallback: number, isValueAllowed?: (value: number) => boolean): number;
    getBoolean(name: string, fallback: boolean): boolean;
}

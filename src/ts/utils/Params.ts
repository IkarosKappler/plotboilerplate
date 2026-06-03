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

export class Params {
  baseParams: Record<string, string>;

  constructor(baseParams: Record<string, string>) {
    this.baseParams = baseParams;
  }

  hasParam(name: string): boolean {
    return this.baseParams.hasOwnProperty(name);
  }

  getString(name: string, fallback: string, isValueAllowed?: (value: string) => boolean): string {
    let value = this.baseParams[name];
    if (typeof value === "undefined" || !value || (value = value.trim()).length === 0) {
      return fallback;
    }
    if (isValueAllowed && !isValueAllowed(value)) {
      return fallback;
    }
    return value;
  }

  getNumber(name: string, fallback: number, isValueAllowed?: (value: number) => boolean): number {
    let value = this.baseParams[name];
    if (typeof value === "undefined" || !value || (value = value.trim()).length === 0) {
      return fallback;
    }
    var numericValue = Number(value);
    if (isValueAllowed && !isValueAllowed(numericValue)) {
      return fallback;
    }
    return numericValue;
  }

  getBoolean(name: string, fallback: boolean): boolean {
    let value = this.baseParams[name];
    if (typeof value === "undefined" || !value || (value = value.trim()).length === 0) {
      return fallback;
    }
    value = value.toLocaleLowerCase();
    if (value === "1" || value === "on" || value === "yes" || value === "y" || value === "hi" || value == "high") {
      return true;
    } else if (value === "0" || value === "off" || value === "no" || value === "n" || value === "lo" || value == "low") {
      return false;
    } else {
      return Boolean(value);
    }
  }
}

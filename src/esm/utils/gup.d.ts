/**
 * `gup` = "Get URL/URI Params".
 *
 * This function simply taktes the location string from the broser bar and retrieves all GET params
 * as a record of string mappings.
 *
 * You can pass that result into the `Params` class to get proper type conversion for numbers and booleans.
 *
 * Ported to typescript.
 * @date 2021-05-21
 * @modified 2024-03-10 Fixed some type for Typescript 5 compatibility.
 * @modified 2024-08-26 Decoding URI components in GET params.
 */
export declare const gup: () => Record<string, string>;

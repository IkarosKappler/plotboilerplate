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

// Get the URI GET params as an assoc.
//
// A nicer version with regex
// Found at
//    https://stackoverflow.com/questions/979975/how-to-get-the-value-from-the-get-parameters?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa
export const gup = (): Record<string, string> => {
  const vars: Record<string, string> = {};
  globalThis.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, (_m: string, key: string, value: string): string => {
    const keyName: string = key as keyof Object;
    return (vars[decodeURIComponent(keyName)] = value);
  });
  return vars;
};

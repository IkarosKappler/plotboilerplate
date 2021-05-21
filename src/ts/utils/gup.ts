/**
 * Ported to typescript.
 * @date 2021-05-21
 */

// Get the URI GET params as an assoc.
//
// A nicer version with regex
// Found at
//    https://stackoverflow.com/questions/979975/how-to-get-the-value-from-the-get-parameters?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa
export const gup = (): Record<string, string> => {
  const vars = {};
  globalThis.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, (_m: string, key: string, value: string): string => {
    return (vars[key] = value);
  });
  return vars;
};

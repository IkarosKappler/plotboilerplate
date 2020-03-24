// Get the URI GET params as an assoc.
// 
// A nice version with regex
// Found at
//    https://stackoverflow.com/questions/979975/how-to-get-the-value-from-the-get-parameters?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa
//
// Typescript version by Ikaros Kappler, 2020-03-24
// 
const gup = () : Record<string,string> => {
    const vars : Record<string,string> = {};
    window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,    
				 (substring:string, ...args: any[]) => {
				     const [ key, value ] = args;
				     vars[key.toString()] = value.toString();
				     return substring;
				 });
    return vars;
}

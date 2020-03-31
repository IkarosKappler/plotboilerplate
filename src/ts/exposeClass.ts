
// NOT WORKING
const exposeClass = (classObject:object) => {
    // console.log( "exposeClass", classObject.constructor.name );
    ((_context:any) => {
	console.log( "exposeClass", classObject, classObject.constructor );
	// const exposeClass : string = "TEST";
	_context[classObject.constructor.name] = classObject;
    })(typeof window !== 'undefined' ? window : this);
};

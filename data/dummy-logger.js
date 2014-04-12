/*
* Prints information next to the given input.
* Doesn't log if there's nothing to show.
*/
function logInfo($input, key, value) {
    if ((value && typeof value !== 'object') || (typeof value === 'object' && Object.keys(value).length !== 0)) {
	console.log('Input id=\'' + $input.prop('id') + '\'\t- ' + key + ': ' + JSON.stringify(value, null, 4));
    }
}

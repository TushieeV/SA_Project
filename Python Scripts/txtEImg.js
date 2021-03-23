/*function binArr(num, size){
    var b = (num >>> 0).toString(2)
    if (b.length !== size) {
        var tmp = '';
        for (i = 0; i < (size - b.length); i++){
            tmp += '0';
        }
        tmp += b;
        b = tmp;
    }
    return b
}

function changeLastBit(num, bit, size){
    var b = binArr(num, size);
    var n = '';
    for (i = 0; i < b.length - 1; i++) {
        n += b[i];
    }
    n += bit;
    return n; 
}
*/

//const SEED = 'this is a random seed.';
//const SIZE = 500;
//var seedrandom = require('seedrandom');


const prompt = require('prompt-sync')();
const msg = prompt('Enter message to encode: ')

const {PythonShell} = require('python-shell');
var options = {
    args: [msg]
}

PythonShell.run('txtEImg.py', options, function(err, results){
    if (err) throw err;
    console.log('Done');
});
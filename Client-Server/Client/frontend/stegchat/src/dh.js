const { PythonShell } = require('python-shell');
const fs = require('fs');
const execFile = require('child_process').execFile;
/*async function gen_dh_obj() {
    var res = await new Promise((resolve, reject) => {
        PythonShell.run('../Scripts/dh.py', {}, function(err, results) {
            if (err) {
                throw err;
            } else {
                return resolve(results);
            }
        });
    });
    return res;
}*/

export async function get_dh() {
    const result = new Promise((resolve, reject) => {
        execFile('./Scripts/dist/dh.exe', (err, stdout, stderr) => {
            if (err) {
                console.warn(err);
            }
            resolve(stdout ? stdout : stderr);
        });
    });
    result.then(response => console.log(response));
}







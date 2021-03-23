const { PythonShell } = require('python-shell');

async function gen_dh_obj() {
    var res = await new Promise((resolve, reject) => {
        PythonShell.run('../../../dh.py', {}, function(err, results) {
            if (err) {
                throw err;
            } else {
                return resolve(results);
            }
        });
    });
    return res;
}

var res = gen_dh_obj();
var tmp;
tmp = res.then((t = tmp) => {
    return t;
});



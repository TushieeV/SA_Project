const {PythonShell} = require('python-shell')

const pyshell = new PythonShell('test.py');

pyshell.send("hello");

pyshell.on('message', function (message) {
  console.log(message);
});

pyshell.end(function (err,code,signal) {
  if (err) throw err;
  console.log('finished');
});
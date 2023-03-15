const { PythonShell: shell } = require('python-shell');

function start() {
    let pyshell = new shell('scrapper.py', {args: ['void']});


    
    pyshell.on('message', function (message) {
      // received a message sent from the Python script (a simple "print" statement)
      console.log(JSON.parse(message))
      
    });
    
    // end the input stream and allow the process to exit
    pyshell.end(function (err,code,signal) {
      if (err) throw err;
      console.log('The exit code was: ' + code);
      console.log('The exit signal was: ' + signal);
      console.log('finished');
    });


}

start()
const readline = require('readline');
const { exec } = require('child_process');

// // Algolia
if  ( process.env.NODE_SETUP === 'algolia'){
  var lineReader = require('readline').createInterface({
    input: require('fs').createReadStream('algolia.txt')
  });

  lineReader.on('line', function (line) {
    console.log('Line from file:', line);
    exec(line, (err, stdout, stderr) => {
    if (err) {
      console.log(err)
      return;
    }

    // the *entire* stdout and stderr (buffered)
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
  });
  });
}

;

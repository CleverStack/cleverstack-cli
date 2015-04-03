var fs = require('fs');

exports.generateReleaseScript = function() {
  return '#!/bin/bash\n\n' +
    fs.readFileSync('./deploy/templates/lock/acquire.sh') + '\n\n' +
    fs.readFileSync('./deploy/templates/release/s3/download/script.sh') + '\n\n' +
    fs.readFileSync('./deploy/templates/release/crontab.sh') + '\n\n' +
    fs.readFileSync('./deploy/templates/release/s3/download/release.sh') + '\n\n' +
    fs.readFileSync('./deploy/templates/lock/release.sh');
};

exports.generateUserDataScript = function() {
  return '#!/bin/bash\n\n' +
    fs.readFileSync('./deploy/templates/userdata/config.sh') + '\n\n' +
    fs.readFileSync('./deploy/templates/userdata/prepare.sh') + '\n\n' +
    fs.readFileSync('./deploy/templates/userdata/ec2/hostname.sh') + '\n\n' +
    fs.readFileSync('./deploy/templates/userdata/s3cfg.sh') + '\n\n' +
    fs.readFileSync('./deploy/templates/userdata/s3/download.sh') + '\n\n' +
    fs.readFileSync('./deploy/templates/userdata/nat/prerouting.sh') + '\n\n' +
    fs.readFileSync('./deploy/templates/userdata/run.sh');
};

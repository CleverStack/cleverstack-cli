var fs   = require('fs')
  , path = require('path');

module.exports = function(env, lib, repl, local) {
  function ReplHistory() {
    this.help    = 'Shows command history';

    var maxSize  = 10240
      , lastLine = null
      , filename = process.env.HOME ? path.join(process.env.HOME, '.cleverstack_history') : void 0
      , buffer
      , readFd
      , size
      , stat
      , fd;

    try {
      stat       = fs.statSync(filename);
      size       = Math.min(maxSize, stat.size);
      readFd     = fs.openSync(filename, 'r');
      buffer     = new Buffer(size);

      fs.readSync(readFd, buffer, 0, size, stat.size - size);
      local.rli.history = buffer.toString().split('\n').reverse();
      if (stat.size > maxSize) {
        local.rli.history.pop();
      }
      if (local.rli.history[ 0 ] === '') {
        local.rli.history.shift();
      }
      local.rli.historyIndex = -1;
      lastLine  = local.rli.history[ 0 ];
    } catch (_error) {}

    fd = fs.openSync(filename, 'a');

    local.rli.addListener('line', function(code) {
      if (code && code.length && code !== '.history' && lastLine !== code) {
        fs.write(fd, '' + code + '\n');
        lastLine = code;
        return;
      }
    });

    local.rli.on('exit', function() {
      return fs.close(fd);
    });
  }

  ReplHistory.prototype.action = function() {
    local
      .outputStream
      .write('' + (local.rli.history.slice(0).reverse().join('\n')) + '\n');

    return local.displayPrompt();
  };

  return ReplHistory;
};

var path            = require('path')
  , colors          = require(path.resolve(path.join(__dirname, 'colors')))
  , barItems        = {}
  , barRunning      = false
  , runningTime     = null
  , originalConsole = console
  , bar;

/**
 * Prints an error message and ends
 * the process if passthrough is not true
 *
 * @param  {String} msg
 * @param  {Boolean=} passthrough
 * @api public
 */
exports.fail = exports.error = function(msg, passthrough) {
  console.log(colors.red(msg));

  if (passthrough !== true) {
    process.exit(0);
  }

  return this;
};

/**
 * Prints a successful message
 *
 * @param  {String} msg
 * @api public
 */

exports.success = function(msg) {
  console.log(colors.green('\u2714  ' + msg));
  return this;
};

/**
 * Prints an informative message
 *
 * @param  {String} msg
 * @api public
 */

exports.info = function(msg, tree) {
  if (undefined === tree) {
    tree = '├── ';
  } else if (tree === false) {
    tree = ' ';
  }
  if (/^\ \ (.*)/.test(msg)) {
    msg = '  ' + tree + RegExp.$1;
  }
  console.log(colors.blue(msg));
  return this;
};

/**
 * Prints a warning message / additional informative message
 *
 * @param  {String} msg
 * @api public
 */

exports.warn = function(msg, tree) {
  if (undefined === tree) {
    tree = '├── \u26A0 ';
  } else if (tree === false) {
    tree = '\u26A0 ';
  }
  if (/^\ \ (.*)/.test(msg)) {
    msg = '  ' + tree + RegExp.$1;
  }
  console.log(colors.orange(msg));
  return this;
};

exports.bar = bar;
exports.barItems = barItems;

exports.initBar = function() {
  if (undefined === bar) {
    bar = require('node-status');
    bar.clear();

    if (typeof process.stdout.cursorTo === 'function') {
      process.stdout.cursorTo(0);
    }

    // Define the main progress bar
    barItems.progress = bar.addItem('Installation Progress', {
      color: 'green',
      type: [ 'bar','percentage' ],
      max: 0,
      precision: 0
    });

    // Define the currently installing section for the bar
    barItems.installing = bar.addItem('Installing', {
      color: 'cyan',
      type: 'text',
      text: 'Loading...'
    });

    // Define the currently running section for the bar
    barItems.running = bar.addItem('Step', {
      color: 'yellow',
      type: 'text',
      text: 'Loading...'
    });

    barItems.runningTime = bar.addItem('Step Time', {
      color: 'yellow',
      type: 'text',
      text: '0',
      precision: 0
    });

    setInterval(function() {
      runningTime += 1;
      barItems.runningTime.text = bar.nicetime(runningTime, true);
    }, 1000);
  }
};

exports.installing = function(name) {
  if (undefined !== barItems.installing) {
    barItems.installing.text = name;
  }
  return this;
};

exports.running = function(task) {
  if (undefined !== barItems.running) {
    barItems.running.text = task;
    runningTime = 0;
  }
  return this;
};

exports.progress = function() {
  if (undefined !== barItems.progress) {
    barItems.progress.inc();
  }
  return this;
};

exports.expandProgress = function(amount) {
  if (undefined !== barItems.progress) {
    barItems.progress.max += amount;
  }
  return this;
};

exports.finishProgress = function() {
  if (undefined !== barItems.progress) {
    barItems.progress.val = barItems.progress.max;
  }
  return this;
};

exports.startBar = function(callback) {
  if (undefined !== bar && !barRunning) {
    barRunning = true;

    // Override the console and process functions used to output
    // GLOBAL.console = process.stdout = process.stderr = bar.console();
    GLOBAL.console = bar.console();

    // Start the bar
    bar.start({
      interval: 50,
      invert: false
    });

    // Give the bar a chance to start
    setTimeout(callback, 2000);
  } else {
    callback();
  }
};

exports.stopBar = function(callback) {
  if (barRunning) {
    bar.stop();

    setTimeout(function() {

      barRunning = false;
      GLOBAL.console = originalConsole;

      setTimeout(callback, 100);

    }, 2000);
  } else {
    callback();
  }
};

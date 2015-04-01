var chai      = require('chai')
  , expect    = chai.expect
  , spawn     = require('child_process').spawn
  , path      = require('path')
  , binPath   = path.join(__dirname, '..', 'bin')
  , assetPath = path.join(__dirname, 'assets');

chai.config.includeStack = true;

describe('REPL', function () {
  it('should be able to go into the REPL and execute some commands', function (done) {
    var stdout = ''
      , help   = false;

    var proc = spawn(path.join(binPath, 'clever-repl'), [ ], { cwd: path.join(assetPath, 'my-new-project', 'backend') });
    proc.stdout.on('data', function (data) {
      var str = data + '';
      stdout += str;
      if (str.match(/cleverstack::.*>/) !== null) {
        if (help === false) {
          help = true;
          proc.stdin.write('.commands\n');
        } else {
          proc.stdin.write('.quit\n');
        }
      }
    });

    proc.on('exit', function (code) {
      expect(code).to.equal(0);

      expect(stdout).to.match(/\u001b\[38;5;172m.break\u001b\[39m    │ \u001b\[38;5;8mSometimes you get stuck, this gets you out\u001b\[39m/);
      expect(stdout).to.match(/\u001b\[38;5;172m.clear\u001b\[39m    │ \u001b\[38;5;8mAlias for .break\u001b\[39m/);
      expect(stdout).to.match(/\u001b\[38;5;172m.exit\u001b\[39m     │ \u001b\[38;5;8mExits the CleverStack REPL\u001b\[39m/);
      expect(stdout).to.match(/\u001b\[38;5;172m.help\u001b\[39m     │ \u001b\[38;5;8mAlias for .commands\u001b\[39m/);
      expect(stdout).to.match(/\u001b\[38;5;172m.save\u001b\[39m     │ \u001b\[38;5;8mSave all evaluated commands in this REPL session to a file\u001b\[39m/);
      expect(stdout).to.match(/\u001b\[38;5;172m.load\u001b\[39m     │ \u001b\[38;5;8mLoad JS from a file into the REPL session\u001b\[39m/);
      expect(stdout).to.match(/\u001b\[38;5;172m.commands\u001b\[39m │ \u001b\[38;5;8mLists all of the REPL commands\u001b\[39m/);
      expect(stdout).to.match(/\u001b\[38;5;172m.h\u001b\[39m        │ \u001b\[38;5;8mAlias for .commands\u001b\[39m/);
      expect(stdout).to.match(/\u001b\[38;5;172m.quit\u001b\[39m     │ \u001b\[38;5;8mAlias for .exit\u001b\[39m/);
      expect(stdout).to.match(/\u001b\[38;5;172m.q\u001b\[39m        │ \u001b\[38;5;8mAlias for .exit\u001b\[39m/);
      expect(stdout).to.match(/\u001b\[38;5;172m.history\u001b\[39m  │ \u001b\[38;5;8mShows command history\u001b\[39m/);
      expect(stdout).to.match(/\u001b\[38;5;172m.models\u001b\[39m   │ \u001b\[38;5;8mLists all of the models within this project\u001b\[39m/);
      expect(stdout).to.match(/\u001b\[38;5;172m.modules\u001b\[39m  │ \u001b\[38;5;8mLists all of the modules within this project\u001b\[39m/);
      expect(stdout).to.match(/\u001b\[38;5;172m.services\u001b\[39m │ \u001b\[38;5;8mLists all of the services within this project\u001b\[39m/);

      done();
    });
  });
});

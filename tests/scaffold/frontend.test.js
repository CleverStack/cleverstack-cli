var chai      = require('chai')
  , expect    = chai.expect
  , exec      = require('child_process').exec
  , path      = require('path')
  , fs        = require('fs')
  , binPath   = path.join(__dirname, '..', '..', 'bin')
  , assetPath = path.join(__dirname, '..', 'assets');

chai.config.includeStack = true;

describe('Scaffold (frontend seed)', function () {
  it('should be able to scaffold within the frontend seed', function (done) {
    exec(path.join(binPath, 'clever-scaffold') + ' TestingScaff', { cwd: path.join(assetPath, 'my-new-project', 'frontend', 'app', 'modules') }, function (err, stdout, stderr) {
      expect(stderr).to.equal('');

      expect(stdout).to.not.match(/already exists within/);

      expect(fs.existsSync(path.join(assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'TestingScaff', 'controllers', 'TestingScaffController.js'))).to.be.true;
      expect(fs.existsSync(path.join(assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'TestingScaff', 'directives', 'TestingScaffDirective.js'))).to.be.true;
      expect(fs.existsSync(path.join(assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'TestingScaff', 'factories', 'TestingScaffFactory.js'))).to.be.true;
      expect(fs.existsSync(path.join(assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'TestingScaff', 'services', 'TestingScaffService.js'))).to.be.true;
      expect(fs.existsSync(path.join(assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'TestingScaff', 'views', 'TestingScaff-view.html'))).to.be.true;

      var controller = fs.readFileSync(path.join(assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'TestingScaff', 'controllers', 'TestingScaffController.js'));
      expect(controller).to.match(/\.module\(\'TestingScaff.controllers'\)/);
      expect(controller).to.match(/\.controller\(\'TestingScaffController',\ function\(\$scope\)\ {/);

      var directive = fs.readFileSync(path.join(assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'TestingScaff', 'directives', 'TestingScaffDirective.js'));
      expect(directive).to.match(/\.module\(\'TestingScaff.directives'\)/);
      expect(directive).to.match(/\.directive\(\'TestingScaffDirective',\ function\(\)\ {/);

      var factory = fs.readFileSync(path.join(assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'TestingScaff', 'factories', 'TestingScaffFactory.js'));
      expect(factory).to.match(/\.module\(\'TestingScaff.factories'\)/);
      expect(factory).to.match(/\.factory\(\'TestingScaffFactory',\ function\(\)\ {/);

      var service = fs.readFileSync(path.join(assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'TestingScaff', 'services', 'TestingScaffService.js'));
      expect(service).to.match(/\.module\(\'TestingScaff.services'\)/);
      expect(service).to.match(/\.service\(\'TestingScaffService',\ function\(\TestingScaffModel\)\ {/);

      var html = fs.readFileSync(path.join(assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'TestingScaff', 'views', 'TestingScaff-view.html'));
      expect(html).to.match(/<h1>TestingScaff Module<\/h1>/);

      done(err);
    });
  });

  it('should have trouble trying to scaffold with the same name', function (done) {
    exec(path.join(binPath, 'clever-scaffold') + ' TestingScaff', { cwd: path.join(assetPath, 'my-new-project', 'frontend', 'app', 'modules') }, function (err, stdout, stderr) {
      expect(stderr).to.equal('');
      expect(stdout).to.match(/already exists within/);
      done(err);
    });
  });
});

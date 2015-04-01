var chai      = require('chai')
  , expect    = chai.expect
  , exec      = require('child_process').exec
  , path      = require('path')
  , fs        = require('fs')
  , binPath   = path.join(__dirname, '..', '..', 'bin')
  , assetPath = path.join(__dirname, '..', 'assets');

chai.config.includeStack = true;

describe('Scaffold (backend seed)', function () {
  it('should be able to scaffold within the backend seed', function (done) {
    exec(path.join(binPath, 'clever-scaffold') + ' Testing', { cwd: path.join(assetPath, 'my-new-project', 'backend', 'modules') }, function (err, stdout, stderr) {
      expect(stderr).to.equal('');
      expect(stdout).to.not.match(/already exists within/);

      expect(fs.existsSync(path.join(assetPath, 'my-new-project', 'backend', 'modules', 'Testing', 'config', 'default.json'))).to.be.true;
      expect(fs.existsSync(path.join(assetPath, 'my-new-project', 'backend', 'modules', 'Testing', 'controllers', 'TestingController.js'))).to.be.true;
      expect(fs.existsSync(path.join(assetPath, 'my-new-project', 'backend', 'modules', 'Testing', 'models', 'TestingModel.js'))).to.be.true;
      expect(fs.existsSync(path.join(assetPath, 'my-new-project', 'backend', 'modules', 'Testing', 'schema', 'seedData.json'))).to.be.true;
      expect(fs.existsSync(path.join(assetPath, 'my-new-project', 'backend', 'modules', 'Testing', 'services', 'TestingService.js'))).to.be.true;
      expect(fs.existsSync(path.join(assetPath, 'my-new-project', 'backend', 'modules', 'Testing', 'tasks', 'TestingTask.js'))).to.be.true;
      expect(fs.existsSync(path.join(assetPath, 'my-new-project', 'backend', 'modules', 'Testing', 'tests', 'integration', 'TestingTest.js'))).to.be.true;
      expect(fs.existsSync(path.join(assetPath, 'my-new-project', 'backend', 'modules', 'Testing', 'tests', 'unit', 'TestingTest.js'))).to.be.true;

      var controller = fs.readFileSync(path.join(assetPath, 'my-new-project', 'backend', 'modules', 'Testing', 'controllers', 'TestingController.js'));
      expect(controller).to.match(/module\.exports = function\(Controller, TestingService\) \{/);
      expect(controller).to.match(/service: TestingService/);

      var model = fs.readFileSync(path.join(assetPath, 'my-new-project', 'backend', 'modules', 'Testing', 'models', 'TestingModel.js'));
      expect(model).to.match(/return Model\.extend\('Testing',/);

      var service = fs.readFileSync(path.join(assetPath, 'my-new-project', 'backend', 'modules', 'Testing', 'services', 'TestingService.js'));
      expect(service).to.match(/module\.exports = function\(Service, TestingModel\) \{/);
      expect(service).to.match(/return Service\.extend\(\{/);
      expect(service).to.match(/model\: TestingModel/);

      var task = fs.readFileSync(path.join(assetPath, 'my-new-project', 'backend', 'modules', 'Testing', 'tasks', 'TestingTask.js'));
      expect(task).to.match(/module\.exports =.*classe?s?.*\.extend\(/);

      var testInt = fs.readFileSync(path.join(assetPath, 'my-new-project', 'backend', 'modules', 'Testing', 'tests', 'integration', 'TestingTest.js'));
      expect(testInt).to.match(/describe \('\/Testing', function \(\) \{/);
      expect(testInt).to.match(/describe \('POST \/Testing', function \(\) \{/);
      expect(testInt).to.match(/describe \('GET \/Testing', function \(\) \{/);
      expect(testInt).to.match(/describe \('GET \/Testing\/:id', function \(\) \{/);
      expect(testInt).to.match(/describe \('PUT \/Testing\/:id', function \(\) \{/);
      expect(testInt).to.match(/describe \('DELETE \/Testing\/:id', function \(\) \{/);

      var testUnit = fs.readFileSync(path.join(assetPath, 'my-new-project', 'backend', 'modules', 'Testing', 'tests', 'unit', 'TestingTest.js'));
      expect(testUnit).to.match(/describe \('controllers\.TestingController', function \(\) \{/);
      expect(testUnit).to.match(/testEnv \(function \(TestingController, TestingService\) \{/);

      done(err);
    });
  });

  it('should have trouble trying to scaffold with the same name', function (done) {
    exec(path.join(binPath, 'clever-scaffold') + ' Testing', { cwd: path.join(assetPath, 'my-new-project', 'backend', 'modules') }, function (err, stdout, stderr) {
      expect(stderr).to.equal('');
      expect(stdout).to.match(/already exists within/);
      done(err);
    });
  });
});

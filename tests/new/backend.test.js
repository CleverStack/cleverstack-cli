var chai      = require( 'chai' )
  , expect    = chai.expect
  , exec      = require('child_process').exec
  , path      = require( 'path' )
  , fs        = require( 'fs' )
  , binPath   = path.join( __dirname, '..', '..', 'bin' )
  , assetPath = path.join( __dirname, '..', 'assets' );

chai.Assertion.includeStack = true;

describe( 'New (backend seed)', function ( ) {
  it( 'should be able to create a new module within the backend seed', function ( done ) {
    exec( path.join( binPath, 'clever-new' ) + ' TestingNew', { cwd: path.join( assetPath, 'my-new-project', 'backend' ) }, function ( err, stdout, stderr ) {
      expect( stderr ).to.equal( '' );
      expect( stdout ).to.not.match( /already exists within/ );

      expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'TestingNew', 'config', 'default.json' ) ) ).to.be.true;
      expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'TestingNew', 'controllers', 'TestingNewController.js' ) ) ).to.be.true;
      expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'TestingNew', 'models', 'TestingNewModel.js' ) ) ).to.be.true;
      expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'TestingNew', 'schema', 'seedData.json' ) ) ).to.be.true;
      expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'TestingNew', 'services', 'TestingNewService.js' ) ) ).to.be.true;
      expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'TestingNew', 'tasks', 'TestingNewTask.js' ) ) ).to.be.true;
      expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'TestingNew', 'tests' ) ) ).to.be.true;
      expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'TestingNew', 'tests', 'integration', 'TestingNewTest.js' ) ) ).to.be.true;
      expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'TestingNew', 'tests', 'unit', 'TestingNewTest.js' ) ) ).to.be.true;

      var controller = fs.readFileSync( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'TestingNew', 'controllers', 'TestingNewController.js' ) );
      expect( controller ).to.match( /module\.exports = function\( Controller, TestingNewService \) \{/ );
      expect( controller ).to.match( /service: TestingNewService/ );

      var model = fs.readFileSync( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'TestingNew', 'models', 'TestingNewModel.js' ) );
      expect( model ).to.match( /return Model\.extend\( "TestingNew",/ );

      var service = fs.readFileSync( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'TestingNew', 'services', 'TestingNewService.js' ) );
      expect( service ).to.match( /module\.exports = function\( Service, TestingNewModel \) \{/ );
      expect( service ).to.match( /return Service\.extend\(\{/ );
      expect( service ).to.match( /model\: TestingNewModel/ );

      var task = fs.readFileSync( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'TestingNew', 'tasks', 'TestingNewTask.js' ) );
      expect( task ).to.match( /var TestingNewTask = module\.exports = Class\.extend\(/ );

      var testInt = fs.readFileSync( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'TestingNew', 'tests', 'integration', 'TestingNewTest.js' ) );
      expect( testInt ).to.match( /describe \( '\/testing_new', function \(\) \{/ );
      expect( testInt ).to.match( /describe \( 'POST \/testing_new', function \(\) \{/ );
      expect( testInt ).to.match( /describe \( 'GET \/testing_new', function \(\) \{/ );
      expect( testInt ).to.match( /describe \( 'GET \/testing_new\/:id', function \(\) \{/ );
      expect( testInt ).to.match( /describe \( 'PUT \/testing_new\/:id', function \(\) \{/ );
      expect( testInt ).to.match( /describe \( 'DELETE \/testing_new\/:id', function \(\) \{/ );

      var testUnit = fs.readFileSync( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'TestingNew', 'tests', 'unit', 'TestingNewTest.js' ) );
      expect( testUnit ).to.match( /describe \( 'controllers\.TestingNewController', function \(\) \{/ );
      expect( testUnit ).to.match( /testEnv \( function \( TestingNewController, TestingNewService \) \{/ );

      done( err );
    } );
  } );

  it( 'should have trouble trying to create a new module with the same name', function ( done ) {
    exec( path.join( binPath, 'clever-new' ) + ' TestingNew', { cwd: path.join( assetPath, 'my-new-project', 'backend' ) }, function ( err, stdout, stderr ) {
      expect( stderr ).to.equal( '' );
      expect( stdout ).to.match( /already exists within/ );
      done( err );
    } );
  } );
} );

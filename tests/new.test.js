var chai      = require( 'chai' )
  , expect    = chai.expect
  , exec      = require('child_process').exec
  , path      = require( 'path' )
  , fs        = require( 'fs' )
  , binPath   = path.join( __dirname, '..', 'bin' )
  , assetPath = path.join( __dirname, 'assets' );

chai.Assertion.includeStack = true;

describe( 'New', function ( ) {
  beforeEach( function ( done ) {
    process.chdir( assetPath );
    done( );
  } );

  describe( 'backend seed', function ( ) {
    it( 'should be able to create a new module within the backend seed', function ( done ) {
      process.chdir( path.join( assetPath, 'my-new-project', 'backend' ) );

      exec( path.join( binPath, 'clever-new' ) + ' TestingNew', function ( err, stdout, stderr ) {
        expect( err ).to.be.null;
        expect( stderr ).to.equal( '' );
        expect( stdout ).to.not.match( /already exists within/ );

        expect( fs.existsSync( path.join( assetPath, 'my-new-project' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'backend' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'frontend' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'backend', 'modules' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'TestingNew' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'TestingNew', 'config' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'TestingNew', 'config', 'default.json' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'TestingNew', 'controllers' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'TestingNew', 'controllers', 'TestingNewController.js' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'TestingNew', 'models' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'TestingNew', 'models', 'odm' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'TestingNew', 'models', 'odm', 'TestingNewModel.js' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'TestingNew', 'models', 'orm' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'TestingNew', 'models', 'orm', 'TestingNewModel.js' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'TestingNew', 'schema' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'TestingNew', 'schema', 'seedData.json' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'TestingNew', 'services' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'TestingNew', 'services', 'TestingNewService.js' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'TestingNew', 'tasks' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'TestingNew', 'tasks', 'TestingNewTask.js' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'TestingNew', 'tests' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'TestingNew', 'tests', 'integration' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'TestingNew', 'tests', 'integration', 'TestingNewTest.js' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'TestingNew', 'tests', 'unit' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'TestingNew', 'tests', 'unit', 'TestingNewTest.js' ) ) ).to.be.true;

        var controller = fs.readFileSync( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'TestingNew', 'controllers', 'TestingNewController.js' ) );
        expect( controller ).to.match( /module\.exports = function\( TestingNewService \) \{/ );
        expect( controller ).to.match( /service: TestingNewService/ );
        expect( controller ).to.match( /message: "Hello from customAction inside TestingNewController"/ );

        var odmModel = fs.readFileSync( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'TestingNew', 'models', 'odm', 'TestingNewModel.js' ) );
        expect( odmModel ).to.match( /return mongoose\.model\('TestingNew', ModelSchema\);/ );

        var ormModel = fs.readFileSync( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'TestingNew', 'models', 'orm', 'TestingNewModel.js' ) );
        expect( ormModel ).to.match( /return sequelize.define\("TestingNew", \{/ );

        var service = fs.readFileSync( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'TestingNew', 'services', 'TestingNewService.js' ) );
        expect( service ).to.match( /TestingNewService = BaseService.extend\(\{/ );
        expect( service ).to.match( /TestingNewService\.instance = new TestingNewService\( sequelize \);/ );
        expect( service ).to.match( /TestingNewService\.Model = ORMTestingNewModel;/ );
        expect( service ).to.match( /return TestingNewService\.instance;/ );

        var task = fs.readFileSync( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'TestingNew', 'tasks', 'TestingNewTask.js' ) );
        expect( task ).to.match( /var TestingNewTask = module\.exports = Class\.extend\(/ );

        var testInt = fs.readFileSync( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'TestingNew', 'tests', 'integration', 'TestingNewTest.js' ) );
        expect( testInt ).to.match( /describe \( '\/testing_new', function \(\) \{/ );
        expect( testInt ).to.match( /describe \( 'POST \/testing_new', function \(\) \{/ );
        expect( testInt ).to.match( /describe \( 'GET \/testing_new', function \(\) \{/ );
        expect( testInt ).to.match( /describe \( 'GET \/testing_new\/:id', function \(\) \{/ );
        expect( testInt ).to.match( /describe \( 'PUT \/testing_new\/:id', function \(\) \{/ );
        expect( testInt ).to.match( /describe \( 'DELETE \/testing_new\/:id', function \(\) \{/ );
        expect( testInt ).to.match( /describe \( 'GET \/testing_new\/custom', function \(\) \{/ );
        expect( testInt ).to.match( /message: 'Hello from customAction inside TestingNewController'/ );

        var testUnit = fs.readFileSync( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'TestingNew', 'tests', 'unit', 'TestingNewTest.js' ) );
        expect( testUnit ).to.match( /describe \( 'controllers\.TestingNewController', function \(\) \{/ );
        expect( testUnit ).to.match( /testEnv \( function \( TestingNewController, TestingNewService \) \{/ );
        expect( testUnit ).to.match( /message: 'Hello from customAction inside TestingNewController'/ );

        done( );
      } );
    } );

    it( 'should have trouble trying to create a new module with the same name', function ( done ) {
      process.chdir( path.join( assetPath, 'my-new-project', 'backend' ) );

      exec( path.join( binPath, 'clever-new' ) + ' TestingNew', function ( err, stdout, stderr ) {
        expect( err ).to.be.null;
        expect( stderr ).to.equal( '' );
        expect( stdout ).to.match( /already exists within/ );
        done( );
      } );
    } );
  } );

  describe( 'frontend seed', function ( ) {
    it( 'should be able to create a new module within the frontend seed', function ( done ) {
      process.chdir( path.join( assetPath, 'my-new-project', 'frontend' ) );

      exec( path.join( binPath, 'clever-new' ) + ' TestingNew', function ( err, stdout, stderr ) {
        expect( err ).to.be.null;
        expect( stderr ).to.equal( '' );

        expect( stdout ).to.not.match( /already exists within/ );

        expect( fs.existsSync( path.join( assetPath, 'my-new-project' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'backend' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'frontend' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'frontend', 'app' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'TestingNew' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'TestingNew', 'scripts' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'TestingNew', 'scripts', 'testing_new_controller.js' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'TestingNew', 'views' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'TestingNew', 'views', 'index.html' ) ) ).to.be.true;

        var controller = fs.readFileSync( path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'TestingNew', 'scripts', 'testing_new_controller.js' ) );
        expect( controller ).to.match( /ng\.module\('testing_new.controllers'\)/ );
        expect( controller ).to.match( /\.controller\('TestingNewController', \[/ );

        var html = fs.readFileSync( path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'TestingNew', 'views', 'index.html' ) );
        expect( html ).to.match( /<h1>Example Module<\/h1>/ );

        done( );
      } );
    } );

    it( 'should have trouble trying to scaffold with the same name', function ( done ) {
      process.chdir( path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules' ) );

      exec( path.join( binPath, 'clever-scaffold' ) + ' TestingNew', function ( err, stdout, stderr ) {
        expect( err ).to.be.null;
        expect( stderr ).to.equal( '' );
        expect( stdout ).to.match( /already exists within/ );
        done( );
      } );
    } );
  } );
} );

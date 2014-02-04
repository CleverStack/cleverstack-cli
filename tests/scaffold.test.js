var chai    = require( 'chai' )
  , expect  = chai.expect
  , exec    = require('child_process').exec
  , path    = require( 'path' )
  , rimraf  = require( 'rimraf' )
  , async   = require( 'async' )
  , crypto  = require( 'crypto' )
  , mkdirp  = require( 'mkdirp' )
  , fs      = require( 'fs' )
  , binPath = path.join( __dirname, '..', 'bin' )

var assetPath = path.join( __dirname, 'assets' );

describe( 'Scaffold', function ( ) {
  beforeEach( function ( done ) {
    process.chdir( assetPath );
    done( );
  } );

  describe( 'backend seed', function ( ) {
    it( 'should be able to scaffold within the backend seed', function ( done ) {
      process.chdir( path.join( assetPath, 'my-new-project', 'backend', 'modules' ) );

      exec( path.join( binPath, 'clever-scaffold' ) + ' Testing', function ( err, stdout, stderr ) {
        expect( err ).to.be.null;
        expect( stderr ).to.equal( '' );
        expect( stdout ).to.not.match( /already exists within/ );

        expect( fs.existsSync( path.join( assetPath, 'my-new-project' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'backend' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'frontend' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'backend', 'modules' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'Testing' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'Testing', 'config' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'Testing', 'config', 'default.json' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'Testing', 'controllers' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'Testing', 'controllers', 'TestingController.js' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'Testing', 'models' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'Testing', 'models', 'odm' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'Testing', 'models', 'odm', 'TestingModel.js' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'Testing', 'models', 'orm' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'Testing', 'models', 'orm', 'TestingModel.js' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'Testing', 'schema' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'Testing', 'schema', 'seedData.json' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'Testing', 'services' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'Testing', 'services', 'TestingService.js' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'Testing', 'tasks' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'Testing', 'tasks', 'TestingTask.js' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'Testing', 'tests' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'Testing', 'tests', 'integration' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'Testing', 'tests', 'integration', 'TestingTest.js' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'Testing', 'tests', 'unit' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'Testing', 'tests', 'unit', 'TestingTest.js' ) ) ).to.be.true;

        var controller = fs.readFileSync( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'Testing', 'controllers', 'TestingController.js' ) );
        expect( controller ).to.match( /module\.exports = function\( TestingService \) \{/ );
        expect( controller ).to.match( /service: TestingService/ );
        expect( controller ).to.match( /message: "Hello from customAction inside TestingController"/ );

        var odmModel = fs.readFileSync( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'Testing', 'models', 'odm', 'TestingModel.js' ) );
        expect( odmModel ).to.match( /return mongoose\.model\('Testing', ModelSchema\);/ );

        var ormModel = fs.readFileSync( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'Testing', 'models', 'orm', 'TestingModel.js' ) );
        expect( ormModel ).to.match( /return sequelize.define\("Testing", \{/ );

        var service = fs.readFileSync( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'Testing', 'services', 'TestingService.js' ) );
        expect( service ).to.match( /TestingService = BaseService.extend\(\{/ );
        expect( service ).to.match( /TestingService\.instance = new TestingService\( sequelize \);/ );
        expect( service ).to.match( /TestingService\.Model = ORMTestingModel;/ );
        expect( service ).to.match( /return TestingService\.instance;/ );

        var task = fs.readFileSync( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'Testing', 'tasks', 'TestingTask.js' ) );
        expect( task ).to.match( /var TestingTask = module\.exports = Class\.extend\(/ );

        var testInt = fs.readFileSync( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'Testing', 'tests', 'integration', 'TestingTest.js' ) );
        expect( testInt ).to.match( /describe \( '\/testing', function \(\) \{/ );
        expect( testInt ).to.match( /describe \( 'POST \/testing', function \(\) \{/ );
        expect( testInt ).to.match( /describe \( 'GET \/testing', function \(\) \{/ );
        expect( testInt ).to.match( /describe \( 'GET \/testing\/:id', function \(\) \{/ );
        expect( testInt ).to.match( /describe \( 'PUT \/testing\/:id', function \(\) \{/ );
        expect( testInt ).to.match( /describe \( 'DELETE \/testing\/:id', function \(\) \{/ );
        expect( testInt ).to.match( /describe \( 'GET \/testing\/custom', function \(\) \{/ );
        expect( testInt ).to.match( /message: 'Hello from customAction inside TestingController'/ );

        var testUnit = fs.readFileSync( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'Testing', 'tests', 'unit', 'TestingTest.js' ) );
        expect( testUnit ).to.match( /describe \( 'controllers\.TestingController', function \(\) \{/ );
        expect( testUnit ).to.match( /testEnv \( function \( TestingController, TestingService \) \{/ );
        expect( testUnit ).to.match( /message: 'Hello from customAction inside TestingController'/ );

        done( );
      } );
    } );

    it( 'should have trouble trying to scaffold with the same name', function ( done ) {
      process.chdir( path.join( assetPath, 'my-new-project', 'backend', 'modules' ) );

      exec( path.join( binPath, 'clever-scaffold' ) + ' Testing', function ( err, stdout, stderr ) {
        expect( err ).to.be.null;
        expect( stderr ).to.equal( '' );
        expect( stdout ).to.match( /already exists within/ );
        done( );
      } );
    } );
  } );

  describe( 'frontend seed', function ( ) {
    it( 'should be able to scaffold within the frontend seed', function ( done ) {
      process.chdir( path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules' ) );

      exec( path.join( binPath, 'clever-scaffold' ) + ' TestingScaff', function ( err, stdout, stderr ) {
        expect( err ).to.be.null;
        expect( stderr ).to.equal( '' );

        expect( stdout ).to.not.match( /already exists within/ );

        expect( fs.existsSync( path.join( assetPath, 'my-new-project' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'backend' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'frontend' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'frontend', 'app' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'TestingScaff' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'TestingScaff', 'scripts' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'TestingScaff', 'scripts', 'testing_scaff_controller.js' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'TestingScaff', 'views' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'TestingScaff', 'views', 'index.html' ) ) ).to.be.true;

        var controller = fs.readFileSync( path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'TestingScaff', 'scripts', 'testing_scaff_controller.js' ) );
        expect( controller ).to.match( /ng\.module\('testing_scaff.controllers'\)/ );
        expect( controller ).to.match( /\.controller\('TestingScaffController', \[/ );

        var html = fs.readFileSync( path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'TestingScaff', 'views', 'index.html' ) );
        expect( html ).to.match( /<h1>Example Module<\/h1>/ );

        done( );
      } );
    } );

    it( 'should have trouble trying to scaffold with the same name', function ( done ) {
      process.chdir( path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules' ) );

      exec( path.join( binPath, 'clever-scaffold' ) + ' TestingScaff', function ( err, stdout, stderr ) {
        expect( err ).to.be.null;
        expect( stderr ).to.equal( '' );
        expect( stdout ).to.match( /already exists within/ );
        done( );
      } );
    } );
  } );
} );

var chai      = require( 'chai' )
  , expect    = chai.expect
  , exec      = require('child_process').exec
  , path      = require( 'path' )
  , fs        = require( 'fs' )
  , binPath   = path.join( __dirname, '..', 'bin' )
  , assetPath = path.join( __dirname, 'assets' );

chai.Assertion.includeStack = true;

describe( 'Scaffold', function ( ) {
  describe( 'backend seed', function ( ) {
    it( 'should be able to scaffold within the backend seed', function ( done ) {
      exec( path.join( binPath, 'clever-scaffold' ) + ' Testing', { cwd: path.join( assetPath, 'my-new-project', 'backend', 'modules' ) }, function ( err, stdout, stderr ) {
        expect( stderr ).to.equal( '' );
        expect( stdout ).to.not.match( /already exists within/ );

        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'Testing', 'config', 'default.json' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'Testing', 'controllers', 'TestingController.js' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'Testing', 'models', 'odm', 'TestingModel.js' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'Testing', 'models', 'orm', 'TestingModel.js' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'Testing', 'schema', 'seedData.json' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'Testing', 'services', 'TestingService.js' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'Testing', 'tasks', 'TestingTask.js' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'Testing', 'tests', 'integration', 'TestingTest.js' ) ) ).to.be.true;
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

        done( err );
      } );
    } );

    it( 'should have trouble trying to scaffold with the same name', function ( done ) {
      exec( path.join( binPath, 'clever-scaffold' ) + ' Testing', { cwd: path.join( assetPath, 'my-new-project', 'backend', 'modules' ) }, function ( err, stdout, stderr ) {
        expect( stderr ).to.equal( '' );
        expect( stdout ).to.match( /already exists within/ );
        done( err );
      } );
    } );
  } );

  describe( 'frontend seed', function ( ) {
    it( 'should be able to scaffold within the frontend seed', function ( done ) {
      exec( path.join( binPath, 'clever-scaffold' ) + ' TestingScaff', { cwd: path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules' ) }, function ( err, stdout, stderr ) {
        expect( stderr ).to.equal( '' );

        expect( stdout ).to.not.match( /already exists within/ );

        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'TestingScaff', 'controllers', 'testing_scaff_controller.js' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'TestingScaff', 'directives', 'testing_scaff_directive.js' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'TestingScaff', 'factories', 'testing_scaff_factory.js' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'TestingScaff', 'services', 'testing_scaff_service.js' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'TestingScaff', 'views', 'testing_scaff-view.html' ) ) ).to.be.true;

        var controller = fs.readFileSync( path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'TestingScaff', 'controllers', 'testing_scaff_controller.js' ) );
        expect( controller ).to.match( /ng\.module\('testing_scaff.controllers'\)/ );
        expect( controller ).to.match( /\.controller\('TestingScaffController', \[/ );

        var directive = fs.readFileSync( path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'TestingScaff', 'directives', 'testing_scaff_directive.js' ) );
        expect( directive ).to.match( /ng\.module\('testing_scaff.directives'\)/ );
        expect( directive ).to.match( /\.directive\('TestingScaffDirective', function\(\) {/ );

        var factory = fs.readFileSync( path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'TestingScaff', 'factories', 'testing_scaff_factory.js' ) );
        expect( factory ).to.match( /ng\.module\('testing_scaff.factories'\)/ );
        expect( factory ).to.match( /\.factory\('TestingScaffFactory', function\(\){/ );

        var service = fs.readFileSync( path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'TestingScaff', 'services', 'testing_scaff_service.js' ) );
        expect( service ).to.match( /ng\.module\('testing_scaff.services'\)/ );
        expect( service ).to.match( /\.service\('TestingScaffService', \[/ );

        var html = fs.readFileSync( path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'TestingScaff', 'views', 'testing_scaff-view.html' ) );
        expect( html ).to.match( /<h1>TestingScaff Module<\/h1>/ );

        done( err );
      } );
    } );

    it( 'should have trouble trying to scaffold with the same name', function ( done ) {
      exec( path.join( binPath, 'clever-scaffold' ) + ' TestingScaff', { cwd: path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules' ) }, function ( err, stdout, stderr ) {
        expect( stderr ).to.equal( '' );
        expect( stdout ).to.match( /already exists within/ );
        done( err );
      } );
    } );
  } );
} );

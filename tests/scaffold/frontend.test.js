var chai      = require( 'chai' )
  , expect    = chai.expect
  , exec      = require('child_process').exec
  , path      = require( 'path' )
  , fs        = require( 'fs' )
  , binPath   = path.join( __dirname, '..', '..', 'bin' )
  , assetPath = path.join( __dirname, '..', 'assets' );

chai.Assertion.includeStack = true;

describe( 'Scaffold (frontend seed)', function ( ) {
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

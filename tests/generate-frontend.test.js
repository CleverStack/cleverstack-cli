var chai      = require( 'chai' )
  , expect    = chai.expect
  , exec      = require('child_process').exec
  , path      = require( 'path' )
  , rimraf    = require( 'rimraf' )
  , fs        = require( 'fs' )
  , binPath   = path.join( __dirname, '..', 'bin' )
  , assetPath = path.join( __dirname, 'assets' );

chai.Assertion.includeStack = true;

describe( 'Generate frontend seed', function ( ) {
  describe( 'controller', function ( ) {
    before( function ( done ) {
      rimraf( path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'Testing2' ), done );
    } );

    after( function ( done ) {
      rimraf( path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'Testing2' ), done );
    } );

    it( 'should be able to generate a controller within the frontend seed', function ( done ) {
      exec( path.join( binPath, 'clever-generate' ) + ' controller Testing2', { cwd: path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules' ) }, function ( err, stdout, stderr ) {
        expect( stderr ).to.equal( '' );
        expect( stdout ).to.not.match( /already exists within/ );

        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'Testing2', 'controllers', 'testing2_controller.js' ) ) ).to.be.true;

        var controller = fs.readFileSync( path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'Testing2', 'controllers', 'testing2_controller.js' ) );
        expect( controller ).to.match( /ng\.module\('testing2.controllers'\)/ );
        expect( controller ).to.match( /\.controller\('Testing2Controller', \[/ );

        done( err );
      } );
    } );

    it( 'should have trouble creating an existant controller', function ( done ) {
      exec( path.join( binPath, 'clever-generate' ) + ' controller Testing2', { cwd: path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules' ) }, function ( err, stdout, stderr ) {
        expect( stderr ).to.equal( '' );
        expect( stdout ).to.match( /already exists within/ );
        done( err );
      } );
    } );
  } );

  describe( 'directive', function ( ) {
    before( function ( done ) {
      rimraf( path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'Testing2' ), done );
    } );

    after( function ( done ) {
      rimraf( path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'Testing2' ), done );
    } );

    it( 'should be able to generate a directive within the frontend seed', function ( done ) {
      exec( path.join( binPath, 'clever-generate' ) + ' directive Testing2', { cwd: path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules' ) }, function ( err, stdout, stderr ) {
        expect( stderr ).to.equal( '' );
        expect( stdout ).to.not.match( /already exists within/ );

        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'Testing2', 'directives', 'testing2_directive.js' ) ) ).to.be.true;

        var directive = fs.readFileSync( path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'Testing2', 'directives', 'testing2_directive.js' ) );
        expect( directive ).to.match( /ng\.module\('testing2.directives'\)/ );
        expect( directive ).to.match( /\.directive\('Testing2Directive', function\(\) {/ );

        done( err );
      } );
    } );

    it( 'should have trouble creating an existant directive', function ( done ) {
      exec( path.join( binPath, 'clever-generate' ) + ' directive Testing2', { cwd: path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules' ) }, function ( err, stdout, stderr ) {
        expect( stderr ).to.equal( '' );
        expect( stdout ).to.match( /already exists within/ );
        done( err );
      } );
    } );
  } );

  describe( 'factory', function ( ) {
    before( function ( done ) {
      rimraf( path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'Testing2' ), done );
    } );

    after( function ( done ) {
      rimraf( path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'Testing2' ), done );
    } );

    it( 'should be able to generate a factory within the frontend seed', function ( done ) {
      exec( path.join( binPath, 'clever-generate' ) + ' factory Testing2', { cwd: path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules' ) }, function ( err, stdout, stderr ) {
        expect( stderr ).to.equal( '' );

        expect( stdout ).to.not.match( /already exists within/ );
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'Testing2', 'factories', 'testing2_factory.js' ) ) ).to.be.true;

        var factory = fs.readFileSync( path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'Testing2', 'factories', 'testing2_factory.js' ) );
        expect( factory ).to.match( /ng\.module\('testing2.factories'\)/ );
        expect( factory ).to.match( /\.factory\('Testing2Factory', function\(\){/ );

        done( err );
      } );
    } );

    it( 'should have trouble creating an existant factory', function ( done ) {
      exec( path.join( binPath, 'clever-generate' ) + ' factory Testing2', { cwd: path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules' ) }, function ( err, stdout, stderr ) {
        expect( stderr ).to.equal( '' );
        expect( stdout ).to.match( /already exists within/ );
        done( err );
      } );
    } );
  } );

  describe( 'service', function ( ) {
    before( function ( done ) {
      rimraf( path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'Testing2' ), done );
    } );

    after( function ( done ) {
      rimraf( path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'Testing2' ), done );
    } );

    it( 'should be able to generate a service within the frontend seed', function ( done ) {
      exec( path.join( binPath, 'clever-generate' ) + ' service Testing2', { cwd: path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules' ) }, function ( err, stdout, stderr ) {
        expect( stderr ).to.equal( '' );
        expect( stdout ).to.not.match( /already exists within/ );

        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'Testing2', 'services', 'testing2_service.js' ) ) ).to.be.true;

        var service = fs.readFileSync( path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'Testing2', 'services', 'testing2_service.js' ) );
        expect( service ).to.match( /ng\.module\('testing2.services'\)/ );
        expect( service ).to.match( /\.service\('Testing2Service', \[/ );

        done( err );
      } );
    } );

    it( 'should have trouble creating an existant service', function ( done ) {
      exec( path.join( binPath, 'clever-generate' ) + ' service Testing2', { cwd: path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules' ) }, function ( err, stdout, stderr ) {
        expect( stderr ).to.equal( '' );
        expect( stdout ).to.match( /already exists within/ );
        done( err );
      } );
    } );
  } );

  describe( 'views', function ( ) {
    after( function ( done ) {
      rimraf( path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'Testing2' ), done );
    } );

    it( 'should be able to generate a view within the frontend seed', function ( done ) {
      exec( path.join( binPath, 'clever-generate' ) + ' views Testing2', { cwd: path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules' ) }, function ( err, stdout, stderr ) {
        expect( stderr ).to.equal( '' );
        expect( stdout ).to.not.match( /already exists within/ );

        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'Testing2', 'views', 'testing2-view.html' ) ) ).to.be.true;

        var html = fs.readFileSync( path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'Testing2', 'views', 'testing2-view.html' ) );
        expect( html ).to.match( /<h1>Testing2 Module<\/h1>/ );

        done( err );
      } );
    } );

    it( 'should have trouble creating an existant controller', function ( done ) {
      exec( path.join( binPath, 'clever-generate' ) + ' views Testing2', { cwd: path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules' ) }, function ( err, stdout, stderr ) {
        expect( stderr ).to.equal( '' );
        expect( stdout ).to.match( /already exists within/ );
        done( err );
      } );
    } );
  } );
} );

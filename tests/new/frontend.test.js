var chai      = require( 'chai' )
  , expect    = chai.expect
  , exec      = require('child_process').exec
  , path      = require( 'path' )
  , fs        = require( 'fs' )
  , binPath   = path.join( __dirname, '..', '..', 'bin' )
  , assetPath = path.join( __dirname, '..', 'assets' );

chai.Assertion.includeStack = true;

describe( 'New (frontend seed)', function ( ) {
  it( 'should be able to create a new module within the frontend seed', function ( done ) {
    exec( path.join( binPath, 'clever-new' ) + ' TestingNew', { cwd: path.join( assetPath, 'my-new-project', 'frontend' ) }, function ( err, stdout, stderr ) {
      expect( stderr ).to.equal( '' );

      expect( stdout ).to.not.match( /already exists within/ );

      expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'TestingNew', 'controllers', 'TestingNewController.js' ) ) ).to.be.true;
      expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'TestingNew', 'directives', 'TestingNewDirective.js' ) ) ).to.be.true;
      expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'TestingNew', 'factories', 'TestingNewFactory.js' ) ) ).to.be.true;
      expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'TestingNew', 'services', 'TestingNewService.js' ) ) ).to.be.true;
      expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'TestingNew', 'views', 'TestingNew-view.html' ) ) ).to.be.true;

      var controller = fs.readFileSync( path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'TestingNew', 'controllers', 'TestingNewController.js' ) );
      expect( controller ).to.match( /\.module\(\ 'TestingNew.controllers'\ \)/ );
      expect( controller ).to.match( /\.controller\(\ 'TestingNewController',\ function\(\ \$scope\ \)\ {/ );

      var directive = fs.readFileSync( path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'TestingNew', 'directives', 'TestingNewDirective.js' ) );
      expect( directive ).to.match( /\.module\(\ 'TestingNew.directives'\ \)/ );
      expect( directive ).to.match( /\.directive\(\ 'TestingNewDirective',\ function\(\)\ {/ );

      var factory = fs.readFileSync( path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'TestingNew', 'factories', 'TestingNewFactory.js' ) );
      expect( factory ).to.match( /\.module\(\ 'TestingNew.factories'\ \)/ );
      expect( factory ).to.match( /\.factory\(\ 'TestingNewFactory',\ function\(\)\ {/ );

      var service = fs.readFileSync( path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'TestingNew', 'services', 'TestingNewService.js' ) );
      expect( service ).to.match( /\.module\(\ 'TestingNew.services'\ \)/ );
      expect( service ).to.match( /\.service\(\ 'TestingNewService',\ function\(\ TestingNewModel\ \)\ {/ );

      var html = fs.readFileSync( path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'TestingNew', 'views', 'TestingNew-view.html' ) );
      expect( html ).to.match( /<h1>TestingNew Module<\/h1>/ );

      done( err );
    } );
  } );

  it( 'should have trouble trying to scaffold with the same name', function ( done ) {
    exec( path.join( binPath, 'clever-scaffold' ) + ' TestingNew', { cwd: path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules' ) }, function ( err, stdout, stderr ) {
      expect( stderr ).to.equal( '' );
      expect( stdout ).to.match( /already exists within/ );
      done( err );
    } );
  } );
} );

var chai      = require( 'chai' )
  , expect    = chai.expect
  , exec      = require('child_process').exec
  , path      = require( 'path' )
  , semver    = require( 'semver' )
  , fs        = require( 'fs' )
  , binPath   = path.join( __dirname, '..', 'bin' )
  , assetPath = path.join( __dirname, 'assets' );

chai.Assertion.includeStack = true;

describe( 'Upgrade', function ( ) {
  describe( 'backend', function ( ) {
    it( 'shouldn\'t be able to upgrade if we\'re not in the correct seed (for backend module)', function ( done ) {
      exec( path.join( binPath, 'clever-upgrade' ) + ' clever-orm@0.0.13', { cwd: assetPath }, function ( err, stdout, stderr ) {
        expect( stderr ).to.equal( '' );
        expect( stdout ).to.match( /Couldn't find a seed directory within/ );
        done( err );
      } );
    } );

    it( 'shouldn\'t be able to upgrade a non-existant module', function ( done ) {
      exec( path.join( binPath, 'clever-upgrade' ) + ' nonexistant@0.0.1', { cwd: path.join( assetPath, 'my-new-project', 'backend' ) }, function ( err, stdout, stderr ) {
        expect( stderr ).to.equal( '' );
        expect( stdout ).to.match( /There are no modules to upgrade./ );
        done( err );
      } );
    } );

    it( 'should be able to upgrade', function ( done ) {
      exec( path.join( binPath, 'clever-upgrade' ) + ' backend-example-module@1.0.5', { cwd: path.join( assetPath, 'my-new-project', 'backend' ) }, function ( err, stdout, stderr ) {
        expect( stderr ).to.equal( '' );

        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'backend-example-module', 'package.json' ) ) ).to.be.true;

        if (require.cache[ path.join( assetPath, 'my-new-project', 'backend', 'modules', 'backend-example-module', 'package.json' ) ]) {
          delete require.cache[ require.resolve( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'backend-example-module', 'package.json' ) ) ];
        }

        var pkg = require( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'backend-example-module', 'package.json' ) );
        expect( pkg.name ).to.equal( 'backend-example-module' );
        expect( semver.eq( pkg.version, '1.0.5' ) ).to.true;

        done( err );
      } );
    } );

    it( 'should give us an error if we\'re trying to upgrade to a version that we already have', function ( done ) {
      exec( path.join( binPath, 'clever-upgrade' ) + ' backend-example-module@1.0.5', { cwd: path.join( assetPath, 'my-new-project', 'backend' ) }, function ( err, stdout, stderr ) {
        expect( stderr ).to.equal( '' );
        expect( stdout ).to.match( /backend-example-module is already at version1.0.5/ );
        done( err );
      } );
    } );
  } );

  describe( 'frontend', function ( ) {
    it( 'shouldn\'t be able to upgrade if we\'re not in the correct seed', function ( done ) {
      exec( path.join( binPath, 'clever-upgrade' ) + ' clever-datatables@0.0.3', { cwd: assetPath }, function ( err, stdout, stderr ) {
        expect( stderr ).to.equal( '' );
        expect( stdout ).to.match( /Couldn't find a seed directory within/ );
        done( err );
      } );
    } );

    it( 'shouldn\'t be able to upgrade a non-existant module', function ( done ) {
      exec( path.join( binPath, 'clever-upgrade' ) + ' nonexistant@0.0.1', { cwd: path.join( assetPath, 'my-new-project', 'frontend' ) }, function ( err, stdout, stderr ) {
        expect( stderr ).to.equal( '' );
        expect( stdout ).to.match( /There are no modules to upgrade./ );
        done( err );
      } );
    } );

    it( 'should be able to upgrade', function ( done ) {
      exec( path.join( binPath, 'clever-upgrade' ) + ' clever-datatables@0.0.3', { cwd: path.join( assetPath, 'my-new-project', 'frontend' ) }, function ( err, stdout, stderr ) {
        expect( err ).to.be.null;
        expect( stderr ).to.equal( '' );

        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'cs_datatables', 'bower.json' ) ) ).to.be.true;

        if (require.cache[ path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'cs_datatables', 'bower.json' ) ]) {
          delete require.cache[ require.resolve( path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'cs_datatables', 'bower.json' ) ) ];
        }

        var pkg = require( path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'cs_datatables', 'bower.json' ) );
        expect( pkg.name ).to.equal( 'clever-datatables' );
        expect( semver.eq( pkg.version, '0.0.3' ) ).to.true;

        done( );
      } );
    } );

    it( 'should give us an error if we\'re trying to upgrade to a version that we already have', function ( done ) {
      exec( path.join( binPath, 'clever-upgrade' ) + ' clever-datatables@0.0.3', { cwd: path.join( assetPath, 'my-new-project', 'frontend' ) }, function ( err, stdout, stderr ) {
        expect( err ).to.be.null;
        expect( stderr ).to.equal( '' );
        expect( stdout ).to.match( /clever-datatables is already at version0.0.3/ );
        done( );
      } );
    } );
  } );
} );

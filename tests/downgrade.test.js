var chai      = require( 'chai' )
  , expect    = chai.expect
  , exec      = require('child_process').exec
  , path      = require( 'path' )
  , semver    = require( 'semver' )
  , fs        = require( 'fs' )
  , binPath   = path.join( __dirname, '..', 'bin' )
  , assetPath = path.join( __dirname, 'assets' );

chai.Assertion.includeStack = true;

describe( 'Downgrade', function ( ) {
  describe( 'backend', function ( ) {
    before( function ( done ) {
      // console.log( 'Installing backend-example-module for tests...' );
      exec( path.join( binPath, 'clever-install' ) + ' backend-example-module', { cwd: path.join( assetPath, 'my-new-project', 'backend' ) }, function ( err ) {
        // console.log( 'Done with installing backend-example-module' );
        done( err );
      } );
    } );

    it( 'shouldn\'t be able to downgrade if we\'re not in the correct seed (for backend module)', function ( done ) {
      exec( path.join( binPath, 'clever-downgrade' ) + ' clever-orm@0.0.2', { cwd: assetPath }, function ( err, stdout, stderr ) {
        expect( stderr ).to.equal( '' );
        expect( stdout ).to.match( /Couldn't find a seed directory within/ );
        done( err );
      } );
    } );

    it( 'shouldn\'t be able to downgrade a non-existant module', function ( done ) {
      exec( path.join( binPath, 'clever-downgrade' ) + ' nonexistant@0.0.1', { cwd: path.join( assetPath, 'my-new-project', 'backend' ) }, function ( err, stdout, stderr ) {
        expect( stderr ).to.equal( '' );
        expect( stdout ).to.match( /There are no modules to downgrade./ );
        done( err );
      } );
    } );

    it( 'should be able to downgrade', function ( done ) {
      exec( path.join( binPath, 'clever-downgrade' ) + ' backend-example-module@1.0.5', { cwd: path.join( assetPath, 'my-new-project', 'backend' ) }, function ( err, stdout, stderr ) {
        expect( stderr ).to.equal( '' );

        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'backend-example-module', 'package.json' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'backend', 'node_modules', 'moment' ) ) ).to.be.true;

        if (require.cache[ path.join( assetPath, 'my-new-project', 'backend', 'modules', 'backend-example-module', 'package.json' ) ]) {
          delete require.cache[ require.resolve( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'backend-example-module', 'package.json' ) ) ];
        }

        var pkg = require( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'backend-example-module', 'package.json' ) );
        expect( pkg.name ).to.equal( 'backend-example-module' );
        expect( semver.eq( pkg.version, '1.0.5' ) ).to.true;

        done( err );
      } );
    } );

    it( 'should give us an error if we\'re trying to downgrade to a version that we already have', function ( done ) {
      exec( path.join( binPath, 'clever-downgrade' ) + ' backend-example-module@1.0.5', { cwd: path.join( assetPath, 'my-new-project', 'backend' ) }, function ( err, stdout, stderr ) {
        expect( stderr ).to.equal( '' );
        expect( stdout ).to.match( /backend-example-module is already at version1.0.5/ );
        done( err );
      } );
    } );
  } );

  describe( 'frontend', function ( ) {
    before( function ( done ) {
      // console.log( 'Installing clever-datatables for tests...' );
      exec( path.join( binPath, 'clever-install' ) + ' clever-datatables', { cwd: path.join( assetPath, 'my-new-project', 'frontend' ) }, function ( err ) {
        // console.log( 'Done with installing clever-datatables' );
        done( err );
      } );
    } );

    it( 'shouldn\'t be able to downgrade if we\'re not in the correct seed', function ( done ) {
      exec( path.join( binPath, 'clever-downgrade' ) + ' clever-datatables@0.0.2', { cwd: assetPath }, function ( err, stdout, stderr ) {
        expect( stderr ).to.equal( '' );
        expect( stdout ).to.match( /Couldn't find a seed directory within/ );
        done( err );
      } );
    } );

    it( 'shouldn\'t be able to downgrade a non-existant module', function ( done ) {
      exec( path.join( binPath, 'clever-downgrade' ) + ' nonexistant@0.0.1', { cwd: path.join( assetPath, 'my-new-project', 'frontend' ) }, function ( err, stdout, stderr ) {
        expect( stderr ).to.equal( '' );
        expect( stdout ).to.match( /There are no modules to downgrade./ );
        done( err );
      } );
    } );

    it( 'should be able to downgrade', function ( done ) {
      exec( path.join( binPath, 'clever-downgrade' ) + ' clever-datatables@0.0.1', { cwd: path.join( assetPath, 'my-new-project', 'frontend' ) }, function ( err, stdout, stderr ) {
        expect( stderr ).to.equal( '' );

        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'cs_datatables', 'bower.json' ) ) ).to.be.true;

        if (require.cache[ path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'cs_datatables', 'bower.json' ) ]) {
          delete require.cache[ require.resolve( path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'cs_datatables', 'bower.json' ) ) ];
        }

        var pkg = require( path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'cs_datatables', 'bower.json' ) );
        expect( pkg.name ).to.equal( 'clever-datatables' );
        expect( semver.eq( pkg.version, '0.0.1' ) ).to.true;

        done( err );
      } );
    } );

    it( 'should give us an error if we\'re trying to downgrade to a version that we already have', function ( done ) {
      exec( path.join( binPath, 'clever-downgrade' ) + ' clever-datatables@0.0.1', { cwd: path.join( assetPath, 'my-new-project', 'frontend' ) }, function ( err, stdout, stderr ) {
        expect( stderr ).to.equal( '' );
        expect( stdout ).to.match( /clever-datatables is already at version0.0.1/ );
        done( err );
      } );
    } );
  } );
} );

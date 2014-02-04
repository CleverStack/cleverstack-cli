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
  beforeEach( function ( done ) {
    process.chdir( assetPath );
    done( );
  } );

  describe( 'backend', function ( ) {
    before( function ( done ) {
      console.log( 'Installing clever-auth for tests...' );
      process.chdir( path.join( assetPath, 'my-new-project', 'backend' ) );
      exec( path.join( binPath, 'clever-install' ) + ' clever-auth', function ( err, stdout, stderr ) {
        console.log( 'Done with installing clever-auth' );
        done( );
      } );
    } );

    it( 'shouldn\'t be able to downgrade if we\'re not in the correct seed (for backend module)', function ( done ) {
      process.chdir( path.join( assetPath ) );

      exec( path.join( binPath, 'clever-downgrade' ) + ' clever-orm@0.0.2', function ( err, stdout, stderr ) {
        expect( err ).to.be.null;
        expect( stderr ).to.equal( '' );
        expect( stdout ).to.match( /Couldn't find a seed directory within/ );
        done( );
      } );
    } );

    it( 'shouldn\'t be able to downgrade a non-existant module', function ( done ) {
      process.chdir( path.join( assetPath, 'my-new-project', 'backend' ) );

      exec( path.join( binPath, 'clever-downgrade' ) + ' nonexistant@0.0.1', function ( err, stdout, stderr ) {
        expect( err ).to.be.null;
        expect( stderr ).to.equal( '' );
        expect( stdout ).to.match( /There are no modules to downgrade./ );
        done( );
      } );
    } );

    it( 'should be able to downgrade', function ( done ) {
      process.chdir( path.join( assetPath, 'my-new-project', 'backend' ) );

      exec( path.join( binPath, 'clever-downgrade' ) + ' clever-auth@0.0.1', function ( err, stdout, stderr ) {
        expect( err ).to.be.null;
        expect( stderr ).to.equal( '' );

        expect( fs.existsSync( path.join( assetPath, 'my-new-project' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'backend' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'frontend' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'backend', 'modules' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'clever-auth' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'clever-auth', 'package.json' ) ) ).to.be.true;

        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'backend', 'node_modules', 'passport' ) ) ).to.be.true;

        if (require.cache[ path.join( assetPath, 'my-new-project', 'backend', 'modules', 'clever-auth', 'package.json' ) ]) {
          delete require.cache[ require.resolve( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'clever-auth', 'package.json' ) ) ];
        }

        var pkg = require( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'clever-auth', 'package.json' ) );
        expect( pkg.name ).to.equal( 'clever-auth' );
        expect( semver.eq( pkg.version, '0.0.1' ) ).to.true;

        done( );
      } );
    } );

    it( 'should give us an error if we\'re trying to downgrade to a version that we already have', function ( done ) {
      process.chdir( path.join( assetPath, 'my-new-project', 'backend' ) );

      exec( path.join( binPath, 'clever-downgrade' ) + ' clever-auth@0.0.1', function ( err, stdout, stderr ) {
        expect( err ).to.be.null;
        expect( stderr ).to.equal( '' );
        expect( stdout ).to.match( /clever-auth is already at version0.0.1/ );
        done( );
      } );
    } );
  } );

  describe( 'frontend', function ( ) {
    before( function ( done ) {
      console.log( 'Installing clever-datatables for tests...' );
      process.chdir( path.join( assetPath, 'my-new-project', 'frontend' ) );
      exec( path.join( binPath, 'clever-install' ) + ' clever-datatables', function ( err, stdout, stderr ) {
        console.log( 'Done with installing clever-datatables' );
        done( );
      } );
    } );

    it( 'shouldn\'t be able to downgrade if we\'re not in the correct seed', function ( done ) {
      process.chdir( path.join( assetPath ) );

      exec( path.join( binPath, 'clever-downgrade' ) + ' clever-datatables@0.0.2', function ( err, stdout, stderr ) {
        expect( err ).to.be.null;
        expect( stderr ).to.equal( '' );
        expect( stdout ).to.match( /Couldn't find a seed directory within/ );
        done( );
      } );
    } );

    it( 'shouldn\'t be able to downgrade a non-existant module', function ( done ) {
      process.chdir( path.join( assetPath, 'my-new-project', 'frontend' ) );

      exec( path.join( binPath, 'clever-downgrade' ) + ' nonexistant@0.0.1', function ( err, stdout, stderr ) {
        expect( err ).to.be.null;
        expect( stderr ).to.equal( '' );
        expect( stdout ).to.match( /There are no modules to downgrade./ );
        done( );
      } );
    } );

    it( 'should be able to downgrade', function ( done ) {
      process.chdir( path.join( assetPath, 'my-new-project', 'frontend' ) );

      exec( path.join( binPath, 'clever-downgrade' ) + ' clever-datatables@0.0.1', function ( err, stdout, stderr ) {
        expect( err ).to.be.null;
        expect( stderr ).to.equal( '' );

        expect( fs.existsSync( path.join( assetPath, 'my-new-project' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'backend' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'frontend' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'frontend', 'app' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'cs_datatables' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'cs_datatables', 'bower.json' ) ) ).to.be.true;

        if (require.cache[ path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'cs_datatables', 'bower.json' ) ]) {
          delete require.cache[ require.resolve( path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'cs_datatables', 'bower.json' ) ) ];
        }

        var pkg = require( path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'cs_datatables', 'bower.json' ) );
        expect( pkg.name ).to.equal( 'clever-datatables' );
        expect( semver.eq( pkg.version, '0.0.1' ) ).to.true;

        done( );
      } );
    } );

    it( 'should give us an error if we\'re trying to downgrade to a version that we already have', function ( done ) {
      process.chdir( path.join( assetPath, 'my-new-project', 'frontend' ) );

      exec( path.join( binPath, 'clever-downgrade' ) + ' clever-datatables@0.0.1', function ( err, stdout, stderr ) {
        expect( err ).to.be.null;
        expect( stderr ).to.equal( '' );
        expect( stdout ).to.match( /clever-datatables is already at version0.0.1/ );
        done( );
      } );
    } );
  } );
} );

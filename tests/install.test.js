var chai      = require( 'chai' )
  , expect    = chai.expect
  , exec      = require('child_process').exec
  , path      = require( 'path' )
  , semver    = require( 'semver' )
  , rimraf    = require( 'rimraf' )
  , async     = require( 'async' )
  , fs        = require( 'fs' )
  , binPath   = path.join( __dirname, '..', 'bin' )
  , assetPath = path.join( __dirname, 'assets' );

chai.Assertion.includeStack = true;

describe( 'Install', function ( ) {
  describe( 'should have trouble installing a module', function ( ) {
    it( 'outside of the project\'s scope', function ( done ) {
      exec( path.join( binPath, 'clever-install' ) + ' clever-orm@0.0.2', { cwd: assetPath }, function ( err, stdout, stderr ) {
        expect( stderr ).to.equal( '' );
        expect( stdout ).to.match( /Couldn't find a seed directory within/ );
        done( err );
      } );
    } );

    it( 'with a non-existant version', function ( done ) {
      exec( path.join( binPath, 'clever-install' ) + ' clever-orm@0.0.2', { cwd: path.join( assetPath, 'my-new-project' ) }, function ( err, stdout, stderr ) {
        expect( stderr ).to.equal( '' );
        expect( stdout ).to.match( /Invalid version 0.0.2 for module clever-orm/ );
        done( err );
      } );
    } );

    it( 'a backend module within the frontend seed directory', function ( done ) {
      exec( path.join( binPath, 'clever-install' ) + ' clever-auth', { cwd: path.join( assetPath, 'my-new-project', 'frontend' ) }, function ( err, stdout, stderr ) {
        expect( stderr ).to.equal( '' );
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'clever-auth' ) ) ).to.be.false;
        done( err );
      } );
    } );

    it( 'a frontend module within the backend seed directory', function ( done ) {
      exec( path.join( binPath, 'clever-install' ) + ' clever-datatables', { cwd: path.join( assetPath, 'my-new-project', 'backend' ) }, function ( err, stdout, stderr ) {
        expect( stderr ).to.equal( '' );
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'cs_datatables' ) ) ).to.be.false;
        done( err );
      } );
    } );
  } );

  describe( 'should be able to install a backend module', function ( ) {
    before( function ( done ) {
      if (!fs.existsSync( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'clever-auth', 'package.json' ) )) {
        return done( );
      }

      if (require.cache[ path.join( assetPath, 'my-new-project', 'backend', 'modules', 'clever-auth', 'package.json' ) ]) {
        delete require.cache[ require.resolve( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'clever-auth', 'package.json' ) ) ];
      }

      delete require.cache[ require.resolve( path.join( assetPath, 'my-new-project', 'backend', 'package.json' ) ) ];

      async.parallel( [
        async.apply( rimraf, path.join( assetPath, 'my-new-project', 'backend', 'modules', 'clever-auth' ) ),
        async.apply( rimraf, path.join( assetPath, 'my-new-project', 'backend', 'node_modules', 'passport' ) )
      ],
      done );
    } );

    afterEach( function ( done ) {
      if (require.cache.hasOwnProperty( require.resolve( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'clever-auth', 'package.json' ) ) )) {
        delete require.cache[ require.resolve( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'clever-auth', 'package.json' ) ) ];
      }

      delete require.cache[ require.resolve( path.join( assetPath, 'my-new-project', 'backend', 'package.json' ) ) ];

      async.parallel( [
        async.apply( rimraf, path.join( assetPath, 'my-new-project', 'backend', 'modules', 'clever-auth' ) ),
        async.apply( rimraf, path.join( assetPath, 'my-new-project', 'backend', 'node_modules', 'passport' ) )
      ],
      done );
    } );

    it( 'within the root directory', function ( done ) {
      exec( path.join( binPath, 'clever-install' ) + ' clever-auth', { cwd: path.join( assetPath, 'my-new-project' ) }, function ( err, stdout, stderr ) {
        expect( stderr ).to.equal( '' );

        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'clever-auth', 'package.json' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'backend', 'node_modules', 'passport' ) ) ).to.be.true;

        var pkg = require( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'clever-auth', 'package.json' ) );
        expect( pkg.name ).to.equal( 'clever-auth' );
        expect( semver.gt( pkg.version, '0.0.1' ) ).to.true;

        // we need this here for the tests to pass despite us having a before() block
        delete require.cache[ require.resolve( path.join( assetPath, 'my-new-project', 'backend', 'package.json' ) ) ];

        var projPkg = require( path.join( assetPath, 'my-new-project', 'backend', 'package.json' ) );
        expect( projPkg ).to.have.property( 'bundledDependencies' );
        expect( projPkg.bundledDependencies ).to.include( 'clever-auth' );

        done( err );
      } );
    } );

    it( 'within the backend directory', function ( done ) {
      exec( path.join( binPath, 'clever-install' ) + ' clever-auth', { cwd: path.join( assetPath, 'my-new-project', 'backend' ) }, function ( err, stdout, stderr ) {
        expect( stderr ).to.equal( '' );

        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'clever-auth', 'package.json' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'backend', 'node_modules', 'passport' ) ) ).to.be.true;

        var pkg = require( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'clever-auth', 'package.json' ) );
        expect( pkg.name ).to.equal( 'clever-auth' );
        expect( semver.gt( pkg.version, '0.0.1' ) ).to.true;

        var projPkg = require( path.join( assetPath, 'my-new-project', 'backend', 'package.json' ) );
        expect( projPkg ).to.have.property( 'bundledDependencies' );
        expect( projPkg.bundledDependencies ).to.include( 'clever-auth' );

        done( err );
      } );
    } );

    it( 'with a specific version', function ( done ) {
      exec( path.join( binPath, 'clever-install' ) + ' clever-auth@0.0.1', { cwd: path.join( assetPath, 'my-new-project' ) }, function ( err, stdout, stderr ) {
        expect( stderr ).to.equal( '' );

        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'clever-auth', 'package.json' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'backend', 'node_modules', 'passport' ) ) ).to.be.true;

        var pkg = require( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'clever-auth', 'package.json' ) );
        expect( pkg.name ).to.equal( 'clever-auth' );
        expect( pkg.version ).to.equal( '0.0.1' );

        var projPkg = require( path.join( assetPath, 'my-new-project', 'backend', 'package.json' ) );
        expect( projPkg ).to.have.property( 'bundledDependencies' );
        expect( projPkg.bundledDependencies ).to.include( 'clever-auth' );

        done( err );
      } );
    } );
  } );

  describe( 'should be able to install a frontend module', function ( ) {
    afterEach( function ( done ) {
      delete require.cache[ require.resolve( path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'cs_datatables', 'bower.json' ) ) ];
      async.parallel( [
        async.apply( rimraf, path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'cs_datatables' ) )
      ],
      done );
    } );

    it( 'within the root directory', function ( done ) {
      exec( path.join( binPath, 'clever-install' ) + ' clever-datatables', { cwd: path.join( assetPath, 'my-new-project' ) }, function ( err, stdout, stderr ) {
        expect( stderr ).to.equal( '' );
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'cs_datatables', 'bower.json' ) ) ).to.be.true;

        var pkg = require( path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'cs_datatables', 'bower.json' ) );
        expect( pkg.name ).to.equal( 'clever-datatables' );
        expect( pkg.version ).to.not.equal( '0.0.1' );

        done( err );
      } );
    } );

    it( 'within the frontend directory', function ( done ) {
      exec( path.join( binPath, 'clever-install' ) + ' clever-datatables', { cwd: path.join( assetPath, 'my-new-project', 'frontend' ) }, function ( err, stdout, stderr ) {
        expect( stderr ).to.equal( '' );
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'cs_datatables', 'bower.json' ) ) ).to.be.true;

        var pkg = require( path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'cs_datatables', 'bower.json' ) );
        expect( pkg.name ).to.equal( 'clever-datatables' );
        expect( pkg.version ).to.not.equal( '0.0.1' );

        done( err );
      } );
    } );

    it( 'with a specific version', function ( done ) {
      exec( path.join( binPath, 'clever-install' ) + ' clever-datatables@0.0.1', { cwd: path.join( assetPath, 'my-new-project' ) }, function ( err, stdout, stderr ) {
        expect( stderr ).to.equal( '' );
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'cs_datatables', 'bower.json' ) ) ).to.be.true;

        var pkg = require( path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'cs_datatables', 'bower.json' ) );
        expect( pkg.name ).to.equal( 'clever-datatables' );
        expect( pkg.version ).to.equal( '0.0.1' );

        done( err );
      } );
    } );
  } );
} );

var chai      = require( 'chai' )
  , expect    = chai.expect
  , exec      = require('child_process').exec
  , path      = require( 'path' )
  , crypto    = require( 'crypto' )
  , fs        = require( 'fs' )
  , binPath   = path.join( __dirname, '..', 'bin' )
  , assetPath = path.join( __dirname, 'assets' );

chai.Assertion.includeStack = true;

describe( 'Remove', function ( ) {
  beforeEach( function ( done ) {
    process.chdir( assetPath );
    done( );
  } );

  before( function ( done ) {
    console.log( 'Installing clever-auth and clever-datatables for tests...' );
    process.chdir( path.join( assetPath, 'my-new-project' ) );

    exec( path.join( binPath, 'clever-install' ) + ' clever-auth', function ( ) {
      console.log( '... done' );
      done( );
    } );
  } );

  describe( 'it should fail', function ( ) {
    it( 'to remove a non-existant module', function ( done ) {
      process.chdir( path.join( assetPath, 'my-new-project' ) );

      var moduleName = crypto.randomBytes( 20 ).toString( 'hex' );
      exec( path.join( binPath, 'clever-remove' ) + ' ' + moduleName, function ( err, stdout, stderr ) {
        expect( err ).to.be.null;
        expect( stderr ).to.equal( '' );
        expect( stdout ).to.match( /There are no modules to remove./ );
        done( );
      } );
    } );

    it( 'to remove an existant module, but in the wrong seed (frontend module)', function ( done ) {
      process.chdir( path.join( assetPath, 'my-new-project', 'backend' ) );

      exec( path.join( binPath, 'clever-remove' ) + ' clever-datatables', function ( err, stdout, stderr ) {
        expect( err ).to.be.null;
        expect( stderr ).to.equal( '' );
        expect( stdout ).to.match( /There are no modules to remove./ );
        done( );
      } );
    } );

    it( 'to remove an existant module, but in the wrong seed (backend module)', function ( done ) {
      process.chdir( path.join( assetPath, 'my-new-project', 'frontend' ) );

      exec( path.join( binPath, 'clever-remove' ) + ' clever-auth', function ( err, stdout, stderr ) {
        expect( err ).to.be.null;
        expect( stderr ).to.equal( '' );
        expect( stdout ).to.match( /There are no modules to remove./ );
        done( );
      } );
    } );
  } );

  describe( 'should not fail', function ( ) {
    it( 'should remove a backend module', function ( done ) {
      process.chdir( path.join( assetPath, 'my-new-project' ) );

      exec( path.join( binPath, 'clever-remove' ) + ' clever-auth', function ( err, stdout, stderr ) {
        expect( err ).to.be.null;
        expect( stderr ).to.equal( '' );
        expect( fs.existsSync( path.join( assetPath, 'my-new-project' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'backend' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'frontend' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'backend', 'modules' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'clever-auth' ) ) ).to.be.false;

        if (require.cache[ path.join( assetPath, 'my-new-project', 'backend', 'package.json' ) ]) {
          delete require.cache[ require.resolve( path.join( assetPath, 'my-new-project', 'backend', 'package.json' ) ) ];
        }

        var projPkg = require( path.join( assetPath, 'my-new-project', 'backend', 'package.json' ) );
        expect( projPkg ).to.have.property( 'bundledDependencies' );
        expect( projPkg.bundledDependencies ).to.not.include( 'clever-auth' );

        done( );
      } );
    } );

    it( 'should remove a frontend module', function ( done ) {
      process.chdir( path.join( assetPath, 'my-new-project' ) );

      exec( path.join( binPath, 'clever-remove' ) + ' clever-datatables', function ( err, stdout, stderr ) {
        expect( err ).to.be.null;
        expect( stderr ).to.equal( '' );
        expect( fs.existsSync( path.join( assetPath, 'my-new-project' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'backend' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'frontend' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'cs_datatables' ) ) ).to.be.false;

        done( );
      } );
    } );
  } );
} );

var chai      = require( 'chai' )
  , expect    = chai.expect
  , exec      = require('child_process').exec
  , path      = require( 'path' )
  , rimraf    = require( 'rimraf' )
  , async     = require( 'async' )
  , fs        = require( 'fs' )
  , binPath   = path.join( __dirname, '..', '..', 'bin' )
  , assetPath = path.join( __dirname, '..', 'assets' );

describe( 'Init (these tests will take a long time)', function ( ) {
  after( function ( done ) {
    fs.readdir( assetPath, function ( err, dirs ) {
      async.each( dirs, function ( dir, next ) {
        // always keep .gitkeep and we'll use my-new-project within other tests
        // to help reduce total test time and rebuilding projects
        if ([ '.gitkeep', 'my-new-project' ].indexOf( dir ) > -1) {
          return next( );
        }

        rimraf( path.join( assetPath, dir ), next );
      }, done );
    } );
  } );

  describe( 'should be able to initialize a new project with both backend and frontend', function ( ) {
    it( 'with no other modules', function ( done ) {
      exec( path.join( binPath, 'clever-init' ) + ' --skip-protractor my-new-project', { cwd: assetPath }, function ( err, stdout, stderr ) {
        expect( stderr ).to.equal( '' );
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'backend' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'frontend' ) ) ).to.be.true;

        var pkgPath   = path.join( assetPath, 'my-new-project', 'backend', 'package.json' );
        var pkgPath2  = path.join( assetPath, 'my-new-project', 'frontend', 'package.json' );
        var bowerPath = path.join( assetPath, 'my-new-project', 'frontend', 'bower.json' );

        expect( fs.existsSync( pkgPath ) ).to.be.true;
        expect( fs.existsSync( pkgPath2 ) ).to.be.true;
        expect( fs.existsSync( bowerPath ) ).to.be.true;

        var pkgJson   = require( pkgPath );
        var pkgJson2  = require( pkgPath2 );

        expect( pkgJson.name ).to.equal( 'cleverstack-node-seed' );
        expect( pkgJson2.name ).to.equal( 'cleverstack-angular-seed' );

        // todo: Talk to team about angular-seed and bower
        done( err );
      } );
    } );

    it( 'with modules', function ( done ) {
      exec( path.join( binPath, 'clever-init' ) + ' --skip-protractor my-new-project2 clever-background-tasks clever-datatables', { cwd: assetPath }, function ( err, stdout, stderr ) {
        expect( stderr ).to.equal( '' );
        expect( fs.existsSync( path.join( assetPath, 'my-new-project2', 'backend' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project2', 'frontend' ) ) ).to.be.true;

        var pkgPath   = path.join( assetPath, 'my-new-project2', 'backend', 'package.json' );
        var pkgPath2  = path.join( assetPath, 'my-new-project2', 'frontend', 'package.json' );
        var bowerPath = path.join( assetPath, 'my-new-project2', 'frontend', 'bower.json' );

        expect( fs.existsSync( pkgPath ) ).to.be.true;
        expect( fs.existsSync( pkgPath2 ) ).to.be.true;
        expect( fs.existsSync( bowerPath ) ).to.be.true;

        var pkgJson   = require( pkgPath );
        var pkgJson2  = require( pkgPath2 );

        expect( pkgJson.name).to.equal( 'cleverstack-node-seed' );
        expect( pkgJson2.name).to.equal( 'cleverstack-angular-seed' );

        expect( fs.existsSync( path.join( assetPath, 'my-new-project2', 'backend', 'modules', 'clever-background-tasks' ) ) ).to.be.true;

        expect( fs.existsSync( path.join( assetPath, 'my-new-project2', 'frontend', 'app', 'modules', 'cs_datatables' ) ) ).to.be.true;

        var csData = path.join( assetPath, 'my-new-project2', 'frontend', 'app', 'modules', 'cs_datatables', 'bower.json' );
        expect( fs.existsSync( csData ) ).to.be.true;

        var csJson = require( csData );
        expect( csJson.name ).to.equal( 'clever-datatables' );

        done( err );
      } );
    } );

    it( 'should not be able to initialize a new project with the same name', function ( done ) {
      exec( path.join( binPath, 'clever-init' ) + ' --skip-protractor my-new-project', { cwd: assetPath }, function ( err, stdout, stderr ) {
        expect( stderr ).to.equal( '' );
        expect( stdout ).to.match( /Can't create project my-new-project due to a folder named my-new-project existing in/ );
        done( err );
      } );
    } );
  } );
} );

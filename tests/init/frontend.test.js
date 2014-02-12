var chai    = require( 'chai' )
  , expect  = chai.expect
  , exec    = require('child_process').exec
  , path    = require( 'path' )
  , rimraf  = require( 'rimraf' )
  , async   = require( 'async' )
  , fs      = require( 'fs' )
  , binPath   = path.join( __dirname, '..', '..', 'bin' )
  , assetPath = path.join( __dirname, '..', 'assets' );

describe( 'Initialize with the just the frontend seed', function ( ) {
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

  it( 'should install', function ( done ) {
    exec( path.join( binPath, 'clever-init' ) + ' --skip-protractor my-new-project4 frontend', { cwd: assetPath }, function ( err, stdout, stderr ) {
      expect( stderr ).to.equal( '' );
      expect( fs.existsSync( path.join( assetPath, 'my-new-project4', 'backend' ) ) ).to.be.false;
      expect( fs.existsSync( path.join( assetPath, 'my-new-project4', 'frontend' ) ) ).to.be.true;

      var pkgPath = path.join( assetPath, 'my-new-project4', 'frontend', 'package.json' );

      expect( fs.existsSync( pkgPath ) ).to.be.true;

      var pkgJson = require( pkgPath );
      expect( pkgJson.name ).to.equal( 'cleverstack-angular-seed' );

      done( err );
    } );
  } );
} );

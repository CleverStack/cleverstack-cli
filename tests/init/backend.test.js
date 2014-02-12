var chai    = require( 'chai' )
  , expect  = chai.expect
  , exec    = require('child_process').exec
  , path    = require( 'path' )
  , rimraf  = require( 'rimraf' )
  , async   = require( 'async' )
  , fs      = require( 'fs' )
  , binPath   = path.join( __dirname, '..', '..', 'bin' )
  , assetPath = path.join( __dirname, '..', 'assets' );

describe( 'Init with just the backend', function ( ) {
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
    exec( path.join( binPath, 'clever-init' ) + ' --skip-protractor my-new-project3 backend', { cwd: assetPath }, function ( err, stdout, stderr ) {
      expect( stderr ).to.equal( '' );
      expect( fs.existsSync( path.join( assetPath, 'my-new-project3', 'backend' ) ) ).to.be.true;
      expect( fs.existsSync( path.join( assetPath, 'my-new-project3', 'frontend' ) ) ).to.be.false;

      var pkgPath   = path.join( assetPath, 'my-new-project3', 'backend', 'package.json' );

      expect( fs.existsSync( pkgPath ) ).to.be.true;

      var pkgJson = require( pkgPath );
      expect( pkgJson.name ).to.equal( 'cleverstack-node-seed' );

      done( err );
    } );
  } );
} );

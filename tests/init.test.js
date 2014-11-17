var chai      = require( 'chai' )
  , expect    = chai.expect
  , exec      = require('child_process').exec
  , path      = require( 'path' )
  , rimraf    = require( 'rimraf' )
  , async     = require( 'async' )
  , fs        = require( 'fs' )
  , binPath   = path.join( __dirname, '..', 'bin' )
  , assetPath = path.join( __dirname, 'assets' );

function tap ( options, done ) {
  var modules = [ ].concat( options.args || [ ], options.backendModules || [ ], options.frontendModules || [ ] )
    , command = path.join( binPath, 'clever-init' ) + ' -f -S ' + options.name + (modules.length > 0 ? ' ' + modules.join( ' ' ) : '' );

  exec( command, { cwd: assetPath }, function ( err, stdout, stderr ) {
    expect( stderr ).to.equal( '' );

    if (options.backend === true) {
      var backendPath = ( options.frontend === true )
            ? path.join( assetPath, options.name, 'backend' )
            : path.join( assetPath, options.name );

      expect( fs.existsSync( backendPath ) ).to.be.true;
      var pkgPath = path.join( backendPath, 'package.json' )
        , pkgJson = require( pkgPath );

      expect( fs.existsSync( pkgPath ) ).to.be.true;
      expect( pkgJson.name ).to.equal( 'node-seed' );
    } else {
      expect( fs.existsSync( path.join( assetPath, options.name, 'backend' ) ) ).to.be.false;
    }

    if (options.frontend === true) {
      var frontendPath = ( options.backend === true )
            ? path.join( assetPath, options.name, 'frontend' )
            : path.join( assetPath, options.name );

      expect( fs.existsSync( frontendPath ) ).to.be.true;
      var pkgPath2  = path.join( frontendPath, 'package.json' )
        , bowerPath = path.join( frontendPath, 'bower.json' );

      expect( fs.existsSync( pkgPath2 ) ).to.be.true;
      expect( fs.existsSync( bowerPath ) ).to.be.true;

      var pkgJson2  = require( pkgPath2 );
      expect( pkgJson2.name ).to.equal( 'angular-seed' );
    } else {
      expect( fs.existsSync( path.join( assetPath, options.name, 'frontend' ) ) ).to.be.false;
    }

    done( err );
  } );
}

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
      tap( {
        name: 'my-new-project',
        frontend: true,
        backend: true
      }, done );
    } );

    it( 'with modules', function ( done ) {
      tap( {
        name: 'my-new-project2',
        backend: true,
        frontend: true,
        backendModules: [ 'backend-example-module' ],
        frontendModules: [ 'clever-datatables' ]
      }, function ( err ) {
        expect( fs.existsSync( path.join( assetPath, 'my-new-project2', 'backend', 'modules', 'backend-example-module' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project2', 'frontend', 'app', 'modules', 'cs_datatables' ) ) ).to.be.true;

        var csData = path.join( assetPath, 'my-new-project2', 'frontend', 'app', 'modules', 'cs_datatables', 'bower.json' );
        expect( fs.existsSync( csData ) ).to.be.true;

        var csJson = require( csData );
        expect( csJson.name ).to.equal( 'clever-datatables' );

        done( err );
      } );
    } );

    it( 'backend', function ( done ) {
      tap( {
        name: 'my-new-project3',
        args: [ 'backend' ],
        frontend: false,
        backend: true
      }, done );
    } );

    it( 'frontend', function ( done ) {
      tap( {
        name: 'my-new-project4',
        args: [ 'frontend' ],
        frontend: true,
        backend: false
      }, done );
    } );

    it( 'should not be able to initialize a new project with the same name', function ( done ) {
      exec( path.join( binPath, 'clever-init' ) + ' --skip-protractor my-new-project', { cwd: assetPath }, function ( err, stdout ) {
        expect( stdout ).to.match( /folder already exists/ );
        done( err );
      } );
    } );
  } );
} );

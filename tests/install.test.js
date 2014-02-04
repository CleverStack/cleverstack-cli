var chai    = require( 'chai' )
  , expect  = chai.expect
  , exec    = require('child_process').exec
  , spawn   = require('child_process').spawn
  , path    = require( 'path' )
  , semver  = require( 'semver' )
  , rimraf  = require( 'rimraf' )
  , async   = require( 'async' )
  , fs      = require( 'fs' )
  , binPath = path.join( __dirname, '..', 'bin' )

var assetPath = path.join( __dirname, 'assets' );

describe( 'Install', function ( ) {
  beforeEach( function ( done ) {
    process.chdir( assetPath );
    done( );
  } );

  describe( 'should have trouble installing a module', function ( ) {
    it( 'outside of the project\'s scope', function ( done ) {
      process.chdir( path.join( assetPath ) );

      exec( path.join( binPath, 'clever-install' ) + ' clever-orm@0.0.2', function ( err, stdout, stderr ) {
        expect( err ).to.be.null;
        expect( stderr ).to.equal( '' );
        expect( stdout ).to.match( /Couldn't find a seed directory within/ );
        done( );
      } );
    } );

    it( 'with a non-existant version', function ( done ) {
      process.chdir( path.join( assetPath, 'my-new-project' ) );

      exec( path.join( binPath, 'clever-install' ) + ' clever-orm@0.0.2', function ( err, stdout, stderr ) {
        expect( err ).to.be.null;
        expect( stderr ).to.equal( '' );
        expect( stdout ).to.match( /Invalid version 0.0.2 for module clever-orm/ );
        done( );
      } );
    } );

    it( 'a backend module within the frontend seed directory', function ( done ) {
      process.chdir( path.join( assetPath, 'my-new-project', 'frontend' ) );

      exec( path.join( binPath, 'clever-install' ) + ' clever-orm', function ( err, stdout, stderr ) {
        expect( err ).to.be.null;
        expect( stderr ).to.equal( '' );
        expect( fs.existsSync( path.join( assetPath, 'my-new-project' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'backend' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'frontend' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'backend', 'modules' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'clever-orm' ) ) ).to.be.false;

        done( );
      } );
    } );

    it( 'a frontend module within the backend seed directory', function ( done ) {
      process.chdir( path.join( assetPath, 'my-new-project', 'backend' ) );

      exec( path.join( binPath, 'clever-install' ) + ' clever-datatables', function ( err, stdout, stderr ) {
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

  describe( 'should be able to install a backend module', function ( ) {
    // before( function ( done ) {
    //   if (!fs.existsSync( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'clever-orm', 'package.json' ) )) {
    //     return done( );
    //   }

    //   if (require.cache[ path.join( assetPath, 'my-new-project', 'backend', 'modules', 'clever-orm', 'package.json' ) ]) {
    //     delete require.cache[ require.resolve( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'clever-orm', 'package.json' ) ) ];
    //   }

    //   delete require.cache[ require.resolve( path.join( assetPath, 'my-new-project', 'backend', 'package.json' ) ) ];

    //   async.parallel( [
    //     async.apply( rimraf, path.join( assetPath, 'my-new-project', 'backend', 'modules', 'clever-orm' ) ),
    //     async.apply( rimraf, path.join( assetPath, 'my-new-project', 'backend', 'node_modules', 'mysql' ) ),
    //     async.apply( rimraf, path.join( assetPath, 'my-new-project', 'backend', 'node_modules', 'sequelize' ) )
    //   ],
    //   done );
    // } );

    afterEach( function ( done ) {
      if (require.cache.hasOwnProperty( require.resolve( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'clever-orm', 'package.json' ) ) )) {
        delete require.cache[ require.resolve( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'clever-orm', 'package.json' ) ) ];
      }

      delete require.cache[ require.resolve( path.join( assetPath, 'my-new-project', 'backend', 'package.json' ) ) ];

      async.parallel( [
        async.apply( rimraf, path.join( assetPath, 'my-new-project', 'backend', 'modules', 'clever-orm' ) ),
        async.apply( rimraf, path.join( assetPath, 'my-new-project', 'backend', 'node_modules', 'mysql' ) ),
        async.apply( rimraf, path.join( assetPath, 'my-new-project', 'backend', 'node_modules', 'sequelize' ) )
      ],
      done );
    } );

    it( 'within the root directory', function ( done ) {
      process.chdir( path.join( assetPath, 'my-new-project' ) );

      var proc = spawn( path.join( binPath, 'clever-install' ), [ 'clever-orm' ] );

      proc.stdout.on( 'data', function ( data ) {
        var str = data + '';
        switch ( str ) {
        case str.match(/Database username/):
        case str.match(/Database password/):
        case str.match(/Database name/):
          proc.stdin.write( 'db\n' );
          break;
        default:
          proc.stdin.write( '\n' );
        }
      } );

      proc.on( 'exit', function ( code ) {
        expect( code ).to.equal( 0 );
        expect( fs.existsSync( path.join( assetPath, 'my-new-project' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'backend' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'frontend' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'backend', 'modules' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'clever-orm' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'clever-orm', 'package.json' ) ) ).to.be.true;

        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'backend', 'node_modules', 'sequelize' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'backend', 'node_modules', 'mysql' ) ) ).to.be.true;

        var pkg = require( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'clever-orm', 'package.json' ) );
        expect( pkg.name ).to.equal( 'clever-orm' );
        expect( semver.gt( pkg.version, '0.0.1' ) ).to.true;

        // we need this here for the tests to pass despite us having a before() block
        delete require.cache[ require.resolve( path.join( assetPath, 'my-new-project', 'backend', 'package.json' ) ) ];

        var projPkg = require( path.join( assetPath, 'my-new-project', 'backend', 'package.json' ) );
        expect( projPkg ).to.have.property( 'bundledDependencies' );
        expect( projPkg.bundledDependencies ).to.include( 'clever-orm' );

        done( );
      } );
    } );

    it( 'within the backend directory', function ( done ) {
      process.chdir( path.join( assetPath, 'my-new-project', 'backend' ) );

      var proc = spawn( path.join( binPath, 'clever-install' ), [ 'clever-orm' ] );

      proc.stdout.on( 'data', function ( data ) {
        var str = data + '';
        switch ( str ) {
        case str.match(/Database username/):
        case str.match(/Database password/):
        case str.match(/Database name/):
          proc.stdin.write( 'db\n' );
          break;
        default:
          proc.stdin.write( '\n' );
        }
      } );

      proc.stderr.on('data', function (data) {
        console.log('stderr: ' + data);
      });

      proc.on( 'exit', function ( code ) {
        expect( code ).to.equal( 0 );

        expect( fs.existsSync( path.join( assetPath, 'my-new-project' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'backend' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'frontend' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'backend', 'modules' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'clever-orm' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'clever-orm', 'package.json' ) ) ).to.be.true;

        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'backend', 'node_modules', 'sequelize' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'backend', 'node_modules', 'mysql' ) ) ).to.be.true;

        var pkg = require( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'clever-orm', 'package.json' ) );
        expect( pkg.name ).to.equal( 'clever-orm' );
        expect( semver.gt( pkg.version, '0.0.1' ) ).to.true;

        var projPkg = require( path.join( assetPath, 'my-new-project', 'backend', 'package.json' ) );
        expect( projPkg ).to.have.property( 'bundledDependencies' );
        expect( projPkg.bundledDependencies ).to.include( 'clever-orm' );

        done( );
      } );
    } );

    it( 'with a specific version', function ( done ) {
      process.chdir( path.join( assetPath, 'my-new-project' ) );

      exec( path.join( binPath, 'clever-install' ) + ' clever-orm@0.0.1', function ( err, stdout, stderr ) {
        expect( err ).to.be.null;
        expect( stderr ).to.equal( '' );

        expect( fs.existsSync( path.join( assetPath, 'my-new-project' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'backend' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'frontend' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'backend', 'modules' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'clever-orm' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'clever-orm', 'package.json' ) ) ).to.be.true;

        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'backend', 'node_modules', 'sequelize' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'backend', 'node_modules', 'mysql' ) ) ).to.be.true;

        var pkg = require( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'clever-orm', 'package.json' ) );
        expect( pkg.name ).to.equal( 'clever-orm' );
        expect( pkg.version ).to.equal( '0.0.1' );

        var projPkg = require( path.join( assetPath, 'my-new-project', 'backend', 'package.json' ) );
        expect( projPkg ).to.have.property( 'bundledDependencies' );
        expect( projPkg.bundledDependencies ).to.include( 'clever-orm' );

        done( );
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
      process.chdir( path.join( assetPath, 'my-new-project' ) );

      exec( path.join( binPath, 'clever-install' ) + ' clever-datatables', function ( err, stdout, stderr ) {
        expect( err ).to.be.null;
        expect( stderr ).to.equal( '' );

        expect( fs.existsSync( path.join( assetPath, 'my-new-project' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'backend' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'frontend' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'frontend', 'app' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'cs_datatables' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'cs_datatables', 'bower.json' ) ) ).to.be.true;

        var pkg = require( path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'cs_datatables', 'bower.json' ) );
        expect( pkg.name ).to.equal( 'clever-datatables' );
        expect( pkg.version ).to.not.equal( '0.0.1' );

        done( );
      } );
    } );

    it( 'within the frontend directory', function ( done ) {
      process.chdir( path.join( assetPath, 'my-new-project', 'frontend' ) );

      exec( path.join( binPath, 'clever-install' ) + ' clever-datatables', function ( err, stdout, stderr ) {
        expect( err ).to.be.null;
        expect( stderr ).to.equal( '' );

        expect( fs.existsSync( path.join( assetPath, 'my-new-project' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'backend' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'frontend' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'frontend', 'app' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'cs_datatables' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'cs_datatables', 'bower.json' ) ) ).to.be.true;

        var pkg = require( path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'cs_datatables', 'bower.json' ) );
        expect( pkg.name ).to.equal( 'clever-datatables' );
        expect( pkg.version ).to.not.equal( '0.0.1' );

        done( );
      } );
    } );

    it( 'with a specific version', function ( done ) {
      process.chdir( path.join( assetPath, 'my-new-project' ) );

      exec( path.join( binPath, 'clever-install' ) + ' clever-datatables@0.0.1', function ( err, stdout, stderr ) {
        expect( err ).to.be.null;
        expect( stderr ).to.equal( '' );

        expect( fs.existsSync( path.join( assetPath, 'my-new-project' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'backend' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'frontend' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'frontend', 'app' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'cs_datatables' ) ) ).to.be.true;
        expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'cs_datatables', 'bower.json' ) ) ).to.be.true;

        var pkg = require( path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'cs_datatables', 'bower.json' ) );
        expect( pkg.name ).to.equal( 'clever-datatables' );
        expect( pkg.version ).to.equal( '0.0.1' );

        done( );
      } );
    } );
  } );
} );

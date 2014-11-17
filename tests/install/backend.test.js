var chai      = require( 'chai' )
  , expect    = chai.expect
  , exec      = require('child_process').exec
  , path      = require( 'path' )
  , semver    = require( 'semver' )
  , rimraf    = require( 'rimraf' )
  , async     = require( 'async' )
  , fs        = require( 'fs' )
  , binPath   = path.join( __dirname, '..', '..', 'bin' )
  , assetPath = path.join( __dirname, '..', 'assets' );

chai.Assertion.includeStack = true;

describe( 'Install with a backend module', function ( ) {
    before( function ( done ) {
        if ( !fs.existsSync( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'backend-example-module', 'package.json' ) ) ) {
            return done();
        }

        if ( require.cache[ path.join( assetPath, 'my-new-project', 'backend', 'modules', 'backend-example-module', 'package.json' ) ] ) {
            delete require.cache[ require.resolve( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'backend-example-module', 'package.json' ) ) ];
        }

        delete require.cache[ require.resolve( path.join( assetPath, 'my-new-project', 'backend', 'package.json' ) ) ];

        async.parallel( [
            async.apply( rimraf, path.join( assetPath, 'my-new-project', 'backend', 'modules', 'backend-example-module' ) ),
        ],
        done );
    } );

    afterEach( function ( done ) {
        if ( require.cache.hasOwnProperty( require.resolve( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'backend-example-module', 'package.json' ) ) ) ) {
            delete require.cache[ require.resolve( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'backend-example-module', 'package.json' ) ) ];
        }

        delete require.cache[ require.resolve( path.join( assetPath, 'my-new-project', 'backend', 'package.json' ) ) ];

        async.parallel( [
            async.apply( rimraf, path.join( assetPath, 'my-new-project', 'backend', 'modules', 'backend-example-module' ) ),
        ],
        done );
    } );

    it( 'within the root directory', function( done ) {
        var proc = exec( path.join( binPath, 'clever-install' ) + ' backend-example-module -v', { cwd: path.join( assetPath, 'my-new-project' ) }, function ( err, stdout, stderr ) {
            
            expect( stderr ).to.equal( '' );

            expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'backend-example-module', 'package.json' ) ) ).to.be.true;

            var pkg = require( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'backend-example-module', 'package.json' ) );
            expect( pkg.name ).to.equal( 'backend-example-module' );
            expect( semver.gt( pkg.version, '0.0.1' ) ).to.true;

            // we need this here for the tests to pass despite us having a before() block
            delete require.cache[ require.resolve( path.join( assetPath, 'my-new-project', 'backend', 'package.json' ) ) ];

            var projPkg = require( path.join( assetPath, 'my-new-project', 'backend', 'package.json' ) );
            expect( projPkg ).to.have.property( 'bundledDependencies' );
            expect( projPkg.bundledDependencies ).to.include( 'backend-example-module' );

            done( err );
        } );

        proc.stdout.pipe( process.stdout );
        proc.stderr.pipe( process.stdout );
    } );

    it( 'within the backend directory', function( done ) {
        var proc = exec( path.join( binPath, 'clever-install' ) + ' backend-example-module', { cwd: path.join( assetPath, 'my-new-project', 'backend' ) }, function ( err, stdout, stderr ) {
            expect( stderr ).to.equal( '' );

            expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'backend-example-module', 'package.json' ) ) ).to.be.true;

            var pkg = require( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'backend-example-module', 'package.json' ) );
            expect( pkg.name ).to.equal( 'backend-example-module' );
            expect( semver.gt( pkg.version, '0.0.1' ) ).to.true;

            var projPkg = require( path.join( assetPath, 'my-new-project', 'backend', 'package.json' ) );
            expect( projPkg ).to.have.property( 'bundledDependencies' );
            expect( projPkg.bundledDependencies ).to.include( 'backend-example-module' );

            done( err );
        });

        proc.stdout.pipe( process.stdout );
        proc.stderr.pipe( process.stdout );
    });

    it( 'with a specific version', function( done ) {
        var proc = exec( path.join( binPath, 'clever-install' ) + ' backend-example-module@1.0.1', { cwd: path.join( assetPath, 'my-new-project' ) }, function ( err, stdout, stderr ) {
            expect( stderr ).to.equal( '' );

            expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'backend-example-module', 'package.json' ) ) ).to.be.true;

            var pkg = require( path.join( assetPath, 'my-new-project', 'backend', 'modules', 'backend-example-module', 'package.json' ) );
            expect( pkg.name ).to.equal( 'backend-example-module' );
            expect( pkg.version ).to.equal( '1.0.1' );

            var projPkg = require( path.join( assetPath, 'my-new-project', 'backend', 'package.json' ) );
            expect( projPkg ).to.have.property( 'bundledDependencies' );
            expect( projPkg.bundledDependencies ).to.include( 'backend-example-module' );

            done( err );
        });

        proc.stdout.pipe( process.stdout );
        proc.stderr.pipe( process.stdout );
    });
} );

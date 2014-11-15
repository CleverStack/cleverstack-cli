var chai      = require( 'chai' )
    , expect    = chai.expect
    , exec      = require('child_process').exec
    , path      = require( 'path' )
    , rimraf    = require( 'rimraf' )
    , async     = require( 'async' )
    , fs        = require( 'fs' )
    , binPath   = path.join( __dirname, '..', '..', 'bin' )
    , assetPath = path.join( __dirname, '..', 'assets' );

chai.Assertion.includeStack = true;

describe( 'Install with a frontend module', function ( ) {
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

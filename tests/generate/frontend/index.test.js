var chai      = require( 'chai' )
  , expect    = chai.expect
  , path      = require( 'path' )
  , rimraf    = require( 'rimraf' )
  , exec      = require('child_process').exec
  , assetPath = path.join( __dirname, '..', '..', 'assets' )
  , keg = {
    controller: require( path.join( __dirname, 'controllers' ) ),
    directive:  require( path.join( __dirname, 'directives' ) ),
    factory:    require( path.join( __dirname, 'factories' ) ),
    service:    require( path.join( __dirname, 'services' ) ),
    views:      require( path.join( __dirname, 'views' ) )
  }

chai.Assertion.includeStack = true;

var tap = {
  success: function ( cmd, err, stderr, stdout, done ) {
    expect( stderr ).to.equal( '' );
    expect( stdout ).to.not.match( /already exists within/ );
    keg[ cmd ].tap( done );
  },
  fail: function ( cmd, err, stderr, stdout, done ) {
    expect( stderr ).to.equal( '' );
    expect( stdout ).to.match( /already exists within/ );
    done( err );
  }
};

function run ( cmd, status, fn ) {
  exec( path.join( __dirname, '..', '..', '..', 'bin', 'clever-generate' ) + ' ' + cmd + ' Testing2', { cwd: path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules' ) }, function ( err, stderr, stdout ) {
    if (!!err) {
      return fn( err );
    }

    tap[ status ]( stderr, stdout, fn );
  } );
}

describe( 'Generate frontend', function ( ) {
  beforeEach( function ( done ) {
    rimraf( path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'Testing2' ), done );
  } );

  afterEach( function ( done ) {
    rimraf( path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'Testing2' ), done );
  } );

  it( 'controller', function ( done ) {
    run( 'controller', 'success', done );
  } );

  it( 'controller fail', function ( done ) {
    run( 'controller', 'fail', done );
  } );

  it( 'directive', function ( done ) {
    run( 'directive', 'success', done );
  } );

  it( 'directive fail', function ( done ) {
    run( 'directive', 'fail', done );
  } );

  it( 'factory', function ( done ) {
    run( 'factory', 'success', done );
  } );

  it( 'factory fail', function ( done ) {
    run( 'factory', 'fail', done );
  } );

  it( 'service', function ( done ) {
    run( 'serivce', 'success', done );
  } );

  it( 'service fail', function ( done ) {
    run( 'service', 'fail', done );
  } );

  it( 'views', function ( done ) {
    run( 'views', 'success', done );
  } );

  it( 'views fail', function ( done ) {
    run( 'views', 'fail', done );
  } );
} );

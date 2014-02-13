var chai      = require( 'chai' )
  , expect    = chai.expect
  , exec      = require('child_process').exec
  , path      = require( 'path' )
  , fs        = require( 'fs' )
  , binPath   = path.join( __dirname, '..', '..', '..', 'bin' )
  , assetPath = path.join( __dirname, '..', '..', 'assets' );

exports.tap = function ( done ) {
  exec( path.join( binPath, 'clever-generate' ) + ' directive Testing2', { cwd: path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules' ) }, function ( err, stdout, stderr ) {
    expect( stderr ).to.equal( '' );
    expect( stdout ).to.not.match( /already exists within/ );

    expect( fs.existsSync( path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'Testing2', 'directives', 'testing2_directive.js' ) ) ).to.be.true;

    var directive = fs.readFileSync( path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules', 'Testing2', 'directives', 'testing2_directive.js' ) );
    expect( directive ).to.match( /ng\.module\('testing2.directives'\)/ );
    expect( directive ).to.match( /\.directive\('Testing2Directive', function\(\) {/ );

    done( err );
  } );
}

exports.tapfail = function ( done ) {
  exec( path.join( binPath, 'clever-generate' ) + ' directive Testing2', { cwd: path.join( assetPath, 'my-new-project', 'frontend', 'app', 'modules' ) }, function ( err, stdout, stderr ) {
    expect( stderr ).to.equal( '' );
    expect( stdout ).to.match( /already exists within/ );
    done( err );
  } );
}

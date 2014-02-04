var chai    = require( 'chai' )
  , expect  = chai.expect
  , exec    = require('child_process').exec
  , path    = require( 'path' )
  , crypto  = require( 'crypto' )
  , binPath = path.join( __dirname, '..', 'bin' );

chai.Assertion.includeStack = true;

describe( 'Search', function( ) {
  it( 'should be able to list a backend module', function ( done ) {
    exec( path.join( binPath, 'clever-search' ) + ' clever-orm', function ( err, stdout, stderr ) {
      expect( err ).to.be.null;
      expect( stderr ).to.equal( '' );

      expect( stdout ).to.match( new RegExp( [
        '\\u001b\\[38;5;68mSearching through NPM packages...\\u001b\\[39m',
        '\\u001b\\[38;5;68mSearching through Bower packages\\u001b\\[39m',
        '\\u001b\\[38;5;68mSearching through Bower packages for clever\\-orm...\\u001b\\[39m',
        '\\u001b\\[38;5;112mFound 1 module\\u001b\\[39m'
      ].join( '\\n' ) ) );

      expect( stdout ).to.match( new RegExp( [
        '\\u001b\\[38;5;172mclever-orm \\u001b\\[38;5;8m@ \\d+\\.\\d+\\.\\d+\\u001b\\[39m\\u001b\\[39m',
        '\\u001b\\[38;5;7mhttps://github.com/CleverStack/clever-orm.git\\u001b\\[39m',
        '\\u001b\\[38;5;250mClevertech ORM \\(SQL\\) Module for CleverStack\\u001b\\[39m'
      ].join( '\\n' ) ) );

      done( );
    } );
  } );

  it( 'should be able to list a frontend module', function ( done ) {
    exec( path.join( binPath, 'clever-search' ) + ' clever-datatables', function ( err, stdout, stderr ) {
      expect( err ).to.be.null;
      expect( stderr ).to.equal( '' );

      expect( stdout ).to.match( new RegExp( [
        '\\u001b\\[38;5;68mSearching through NPM packages...\\u001b\\[39m',
        '\\u001b\\[38;5;68mSearching through Bower packages\\u001b\\[39m',
        '\\u001b\\[38;5;68mSearching through Bower packages for clever\\-datatables...\\u001b\\[39m',
        '\\u001b\\[38;5;112mFound 1 module\\u001b\\[39m'
      ].join( '\\n' ) ) );

      expect( stdout ).to.match( new RegExp( [
        '\\u001b\\[96mclever-datatables\\u001b\\[39m',
        '\\u001b\\[38;5;7mgit://github.com/CleverStack/clever-datatables.git\\u001b\\[39m',
        '\\u001b\\[38;5;250mThis module provides a directive to create jQuery dataTables.\\u001b\\[39m'
      ].join( '\\n' ) ) );

      done( );
    } );
  } );

  it( 'should be able to search for both frontend and backend modules', function ( done ) {
    exec( path.join( binPath, 'clever-search' ) + ' clever-orm clever-datatables', function ( err, stdout, stderr ) {
      expect( err ).to.be.null;
      expect( stderr ).to.equal( '' );

      expect( stdout ).to.match( new RegExp( [
        '\\u001b\\[38;5;68mSearching through NPM packages...\\u001b\\[39m',
        '\\u001b\\[38;5;68mSearching through Bower packages\\u001b\\[39m',
        '\\u001b\\[38;5;68mSearching through Bower packages for clever\\-orm...\\u001b\\[39m',
        '\\u001b\\[38;5;68mSearching through Bower packages for clever\\-datatables...\\u001b\\[39m',
        '\\u001b\\[38;5;112mFound 2 modules\\u001b\\[39m'
      ].join( '\\n' ) ) );

      expect( stdout ).to.match( new RegExp( [
        '\\u001b\\[96mclever-datatables\\u001b\\[39m',
        '\\u001b\\[38;5;7mgit://github.com/CleverStack/clever-datatables.git\\u001b\\[39m',
        '\\u001b\\[38;5;250mThis module provides a directive to create jQuery dataTables.\\u001b\\[39m'
      ].join( '\\n' ) ) );

      expect( stdout ).to.match( new RegExp( [
        '\\u001b\\[38;5;172mclever-orm \\u001b\\[38;5;8m@ \\d+\\.\\d+\\.\\d+\\u001b\\[39m\\u001b\\[39m',
        '\\u001b\\[38;5;7mhttps://github.com/CleverStack/clever-orm.git\\u001b\\[39m',
        '\\u001b\\[38;5;250mClevertech ORM \\(SQL\\) Module for CleverStack\\u001b\\[39m'
      ].join( '\\n' ) ) );

      done( );
    } );
  } );

  it( 'shouldn\'t be able to find a non existant module', function ( done ) {
    var pkgName = 'clever-' + crypto.randomBytes( 12 ).toString( 'hex' );
    exec( path.join( binPath, 'clever-search' ) + ' ' + pkgName, function ( err, stdout, stderr ) {
      expect( err ).to.be.null;
      expect( stderr ).to.equal( '' );

      expect( stdout ).to.match( new RegExp( [
        '\\u001b\\[38;5;68mSearching through NPM packages...\\u001b\\[39m',
        '\\u001b\\[38;5;68mSearching through Bower packages\\u001b\\[39m',
        '\\u001b\\[38;5;68mSearching through Bower packages for ' + pkgName.replace( '-', '\\-' ) + '...\\u001b\\[39m',
        '\\u001b\\[38;5;1mCouldn\'t find any modules that were compatible with CleverStack\.\\u001b\\[39m'
      ].join( '\\n' ) ) );

      done( );
    } );
  } );
} );

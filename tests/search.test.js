var chai    = require( 'chai' )
  , expect  = chai.expect
  , exec    = require('child_process').exec
  , path    = require( 'path' )
  , crypto  = require( 'crypto' )
  , binPath = path.join( __dirname, '..', 'bin' )
  , assetPath = path.join( __dirname, 'assets' );

chai.Assertion.includeStack = true;

describe( 'Search', function( ) {
  it( 'should be able to list a backend module', function ( done ) {
    exec( path.join( binPath, 'clever-search' ) + ' clever-orm', { cwd: assetPath }, function ( err, stdout, stderr ) {
      expect( stderr ).to.equal( '' );

      expect( stdout ).to.match( /Searching NPM\.\.\./ );
      expect( stdout ).to.match( /Searching Bower\.\.\./ );
      expect( stdout ).to.match( /Found 1 module/ );

      expect( stdout ).to.match( /clever\-orm/ );
      expect( stdout ).to.match( /https:\/\/github.com\/CleverStack\/clever\-orm.git/ );
      expect( stdout ).to.match( /CleverStack ORM \(SQL\) Module/ );

      done( err );
    } );
  } );

  it( 'should be able to list a frontend module', function ( done ) {
    exec( path.join( binPath, 'clever-search' ) + ' clever-datatables', { cwd: assetPath }, function ( err, stdout, stderr ) {
      expect( stderr ).to.equal( '' );

      expect( stdout ).to.match( /Searching NPM\.\.\./ );
      expect( stdout ).to.match( /Searching Bower\.\.\./ );
      expect( stdout ).to.match( /Found 1 module/ );

      expect( stdout ).to.match( /clever\-datatables/ );
      expect( stdout ).to.match( /git:\/\/github.com\/CleverStack\/clever\-datatables.git/ );
      expect( stdout ).to.match( /This module provides a directive to create jQuery dataTables./ );

      done( err );
    } );
  } );

  it( 'should be able to search for both frontend and backend modules', function ( done ) {
    exec( path.join( binPath, 'clever-search' ) + ' clever-orm clever-datatables', { cwd: assetPath }, function ( err, stdout, stderr ) {
      expect( stderr ).to.equal( '' );

      expect( stdout ).to.match( /Searching NPM\.\.\./ );
      expect( stdout ).to.match( /Searching Bower\.\.\./ );
      expect( stdout ).to.match( /Found 2 modules/ );

      expect( stdout ).to.match( /clever\-datatables/ );
      expect( stdout ).to.match( /git:\/\/github.com\/CleverStack\/clever\-datatables.git/ );
      expect( stdout ).to.match( /This module provides a directive to create jQuery dataTables./ );

      expect( stdout ).to.match( /clever\-orm/ );
      expect( stdout ).to.match( /https:\/\/github.com\/CleverStack\/clever\-orm.git/ );
      expect( stdout ).to.match( /CleverStack ORM \(SQL\) Module/ );

      done( err );
    } );
  } );

  it( 'shouldn\'t be able to find a non existant module', function ( done ) {
    var pkgName = 'clever-' + crypto.randomBytes( 12 ).toString( 'hex' );
    exec( path.join( binPath, 'clever-search' ) + ' ' + pkgName, { cwd: assetPath }, function ( err, stdout, stderr ) {
      expect( stderr ).to.equal( '' );

      expect( stdout ).to.match( /Searching NPM\.\.\./ );
      expect( stdout ).to.match( /Searching Bower\.\.\./ );
      expect( stdout ).to.match( /Couldn't find any modules that were compatible with CleverStack\./ );

      done( err );
    } );
  } );
} );

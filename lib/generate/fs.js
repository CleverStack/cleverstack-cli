var Promise = require( 'bluebird' )
  , path    = require( 'path' )
  , async   = require( 'async' )
  , mkdirp  = require( 'mkdirp' )
  , fs      = require( 'fs' )
  , paths   = require( path.join( __dirname, 'paths' ) );

/**
 * Adds a list of directories
 *
 * @param  {String[]}   dirs Directories to add
 * @return {Promise}         Returns a promise
 * @api private
 */

var makeDirs = exports.makeDirs = function ( dirs ) {
  var def = Promise.defer( );

  async.each( dirs, function ( dir, next ) {
    mkdirp( dir, next );
  },
  function ( err ) {
    if (!!err) {
      return def.reject( err );
    }

    def.resolve( dirs );
  } );

  return def.promise;
}

/**
 * Creates directories within the seed
 *
 * @param  {Object}   project Object returned from project.locations( )
 * @param  {String[]} tmpls   An array of which templates to create
 * @param  {String}   names   Name of the module
 * @return {Promise}          Returns a promise
 * @api public
 */

exports.touchDirs = function ( project, tmpls, names ) {
  var def   = Promise.defer( )
    , dirs  = [ ]
    , walk  = require( 'findit' )( path.join( __dirname, '..', '..', 'templates', project.name ) );

  walk.on( 'directory', function ( dir ) {
    var hasSubFolder    = tmpls.indexOf( dir.split( path.sep ).splice( -2 )[ 0 ] ) > -1
      , hasParentFolder = tmpls.indexOf( dir.split( path.sep ).splice( -1 )[ 0 ] ) > -1
      , inFolder        = hasSubFolder || hasParentFolder
      , isNotBasename   = path.basename( dir ) !== project.name;

    if (isNotBasename && inFolder) {
      names.forEach( function ( name ) {
        dirs.push( dir.replace( path.resolve( path.join( __dirname, '..', '..', 'templates', project.name ) ), paths.getModulePath( project, name ) ) );
      } );
    }
  } );

  walk.on( 'end', function ( ) {
    makeDirs( dirs ).then( function ( dirs ) {
      def.resolve( dirs );
    }, function ( err ) {
      def.reject( err );
    } );
  } );

  return def.promise;
}

/**
 * Checks to see if generating conflicts with any files/folders already created
 *
 * @param  {Object} project Object returned from project.locations( )
 * @param  {String[]} dirs  An array of dir paths
 * @param  {String[]} tmpls An array of templates
 * @param  {String[]} names An array of names to generate
 * @return {Promise}        Returns a promise from bluebird
 * @api public
 */

exports.checkFiles = function ( project, dirs, tmpls, names ) {
  var def   = Promise.defer( )
    , found = false;

  async.each( names, function ( name, next ) {
    async.each( tmpls, function ( tmpl, _next ) {
      var walk = require( 'findit' )( path.join( __dirname, '..', '..', 'templates', project.name, tmpl ) );
      walk.on( 'file', function ( file ) {
        var realPath = path.resolve( file.replace( path.join( __dirname, '..', '..', 'templates', project.name, tmpl ), path.join( paths.getModulePath( project, name ), tmpl ) ) )
          , realName = paths.fileName( file.split( path.sep ).splice( -1 ).join( path.sep ), name );

        if (fs.existsSync( realPath.replace( file.split( path.sep ).reverse( )[ 0 ], realName ) )) {
          found = path.join( realPath, realName );
        }
      } );

      walk.on( 'end', function ( ) {
        _next( found === false ? null : found.split( path.sep ).reverse( )[ 0 ] + ' already exists within ' + found.split( path.sep ).splice( -1 ) );
      }, next );
    }, function ( err ) {
      if (!!err) {
        def.reject( err );
      } else {
        def.resolve( );
      }
    } );
  } );

  return def.promise;
}


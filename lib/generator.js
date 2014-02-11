var path    = require( 'path' )
  , mkdirp  = require( 'mkdirp' )
  , async   = require( 'async' )
  , es      = require( 'event-stream' )
  , fs      = require( 'fs' )
  , Promise = require( 'bluebird' )
  , tcase   = require( 't-case' )
  , Project = require( path.join( __dirname, 'project' ) )
  , utils   = require( path.join( __dirname, 'utils' ) );

/**
 * Returns the template path for a specific seed
 *
 * @param  {Object} project Object returned from project.locations( )
 * @param  {String} name    Name of the seed
 * @return {String}         Path to the template
 * @api private
 */

function getTemplatePath( project, name ) {
  return path.resolve( [__dirname, '..', 'templates', project.name].concat( name ).join( path.sep ) );
}

/**
 * Returns module's path
 *
 * @param  {Object} project Object returned from project.locations( )
 * @param  {String} name    Name of the module
 * @return {String}         Path to the module
 * @api public
 */

var getModulePath = exports.getModulePath = function ( project, name ) {
  var n = name.split( path.sep );
  var moduleName = n.splice( -1 )[0];

  var proj = project.useCWD === true ? process.cwd( ) : path.join( project.moduleDir, project.modulePath );
  return path.resolve( [ proj ].concat( n.length > 0 ? n.join( path.sep ) : [ ], moduleName ).join( path.sep ) );
}

/**
 * Creates directories within the seed
 *
 * @param  {Object}   project Object returned from project.locations( )
 * @param  {String[]} tmpls   An array of which templates to create
 * @param  {String}   names   Name of the module
 * @param  {Callback} fn      Callback function
 * @return {Function}         Returns fn
 * @api private
 */

function touchDirs( project, tmpls, names, fn ) {
  tmpls = Array.isArray( tmpls ) ? tmpls : [ tmpls ];

  var dirs = [ ]
    , walk = require( 'findit' )( path.join( __dirname, '..', 'templates', project.name ) );

  walk.on( 'directory', function ( dir ) {
    if (path.basename( dir ) !== project.name && ( tmpls.indexOf( dir.split( path.sep ).splice( -2 )[ 0 ] ) > -1 || tmpls.indexOf( dir.split( path.sep ).splice( -1 )[ 0 ] ) > -1 )) {
      names.forEach( function ( name ) {
        dirs.push( dir.replace( path.resolve( path.join( __dirname, '..', 'templates', project.name ) ), getModulePath( project, name ) ) );
      } );
    }
  } );

  walk.on( 'end', function ( ) {
    async.each( dirs, function ( dir, next ) {
      mkdirp( dir, next );
    },
    function ( err ) {
      fn( err, dirs );
    } );
  } );
}

/**
 * Checks to see if generating conflicts with any files/folders already created
 *
 * @param  {Object} project Object returned from project.locations( )
 * @param  {String[]} dirs  An array of dir paths
 * @param  {String[]} tmpls An array of templates
 * @param  {String[]} names An array of names to generate
 * @return {Promise}        Returns a promise from bluebird
 * @api private
 */

function checkFiles( project, dirs, tmpls, names ) {
  tmpls = Array.isArray( tmpls ) ? tmpls : [ tmpls ];

  var def   = Promise.defer( )
    , found = false;

  async.each( names, function ( name, next ) {
    async.each( tmpls, function ( tmpl, _next ) {
      var walk = require( 'findit' )( path.join( __dirname, '..', 'templates', project.name, tmpl ) );
      walk.on( 'file', function ( file ) {
        var realPath = path.resolve( file.replace( path.join( __dirname, '..', 'templates', project.name, tmpl ), path.join( getModulePath( project, name ), tmpl) ) )
          , realName = fileName( file.split( path.sep ).splice( -1 ).join( path.sep ), name );

        if (fs.existsSync( realPath.replace( file.split( path.sep ).reverse( )[ 0 ], realName ) )) {
          found = path.join( realPath, realName );
        }
      } );

      walk.on( 'end', function ( ) {
        if (found === false) {
          _next( );
        } else {
          _next( found.split( path.sep ).reverse( )[ 0 ] + ' already exists within ' + found.split( path.sep ).splice( -1 ) );
        }
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

/**
 * Returns the correct filename from templates
 *
 * @param  {String} templateName Template's file name
 * @param  {String} name         Module's name
 * @return {String}              New file name
 * @api private
 */

function fileName( templateName, name ) {
  name = templateName
          .replace( 'Template', tcase.snakeCase( name.replace( /s$/i, '' ) ) )
          .replace( 'template', tcase.classCase( name.replace( /s$/i, '' ) ) );

  return name;
}

/**
 * Transforms the file from a template to the actual module
 *
 * @param  {String}   from Path to the file to convert from
 * @param  {String}   to   Path to convert the file into
 * @param  {String}   name Name of the module
 * @param  {Function} fn   Callback functions
 * @return {Function}      Returns fn
 * @api private
 */

function transformFile( from, to, name, fn ) {
  var file  = fs.createWriteStream( to );
  var read  = fs.createReadStream( from, { encoding: 'utf-8' } )
    .pipe( es.replace( '{{Template}}',        tcase.classCase( name ) ) )
    .pipe( es.replace( '{{TemplateName}}',    tcase.classCase( name ) ) )
    .pipe( es.replace( '{{template-name}}',   tcase.paramCase( name ) ) )
    .pipe( es.replace( '{{_template_}}',      tcase.snakeCase( name ) ) )
    .pipe( es.replace( '{{template_name}}',   tcase.snakeCase( name ) ) )
    .pipe( file );

  read.on( 'error', fn );

  file
    .on( 'error', fn )
    .on( 'close', function ( ) {
      fn( null,  to );
    } );
}

/**
 * Compiles a list of files to transform
 *
 * @param  {String[]}   dirs    Path to directories to look into
 * @param  {String[]}   names   Module names
 * @param  {String[]}   tmpls   Which templates we want from the seed
 * @param  {Object}     project Object returned from project.locations( )
 * @param  {Function}   fn      Callback functions
 * @return {Functions}          Returns fn
 * @api private
 */

function renderTemplate( dirs, names, tmpls, project, fn ) {
  var files = [ ];

  tmpls = Array.isArray( tmpls ) ? tmpls : [tmpls];

  async.each( names, function ( name, next ) {
    async.each( tmpls, function ( tmpl, _next) {
      var filter = path.join( getModulePath( project, name ), tmpl );

      async.eachSeries( dirs.filter( function ( dir ) {
        return filter.indexOf( dir ) > -1;
      } ), function ( dir, __next ) {
        var _files = [];
        var templateHome = getTemplatePath( project, tmpl );
        var finder = require( 'findit' )( templateHome );

        finder.on( 'file', function ( file ) {
          _files.push( file );
        } );

        finder.on( 'end', function ( ) {
          async.eachSeries( _files, function ( file, ___next ) {
            var _fileName = name.split( path.sep ).splice( -1 )[ 0 ];

            if (_fileName[ _fileName.length-1 ] === "s") {
              _fileName = _fileName.substr( 0, _fileName.length-1 );
            }

            var fileName  = file.replace( templateHome, '' )
                                .replace( 'Template', tcase.snakeCase( _fileName ) )
                                .replace( 'template', tcase.classCase( _fileName ) )
              , from      = file
              , to        = path.resolve( path.join( getModulePath( project, name ) , tmpl, fileName  ) );

            transformFile( from, to, name, function ( err, filePath) {
              if (!!err) {
                return ___next( err );
              }

              files.push( filePath );

              ___next( );
            } );
          }, function ( err ) {
            __next( err );
          } );
        } );
      }, _next );
    }, next );
  },
  function ( err ) {
    fn( err, files );
  } );
}

/**
 * Executes the generation process
 *
 * @param  {Object[]}   projects Objects returned from project.locations( )
 * @param  {String[]}   tmpls    An array of which templates to take from
 * @param  {String[]}   names    Names of the modules
 * @param  {Function}   fn       Callback functions
 * @return {Function}            Returns fn
 * @api private
 */

function generateRun( projects, tmpls, names, fn ) {
  projects = Array.isArray( projects ) ? projects : [projects];

  async.each( projects, function ( project, next ) {
    touchDirs( project, tmpls, names, function ( err, dirs ) {
      if (!!err) {
        return utils.fail( err );
      }

      checkFiles( project, dirs, tmpls, names )
      .then( function ( ) {
        renderTemplate( dirs, names, tmpls, project, function ( err, files ) {
          if (!!err) {
            return utils.fail( err );
          }

          files.forEach( function ( file ) {
            utils.success( 'Created ' + file );
          } );

          next( );
        } );
      }, function ( err ) {
        utils.fail( err );
      } );
    }, function ( err ) {
      utils.fail( err );
    } )
  }, fn );
}

/**
 * Helper function for scaffold vs generate
 *
 * @param  {Object}     project Object returned from project.locations( )
 * @param  {String[]}   tmpls   An array of which templates to look into
 * @param  {String[]}   names   An array of module names
 * @param  {Function}   fn      Callback function
 * @return {Function}           Returns fn
 * @api public
 */

exports.generate = function( project, tmpls, names, fn ) {
  if (arguments.length < 4) {
    fn        = names;
    names     = tmpls;
    tmpls     = project;
    project  = null;
  }

  fn    = typeof fn === "function" ? fn : function noop ( ) { };
  names = Array.isArray( names ) ? names : [ names ];

  if (!!project) {
    generateRun( project, tmpls, names, fn );
  } else {
    Project.locations( true ).then( function ( projects ) {
      generateRun( projects, tmpls, names, fn );
    }, fn );
  }
}

/**
 * Generates a scaffold
 *
 * @param  {Object}     project   Object returned by project.locations( )
 * @param  {String}     name      Name of the module
 * @param  {String[]}   filterOut Which templates to filter out
 * @param  {Function}   fn        Callback function
 * @return {Function}             Returns fn
 * @api private
 */

function generateScaffold ( project, name, filterOut, fn ) {
  var walk  = require( 'findit' )( path.join( __dirname, '..', 'templates', project.name ) )
    , dirs  = [ ]
    , files = [ ]
    , found = false
    , modPath = getModulePath( project, name );

  walk.on( 'directory', function ( dir ) {
    dirs.push( modPath + dir.replace( path.join( __dirname, '..', 'templates', project.name ), '' ) );
  } );

  walk.on( 'file', function ( file ) {
    var to = fileName( file.replace( path.join( __dirname, '..', 'templates', project.name ), modPath ), name );
    if (fs.existsSync( to )) {
      found = true;
    }

    files.push( { from: file, to: to } );
  } );

  walk.on( 'end', function ( ) {
    if (found === true) {
      return utils.fail( name + ' already exists within ' + modPath );
    }

    async.each( dirs, mkdirp, function ( err ) {
      if (!!err) {
        return fn( err );
      }

      async.each( files, function ( file, next ) {
        transformFile( file.from, file.to, name, next );
      }, fn );
    } );
  } );
}

/**
 * Scaffolds into a new module directory
 *
 * @param  {Object[]}   projects  Objects returned from project.locations( )
 * @param  {String}     name      Name of the module
 * @param  {String[]}   filterOut Which templates that you want to exclude
 * @param  {Function}   fn        Callback functions
 * @return {Function}             Returns fn
 * @api public
 */

exports.newModule = function ( projects, name, filterOut, fn ) {
  projects = Array.isArray( projects ) ? projects : [ projects ];

  async.each( projects, function ( project, next ) {
    generateScaffold( project, name, filterOut, next );
  }, fn );
}

/**
 * Scaffolds a project within process.cwd( )
 *
 * @param  {Object}     project   Object returned from project.locations( )
 * @param  {String}     name      Name of the module
 * @param  {String[]}   filterOut Which templates you want to exclude
 * @param  {Function}   fn        Callback functions
 * @return {Functions}            Returns fn
 * @api private
 */

function scaffoldProject ( project, name, filterOut, fn ) {
  project.useCWD = true;

  generateScaffold( project, name, filterOut, fn );
}

/**
 * Helper function to scaffold projects
 *
 * @param  {String}     name      Name of the module
 * @param  {String[]}   filterOut Which templates you want to exclude
 * @param  {Function}   fn        Callback function
 * @return {Functions}            Returns fn
 * @api public
 */

module.exports.scaffold = function( name, filterOut, fn ) {
  filterOut = Array.isArray( filterOut ) ? filterOut : [];

  // Just for easability, we'll add an 's' to the end of the filters to cover a quasi-plural form
  filterOut = filterOut.concat(
    filterOut.map( function ( filter ) {
      return filter === "factory" ? 'factories' : filter + 's';
    } )
  );

  Project.locations( ).then( function ( projects ) {
    async.each( projects, function ( p, next ) {
      scaffoldProject( p, name, filterOut, next );
    }, function ( err ) {
      if (!!err) {
        return utils.fail( err );
      }

      utils.success( 'Scaffold complete.' );

      if (typeof fn === "function") {
        return fn( );
      }
    } );
  } )
  .error( fn );
}

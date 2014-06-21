var path      = require( 'path' )
  , async     = require( 'async' )
  , fs        = require( 'fs' )
  , util      = GLOBAL.lib.util
  , utils     = GLOBAL.lib.utils
  , generator = require( path.join( __dirname, 'generate', 'index' ) );

/**
 * Executes the generation process
 *
 * @param  {Object[]}   projects Objects returned from util.locations.get( )
 * @param  {String[]}   tmpls    An array of which templates to take from
 * @param  {String[]}   names    Names of the modules
 * @param  {Function}   fn       Callback functions
 * @return {Function}            Returns fn
 * @api private
 */

function generateRun( projects, tmpls, names, fn ) {
  async.each(
    projects,
    function( project, next ) {
      generator.fs
        .touchDirs( project, tmpls, names )
        .then( function ( dirs ) {
          return generator
            .fs
            .checkFiles( project, dirs, tmpls, names )
            .then( function() {})
            .return( dirs );
        })
        .then( function( dirs ) {
          generator
            .render
            .template( dirs, names, tmpls, project, function( err, files ) {
              if ( !!err ) {
                return fn( err );
              }

              files.forEach( function( file ) {
                utils.success( 'Created ' + file );
              });

              next();
            });
        },
        function( err ) {
          utils.fail( err );
        })
        .catch( function( err ) {
          fn( err );
        });
    },
    fn
  );
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
  if ( arguments.length < 4 ) {
    fn        = names;
    names     = tmpls;
    tmpls     = project;
    project   = null;
  }

  fn      = typeof fn === "function" ? fn : function noop ( ) { };
  names   = Array.isArray( names ) ? names : [ names ];
  tmpls   = Array.isArray( tmpls ) ? tmpls : [ tmpls ];

  if ( !!project ) {
    project = Array.isArray( project ) ? project : [ project ];
    generateRun( project, tmpls, names, fn );
  } else {
    util
      .locations
      .get( true )
      .then( function( projects ) {
        projects = Array.isArray( projects ) ? projects : [ projects ];
        generateRun( projects, tmpls, names, fn );
      }, fn );
  }
}

/**
 * Generates a scaffold
 *
 * @param  {Object}     project   Object returned by util.locations.get( )
 * @param  {String}     name      Name of the module
 * @param  {String[]}   filterOut Which templates to filter out
 * @param  {Function}   fn        Callback function
 * @return {Function}             Returns fn
 * @api private
 */

function generateScaffold( project, name, filterOut, fn ) {
  var _path = path.join( __dirname, '..', 'templates', project.name )
    , walk  = require( 'findit' )( _path )
    , dirs  = []
    , files = []
    , found = false
    , modPath = generator.paths.getModulePath( project, name );

  walk.on( 'directory', function( dir ) {
    dirs.push( modPath + dir.replace( _path, '' ) );
  });

  walk.on( 'file', function( file ) {
    var to = generator.paths.fileName( file.replace( _path, modPath ), name );
    if (fs.existsSync( to )) {
      found = true;
    }

    files.push( { from: file, to: to } );
  });

  walk.on( 'end', function() {
    if ( found === true ) {
      return utils.fail( name + ' already exists within ' + modPath );
    }

    generator
      .fs
      .makeDirs( dirs )
      .then( function() {
        async.each(
          files,
          function( file, next ) {
            generator.render.transformFile( file.from, file.to, name, next );
          },
          fn
        );
      }, fn );
  });
}

/**
 * Scaffolds into a new module directory
 *
 * @param  {Object[]}   projects  Objects returned from util.locations.get( )
 * @param  {String[]}   names     Names of the module
 * @param  {String[]}   filterOut Which templates that you want to exclude
 * @param  {Function}   fn        Callback functions
 * @return {Function}             Returns fn
 * @api public
 */

exports.newModule = function( projects, names, filterOut, fn ) {
  projects = Array.isArray( projects ) ? projects : [ projects ];

  async.each(
    projects,
    function( project, next ) {
    generateScaffold( project, names, filterOut, next );
  }, fn );
}

/**
 * Scaffolds a project within process.cwd( )
 *
 * @param  {Object}     project   Object returned from util.locations.get( )
 * @param  {String[]}   names     Names of the module
 * @param  {String[]}   filterOut Which templates you want to exclude
 * @param  {Function}   fn        Callback functions
 * @return {Functions}            Returns fn
 * @api private
 */

function scaffoldProject( project, names, filterOut, fn ) {
  project.useCWD = true;

  async.each( names, function ( name, next ) {
    generateScaffold( project, name, filterOut, next );
  }, fn );
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
  name      = Array.isArray( name ) ? name : [ name ];
  filterOut = Array.isArray( filterOut ) ? filterOut : [ ];

  // Just for easability, we'll add an 's' to the end of the filters to cover a quasi-plural form
  filterOut = filterOut.concat(
    filterOut.map( function ( filter ) {
      return filter === "factory" ? 'factories' : filter + 's';
    } )
  );

  util.locations.get( ).then( function ( projects ) {
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

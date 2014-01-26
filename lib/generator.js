var path    = require( 'path' )
  , mkdirp  = require( 'mkdirp' )
  , async   = require( 'async' )
  , es      = require( 'event-stream' )
  , fs      = require( 'fs' )
  , tcase   = require( 't-case' )
  , Project = require( path.join( __dirname, 'project' ) )
  , utils   = require( path.join( __dirname, 'utils' ) );

function getTemplatePath( project, name ) {
  return path.resolve( [__dirname, '..', 'templates', project.name].concat( name ).join( path.sep ) );
}

var getModulePath = exports.getModulePath = function ( project, name ) {
  var n = name.split( path.sep );
  var moduleName = n.splice( -1 )[0];

  var proj = project.useCWD ? process.cwd( ) : project.moduleDir;
  return path.resolve( [proj].concat( n.length > 0 ? n.join( path.sep ) : [], moduleName ).join( path.sep ) );
}

function touchDirs( project, tmpls, names, fn ) {
  var dirs = [];

  tmpls = Array.isArray( tmpls ) ? tmpls : [tmpls];
  names = Array.isArray( names ) ? names : [names];

  // compile a list of directories within the project's applicable (names) folders
  async.each( tmpls, function ( tmpl, next ) {
    var templateHome = getTemplatePath( project, tmpl );

    var finder = require( 'findit' )( templateHome );
    finder.on( 'directory', function ( dir ) {
      names.forEach( function ( name ) {
        dirs.push( dir.replace( path.resolve( path.join( __dirname, '..', 'templates', project.name ) ), getModulePath( project, name ) ) );
      } );
    } );

    finder.on( 'end', next );
  },
  function ( err ) {
    if (!!err) {
      return fn( err );
    }

    async.each( dirs, function ( dir, next ) {
      mkdirp( dir, next );
    }, function ( err ) {
      fn( err, dirs );
    } );
  } );
}

// remove export
function checkFiles( project, dirs, tmpls, names, fn ) {
  tmpls = Array.isArray( tmpls ) ? tmpls : [tmpls];
  names = Array.isArray( names ) ? names : [names];

  async.each( names, function ( name, next ) {
    async.each( tmpls, function ( tmpl, _next ) {
      var n       = fileName( tmpl, name.split( path.sep ).splice( -1 )[0] )
        , filter  = path.join( getModulePath( project, name ), tmpl );

      // filter for the necessary dirs by "tmpl" path...
      // it's OK if we have ExampleModel in the config folder... since that's not
      // what we're piping to for models anyway...
      async.each( dirs.filter( function ( dir ) {
        return filter.indexOf( dir ) > -1;
      } ), function ( filePath, __next ) {
        fs.exists( path.resolve( path.join( filePath, n ) ), function ( exists ) {
          __next( exists ? ( n + ' already exists within ' + filePath ) : null );
        } );
      }, _next );
    }, next );
  }, fn );
}

function fileName( tmpl, name ) {
  return tcase.classCase( name + ' ' + tmpl.replace( /s$/i, '' ) ) + '.js';
}

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

function renderTemplate( dirs, names, tmpls, project, fn ) {
  var files = [];

  tmpls = Array.isArray( tmpls ) ? tmpls : [tmpls];

  async.eachSeries( names, function ( name, next ) {
    async.eachSeries( tmpls, function ( tmpl, _next) {
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
            var _fileName = name.split( path.sep ).splice( -1 )[0] + '-' + tmpl;

            if (_fileName[_fileName.length-1] === "s") {
              _fileName = _fileName.substr(0, _fileName.length-1);
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
            __next();
          } );
        } );
      }, _next );
    }, next );
  },
  function ( err ) {
    fn( err, files );
  } );
}

function generateRun( projects, tmpls, names, fn ) {
  projects = Array.isArray( projects ) ? projects : [projects];

  async.eachSeries( projects, function ( project, next ) {
    touchDirs( project, tmpls, names, function ( err, dirs ) {
      if (!!err) {
        return utils.fail( err );
      }

      checkFiles( project, dirs, tmpls, names, function ( err ) {
        if (!!err) {
          return utils.fail( err );
        }

        renderTemplate( dirs, names, tmpls, project, function ( err, files ) {
          if (!!err) {
            return utils.fail( err );
          }

          files.forEach( function ( file ) {
            utils.success( 'Created ' + file );
          } );

          next( );
        } );
      } );
    } );
  }, fn );
}

var generate = exports.generate = function( project, tmpls, names, fn ) {
  if (arguments.length < 4) {
    fn        = names;
    names     = tmpls;
    tmpls     = project;
    project  = null;
  }

  fn    = typeof fn === "function" ? fn : function noop(){};
  names = Array.isArray( names ) ? names : [names];

  if (!!project) {
    generateRun( project, tmpls, names, fn );
  } else {
    Project.locations( true ).then( function ( projects ) {
      generateRun( projects, tmpls, names, fn );
    }, fn );
  }
}

// function scaffoldFile( _path, fileName, project, name, fn ) {
//   var to    = path.resolve( path.join( process.cwd( ), _path ) )
//     , from  = path.resolve( path.join( __dirname, '..', 'templates', project, _path, fileName ) );

//   console.log('to', to);
//   console.log(from);
//   throw new Error('hi');
//   mkdirp( to, function ( err ) {
//     if (!!err) {
//       return utils.fail( err );
//     }

//     transformFile( from, path.join( to, fileName ), name, function ( err ) {
//       if (!!err) {
//         return utils.fail( err );
//       }

//       utils.success( 'Created ' + path.join( to, fileName ) );
//       fn( );
//     } );
//   } );
// }

function scaffoldProject( project, name, filterOut, fn ) {
  var templateDirs = fs.readdirSync( path.resolve( path.join( __dirname, '..', 'templates', project.name ) ) );

  templateDirs = templateDirs.filter( function ( f ) {
    var stat = fs.statSync( path.resolve( path.join( __dirname, '..', 'templates', project.name, f ) ) );
    return stat.isDirectory( ) && filterOut.indexOf( f ) === -1;
  } );

  if (Array.isArray( project )) {
    project.map( function ( p ) {
      p.useCWD = true;
    } );
  } else {
    project.useCWD = true;
  }

  generate( project, templateDirs, name, fn );
}

module.exports.scaffold = function( name, filterOut, fn ) {
  filterOut = Array.isArray( filterOut ) ? filterOut : [];

  // Just for easability, we'll add an 's' to the end of the filters to cover a quasi-plural form
  filterOut = filterOut.concat(
    filterOut.map( function ( filter ) {
      return filter + 's';
    } )
  );

  Project.locations( ).then( function ( projects ) {
    async.eachSeries( projects, function ( p, next ) {
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

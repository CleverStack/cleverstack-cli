var Promise = require( 'bluebird' )
  , path    = require( 'path' )
  , async   = require( 'async' )
  , spawn   = require( 'win-spawn' )
  , fs      = Promise.promisifyAll( require( 'fs' ) )
  // may need search in the future for pulling in zip/gzip files of specific packages (for npm)
  // , search  = require( path.join( __dirname, 'search'   ) )
  , utils   = require( path.join( __dirname, 'utils'    ) );

Promise.longStackTraces( );

module.exports.installBundledModules = function ( project, deps ) {
  deps = Array.isArray( deps ) ? deps : [deps];

  if (deps.length < 1) {
    return new Promise( function ( res ) {
      res( );
    } );
  }

  var def = Promise.defer( );

  // For .locations()
  // process.chdir( project );

  utils.info( 'Installing modules: ' + deps.join( ' ' ) );

  var proc = spawn( path.join( __dirname, '..', 'bin', 'clever-install' ), deps, { cwd: project, stdio: 'inherit' } );
  proc.on( 'close', function ( code ) {
    if (code !== 0) {
      return def.reject( );
    }

    def.resolve( );
  } );

  // locations( ).then( function ( locations ) {
  //   search.aggregate( deps ).spread( function ( npm, bower ) {
  //     console.log('results',  npm, bower);
  //     process.chdir( path.join( process.cwd( ), '..' ) );

  //     def.resolve( );
  //   } )
  //   .error( def.reject );
  // });

  return def.promise;
}

function gruntUtility ( filePath ) {
  var file  = require( filePath )( )
    , tasks = [ ];

  // we're essentially creating a small grunt utility to bypass
  // grunt functions... this is better than requiring grunt
  // entirely and trying to regex parse...
  if (Array.isArray( file ) && typeof file[file.length-1] === "function") {
    file[file.length-1].call( file, {
      registerTask: function ( cmd ) {
        tasks.push( cmd );
      },
      loadNpmTasks: function ( ) { }
    } );
  }

  return tasks;
}

module.exports.readGruntTasks = function ( pathSrc, silence ) {
  var def = Promise.defer( );

  if (typeof silence === "undefined") {
    silence = true;
  }

  findGruntFile( pathSrc )
  .then( function ( filePath ) {
    var tasks = gruntUtility( filePath );
    def.resolve( [ tasks, pathSrc ] );
  } )
  .catch( function ( err ) {
    if (err.match( /^Gruntfile within/ ) !== null && silence === true) {
      return def.resolve( [ [], pathSrc ] );
    }

    def.reject( err );
  } );

  return def.promise;
}

var findGruntFile = exports.findGruntFile = function ( pathSrc ) {
  var def = Promise.defer( );

  async.detect( [
    path.join( pathSrc, 'Gruntfile.js' ),
    path.join( pathSrc, 'gruntfile.js' ),
    path.join( pathSrc, 'Grunt.js' ),
    path.join( pathSrc, 'grunt.js' )
  ], fs.exists, function ( filePath ) {
    if (typeof filePath === "undefined") {
      return def.reject( 'Gruntfile within ' + pathSrc + ' could not be found.' );
    }

    def.resolve( filePath );
  } );

  return def.promise;
}

var find = exports.find = function( fn ) {
  var def = Promise.defer( );

  utils.info( 'Scanning for seed locations...' );

  // As of right now... our best bet is to look forward once
  // and then backwards first match. The limitation of this..
  // is that we're presuming the folders are called backend and frontend
  // todo: Enable support for any folder name

  fs.readdirAsync( process.cwd( ) )
  .then( function ( list ) {
    list = list.filter( function ( f ) {
      var stats = fs.statSync( path.resolve( path.join( process.cwd( ), f ) ) );
      return stats.isDirectory( ) && ['frontend', 'backend'].indexOf( f ) > -1;
    } )
    .map( function ( f ) {
      return path.resolve( path.join( process.cwd( ), f ) );
    } );

    if (list.length > 0) {
      return def.resolve( list );
    }

    var behind = process.cwd( ).split( path.sep ).reverse( )
      , found  = false;

    async.until(
      function ( ) { return behind.length < 1 || found === true; },
      function ( next ) {
        if (['frontend', 'backend'].indexOf( behind[0] ) > -1) {
          found = true;
        } else {
          behind.shift( );
        }
        next( );
      },
      function ( err ) {
        if (!!err) {
          return fn( err );
        }

        if (!behind.length) {
          return utils.fail( 'Couldn\'t find a seed directory within ' + process.cwd( ) );
        }


        def.resolve( [behind.reverse( ).join( path.sep )] );
      }
    );
  } )
  .nodeify( fn );

  return def.promise;
}

var locations = module.exports.location = module.exports.locations = function ( useCWD, fn ) {
  var def = Promise.defer( );

  if (typeof useCWD === "function") {
    fn      = useCWD;
    useCWD  = false;
  }

  find().then( function ( foundProjects ) {
    var projects         = []
    var projectTemplates = {
      backend: {
        name: 'backend',
        modulePath: 'modules'
      },
      frontend: {
        name: 'frontend',
        modulePath: path.join( 'app', 'modules' )
      }
    };

    foundProjects.forEach( function ( proj ) {
      var projectName = proj.split( path.sep ).slice( -1 )[0];

      if (projectTemplates.hasOwnProperty( projectName ) ) {
        projectTemplates[projectName].moduleDir = proj;
        projectTemplates[projectName].useCWD    = useCWD;
        projects.push( projectTemplates[projectName] );
      }
    } );

    def.resolve( projects );
  } )
  .nodeify( fn );

  return def.promise;
}

module.exports.installModule = function ( project, modulePath ) {
  var def = Promise.defer( );
  var projectFolder = project.moduleDir;
  var moduleDir = path.join( project.moduleDir, project.modulePath );

  process.chdir( moduleDir );

  var jsonPath = path.resolve( path.join( modulePath, 'package.json' ) )
    , jsonFile = require( jsonPath )
    , deps     = [];

  jsonFile.dependencies     = jsonFile.dependencies     || {};
  jsonFile.devDependencies  = jsonFile.devDependencies  || {};

  Object.keys( jsonFile.dependencies ).forEach( function ( k ) {
    deps.push( k + '@' + jsonFile.dependencies[k] );
  } );

  Object.keys( jsonFile.devDependencies ).forEach( function ( k ) {
    deps.push( k + '@' + jsonFile.devDependencies[k] );
  } );

  // unfortunately, to get --prefix to work, you have to specify each dep...
  async.eachSeries( deps, function ( dep, _next ) {
    var err  = ''
      , proc = spawn( 'npm', ['install', dep, '--prefix', projectFolder] );

    proc.stderr.on('data', function ( data ) {
      err += data + '';
    } );

    proc.on( 'close', function ( code ) {
      if (code !== 0) {
        return _next( err );
      }

      _next( );
    } );
  },
  function ( err ) {
    if (!!err) {
      return def.reject( err );
    }

    utils.success( 'Finished installing NPM packages for ' + modulePath );

    var bowerPath = path.resolve( path.join( projectFolder, 'bower.json' ) );
    process.chdir( projectFolder );

    // backend folder?
    if (!fs.existsSync( bowerPath ) ) {
      utils.warn( 'Running database migrations...' );

      var args = [ '--base', projectFolder, '--gruntfile', path.resolve( path.join( projectFolder, 'Gruntfile.js' ) ), 'db:exec' ]
        , err  = '';

      var env       = process.env;
      env.NODE_ENV  = 'local';

      var proc = spawn( 'grunt', args, {env: env} );

      proc.stderr.on('data', function ( data ) {
        err += data + '';
      } );

      proc.on( 'close', function ( code ) {
        if (code !== 0) {
          return def.reject( err );
        }

        def.resolve( true );
      } );
    } else {
      utils.info( 'Installing bower packages for ' + modulePath);

      var err  = ''
        , npmProc = spawn( 'npm', ['run', 'setup'] );

      npmProc.stderr.on('data', function ( data ) {
        err += data + '';
      } );

      npmProc.on( 'close', function ( code ) {
        if (code !== 0) {
          return def.reject( err );
        }

        utils.success( 'Finished installing bower packages.' );
        def.resolve( true );
      } );
    }
  } );

  return def.promise;
}

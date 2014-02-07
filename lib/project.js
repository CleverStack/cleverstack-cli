var Promise = require( 'bluebird' )
  , path    = require( 'path' )
  , async   = require( 'async' )
  , spawn   = require( 'child_process' ).spawn
  , exec    = require( 'child_process' ).exec
  , fs      = Promise.promisifyAll( require( 'fs' ) )
  , install = require( path.join( __dirname, 'install' ) )
  , utils   = require( path.join( __dirname, 'utils' ) );

Promise.longStackTraces( );

/**
 * Helper function for running clever-install if there are modules to install
 *
 * @param  {Object} projectFolder location returned by locations( )
 * @param  {String[]} modules
 * @return {Promise}
 * @api public
 */

exports.setupModules = function ( projectFolder, modules ) {
  var def   = Promise.defer( )
    , cwd   = process.cwd( );

  process.chdir( projectFolder.moduleDir );

  install.run( modules )
  .then( function ( ) {
    process.chdir( cwd );
    def.resolve( );
  }, function ( err ) {
    process.chdir( cwd );
    def.reject( err );
  } );

  return def.promise;
}

/**
 * Finds a frontend and backend seed and determines
 * whether or not we can use Bower or NPM
 *
 * @return {Promise}
 * @api public
 */

exports.useUtils = function ( ) {
  var def = Promise.defer( );

  locations( )
  .then( function ( locations ) {
    var useNPM = false
      , useBower = false;

    if (locations.length > 1) {
      useNPM    = true;
      useBower  = true;
    }
    else if (locations.length < 1) {
      utils.fail( 'Couldn\'t find any CleverStack seeds within ' + process.cwd( ) );
    }
    else {
      useNPM    = locations[ 0 ].name === "backend";
      useBower  = locations[ 0 ].name === "frontend";
    }

    var _locations = locations.filter( function ( location ) {
      return ( useNPM && useBower ) || ( useNPM && location.name === "backend" ) || ( useBower && location.name === "frontend" );
    } );

    def.resolve( [ _locations, useNPM, useBower ] );
  } );

  return def.promise;
}

/**
 * Installs bundleDependencies through lib.project.installBundledModules if applicable
 *
 * @param  {String} projectDir
 * @return {Promise}
 * @api public
 */

module.exports.installBundleDeps = function ( moduleDir, projectDir ) {
  return new Promise( function ( res, rej ) {
    var pkg = require( path.join( moduleDir, 'package.json' ) );

    if (!pkg.hasOwnProperty( 'bundledDependencies' ) || pkg.bundledDependencies.length < 1) {
      return res( );
    }

    utils.info( 'Installing bundled dependencies within ' + moduleDir );
    installBundledModules( moduleDir, pkg.bundledDependencies, projectDir ).then( function ( ) {
      res( );
    } )
    .catch( rej );
  } );
}

/**
 * Installs CleverStack modules listed within the bundleDependencies array
 *
 * @param  {String} project
 * @param  {Array} deps
 * @return {Promise}
 * @api public
 */

var installBundledModules = exports.installBundledModules = function ( project, deps, projectDir ) {
  deps = Array.isArray( deps ) ? deps : [deps];

  var _path = typeof projectDir !== "undefined" ? projectDir : project;

  if (deps.length < 1) {
    return new Promise( function ( res ) {
      res( );
    } );
  }

  var def = Promise.defer( );

  async.filter( deps, function ( dep, cb ) {
    fs.exists( path.join( _path, dep ), function ( exists ) {
      cb( !exists );
    } );
  }, function ( _deps ) {
    if (_deps.length < 1) {
      return def.resolve( );
    }

    utils.info( 'Installing modules: ' + _deps.join( ' ' ) );

    var def = Promise.defer( )
      , cwd = process.cwd( );

    process.chdir( _path );
    install.run( _deps )
    .then( function ( ) {
      process.chdir( cwd );
      def.resolve( );
    }, function ( err ) {
      process.chdir( cwd );
      def.reject( err );
    } );
  } );

  return def.promise;
}

/**
 * We're essentially creating a small grunt utility to bypass
 * grunt functions... this is better than requiring grunt
 * entirely and trying to regex parse...
 *
 * @param  {String} filePath
 * @return {Object}
 * @api private
 */

function gruntUtility ( filePath ) {
  var file  = require( filePath )( )
    , tasks = [ ];


  if (Array.isArray( file ) && typeof file[file.length-1] === "function") {
    file[ file.length-1 ].call( file, {
      registerTask: function ( cmd ) {
        tasks.push( cmd );
      },
      loadNpmTasks: function ( ) { }
    } );
  }

  return tasks;
}

/**
 * Reads/parses Grunt tasks within pathSrc
 * @param  {String} pathSrc - Source to the Gruntfile
 * @param  {Boolean} [silence=true] - Silences errors returned from reading the Gruntfile
 * @return {Promise}
 * @api public
 */

var readGruntTasks = exports.readGruntTasks = function ( pathSrc, silence ) {
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

/**
 * Finds the correct Gruntfile name
 *
 * @param  {String} pathSrc - Directory path where the Gruntfile resides.
 * @return {Promise}
 * @api public
 */

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

/**
 * Finds seed locations within CWD
 * @return {Promise}
 * @api public
 */

var find = exports.find = function( ) {
  var def = Promise.defer( );

  // As of right now... our best bet is to look forward once
  // and then backwards first match. The limitation of this
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


        def.resolve( [ behind.reverse( ).join( path.sep ) ] );
      }
    );
  } );

  return def.promise;
}

/**
 * Finds seed locations and returns an object with common properties
 * @param  {Boolean} [useCWD=false] - Whether or not we should use process.cwd()
 * @return {Promise}
 * @api public
 */

var locations = exports.location = exports.locations = function ( useCWD, fn ) {
  var def = Promise.defer( );

  if (typeof useCWD === "function") {
    fn      = useCWD;
    useCWD  = false;
  }

  find( ).then( function ( foundProjects ) {
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
      var projectName = proj.split( path.sep ).slice( -1 )[ 0 ];

      if (projectTemplates.hasOwnProperty( projectName ) ) {
        projectTemplates[projectName].moduleDir = proj;
        projectTemplates[projectName].useCWD    = useCWD;
        projects.push( projectTemplates[projectName] );
      }
    } );

    def.resolve( projects );
  } );

  return def.promise;
}

/**
 * Runs grunt readme if applicable
 *
 * @param  {String} projectFolder  Path to the project's folder
 * @return {Promise}               Returns a promise from bluebird
 * @api private
 */

function runReadMe ( projectFolder ) {
  var def   = Promise.defer( )
    , proc  = spawn( 'grunt', [ 'readme' ], { cwd: projectFolder, stdio: 'inherit' } );

  proc.on( 'close', function ( code ) {
    if (code !== 0) {
      return def.reject( );
    }

    def.resolve( );
  } );

  return def.promise;
}

/**
 * Runs prompt from Grunt (prompt:clever)
 *
 * @param  {String} projectFolder Path to the project's/module's folder
 * @return {Promise}              Returns a promise from bluebird
 * @api private
 */

function runPrompt ( projectFolder ) {
  var env   = process.env
    , def   = Promise.defer( );

  var proc = spawn( 'grunt', [ 'prompt:clever' ], { cwd: projectFolder, stdio: 'inherit' } );

  proc.on( 'close', function ( code ) {
    if (code !== 0) {
      return def.reject( );
    }

    def.resolve( );
  } );

  return def.promise;
}

/**
 * Runs DB migrations from grunt
 *
 * @param  {String} projectFolder Path to the project's folder
 * @return {Promise}              Returns a promise from bluebird
 * @api private
 */

function runDBMigrations ( projectFolder ) {
  var def = Promise.defer( )
    , env = process.env;

  utils.warn( 'Running database migrations...' );

  // check for NODE_ENV json config file if it doesn't exist then revert to local
  if (!fs.existsSync( path.join( projectFolder, 'config', env.NOD_ENV + '.json') ) ) {
    env.NODE_ENV  = 'local';
  }

  exec( 'NODE_ENV=' + env.NODE_ENV + ' grunt db', { env: env, cwd: projectFolder }, function ( err, stderr, stdout ) {
    if (!!err) {
      return def.reject( err );
    }

    if (!!stderr && stderr !== "") {
      return def.reject( stderr );
    }

    def.resolve( );
  } );

  return def.promise;
}

/**
 * Runs Grunt tasks specifically for CleverStack
 *
 * @param  {String} projectFolder Path to the project's backend folder
 * @param  {String} modulePath    Path to the module (where to look for the grunt file)
 * @return {Promise}              Promise from bluebird
 * @api public
 */

exports.runGruntTasks = function ( projectFolder, modulePath ) {
  var def = Promise.defer( );

  readGruntTasks( modulePath )
  .spread( function ( tasks, __path__ ) {
    Promise.all( tasks )
    .then( function ( ) {
      if (tasks.indexOf( 'readme') > -1) {
        return runReadMe( projectFolder );
      }
      return true;
    } )
    .then( function ( ) {
      if (tasks.indexOf( 'prompt:clever' ) > -1) {
        return runPrompt( projectFolder );
      }
      return true;
    } )
    .then( function ( ) {
      if (tasks.indexOf( 'db' ) > -1) {
        return runDBMigrations( projectFolder );
      }
      return true;
    } )
    .then( function ( ) {
      def.resolve( );
    }, function ( err ) {
      def.reject( err );
    } );
  } );

  return def.promise;
}

/**
 * Installs module bower components within the frontend seed's component dir
 *
 * @param  {Object} projectFolder Object returned from locations( )
 * @return {Promise}              Promise from bluebird
 * @api public
 */

var installBowerComponents = exports.installBowerComponents = function ( projectFolder ) {
  var def       = Promise.defer( )
    , bowerPath = path.join( projectFolder.moduleDir, 'bower.json' )
    , bowerRC   = path.join( projectFolder.moduleDir, '.bowerrc' )
    , _bowerRC  = fs.readFileSync( bowerRC );

    _bowerRC = JSON.parse( _bowerRC );

  // if (!fs.existsSync( bowerPath ) || !fs.existsSync( bowerRC )) {
    // utils.warn( 'bower.json and .bowerrc files not found within ' + projectFolder.moduleDir + ' .. skipping...' );
  // }

  utils.info( 'Installing bower packages for ' + projectFolder.moduleDir );

  var err  = ''
    , proc = spawn( 'bower', [ 'install' ], { cwd: projectFolder.moduleDir } );

  proc.stderr.on( 'data', function ( data ) {
    err += data + '';
  } );

  proc.on( 'close', function ( code ) {
    if (code !== 0) {
      return def.reject( err );
    }

    utils.success( 'Finished installing bower packages' );
    utils.info( 'Installing bower components for each module...' );

    async.filter( fs.readdirSync( path.join( projectFolder.moduleDir, projectFolder.modulePath ) ), function ( dir, next ) {
      fs.exists( path.join( projectFolder.moduleDir, projectFolder.modulePath, dir, 'bower.json' ), next );
    },
    function ( modules, err ) {
      if (!!err) {
        return def.reject( err );
      }

      if (modules.length < 1) {
        return def.resolve( );
      }

      async.each( modules, function ( moduleDir, fn ) {
        utils.info( 'Installing bower components for ' + moduleDir );

        exec( 'bower ' + [ '-F', '--config.cwd=' + path.join( projectFolder.moduleDir, projectFolder.modulePath, moduleDir ), '--config.directory=' + path.relative( path.join( projectFolder.moduleDir, projectFolder.modulePath, moduleDir ), [ projectFolder.moduleDir ].concat( _bowerRC.directory.split( '/' ) ).join( path.sep ) ), 'install' ].join( ' ' ), { env: process.env, cwd: path.join( projectFolder.moduleDir, projectFolder.modulePath, moduleDir ) }, function (_err, _stderr, _stdout) {
          utils.success( 'Finished bower components for ' + moduleDir );
          fn( );
        } );
      },
      function ( _err_ ) {
        if (!!_err_) {
          return def.reject( _err_ );
        }

        def.resolve( );
      } );
    } );
  } );

  return def.promise;
}

/**
 * Looks into package.json within the seed's module directory
 * and finds each (dev)dependency and installs individually
 * due to use using the --prefix flag for NPM
 * @param  {Object} project
 * @param  {[type]} modulePath
 * @return {Promise}
 * @api public
 */

exports.installModule = function ( project, modulePath ) {
  return new Promise( function ( resolve, reject ) {
    var projectFolder = project.moduleDir;
    var moduleDir = path.join( project.moduleDir, project.modulePath );

    var jsonPath  = path.resolve( path.join( modulePath, 'package.json' ) )
      , deps      = [ ];

    if (!fs.existsSync( jsonPath )) {
      return resolve( );
    }

    var jsonFile = require( jsonPath );

    jsonFile.dependencies     = jsonFile.dependencies     || {};
    jsonFile.devDependencies  = jsonFile.devDependencies  || {};

    Object.keys( jsonFile.dependencies ).forEach( function ( k ) {
      deps.push( k + '@' + jsonFile.dependencies[k] );
    } );

    Object.keys( jsonFile.devDependencies ).forEach( function ( k ) {
      deps.push( k + '@' + jsonFile.devDependencies[k] );
    } );

    utils.info( 'Installing NPM packages for ' + modulePath );

    // we need series here in order to prevent NPM from overwriting packages
    async.eachSeries( deps, function ( dep, _next ) {
      var err  = ''
        , proc = spawn( 'npm', [ 'install', dep, '--prefix', projectFolder ], { cwd: moduleDir } );

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
        return reject( err );
      }

      utils.success( 'Finished installing NPM packages for ' + modulePath );

      var bowerPath = path.resolve( path.join( projectFolder, 'bower.json' ) )
        , _err      = '';

      // backend folder?
      if (!fs.existsSync( bowerPath ) ) {
        return resolve( );
      }

      utils.info( 'Installing bower packages for ' + modulePath);

      exec( 'npm run setup', { cwd: modulePath }, function ( _err ) {
        if (!!_err) {
          return reject( _err );
        }

        utils.success( 'Finished installing bower packages.' );
        resolve( );
      } );
    } );
  } );
}

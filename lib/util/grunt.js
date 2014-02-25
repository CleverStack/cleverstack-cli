var Promise = require( 'bluebird' )
  , path    = require( 'path' )
  , async   = require( 'async' )
  , fs      = require( 'fs' )
  , spawn   = require( 'child_process' ).spawn
  , exec    = require( 'child_process' ).exec
  , utils   = require( path.join( __dirname, '..', 'utils' ) );

/**
 * Mimmicks a small grunt-cli utility
 *
 * @return {gruntCLI}
 * @private
 */

function gruntCLI ( ) {
  this.tasks = [ ];

  this.option = function ( key ) {
    return process.env[ key ];
  }

  this.registerTask = function ( cmd ) {
    this.tasks.push( cmd );
  }

  this.loadNpmTasks = function ( ) { }
}

/**
 * We're essentially creating a small grunt utility to bypass
 * grunt functions... this is better than requiring grunt
 * entirely and trying to regex parse...
 *
 * @param  {String} filePath
 * @return {Object}
 * @api public
 */

var gruntUtility = exports.gruntUtility = function ( filePath ) {
  var cli  = new gruntCLI( )
    , file = require( filePath )( cli );

  if (Array.isArray( file ) && typeof file[ file.length-1 ] === "function") {
    file[ file.length-1 ].call( file,  cli );
  }

  return cli.tasks;
}

/**
 * Reads/parses Grunt tasks within pathSrc
 *
 * @param  {String} pathSrc - Source to the Gruntfile
 * @param  {Boolean} [silence=true] - Silences errors returned from reading the Gruntfile
 * @return {Promise}
 * @api public
 */

var readTasks = exports.readTasks = function ( pathSrc, silence ) {
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
      return def.resolve( [ [ ], pathSrc ] );
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
 * Runs a grunt task within projectFolder
 *
 * @param  {String} projectFolder Path to the project's seed folder
 * @param  {String} cmd           Command to run within grunt
 * @return {Promise}              Returns a promise from bluebird
 * @api private
 */

function runTask ( projectFolder, cmd ) {
  var def   = Promise.defer( )
    , proc  = spawn( 'grunt', [ cmd ], { cwd: projectFolder, stdio: 'inherit' } );

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

  exec( 'NODE_ENV=' + env.NODE_ENV + ' grunt db', { env: env, cwd: projectFolder }, function ( err, stdout, stderr ) {
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

exports.runTasks = function ( projectFolder, modulePath ) {
  var def = Promise.defer( );

  readTasks( modulePath )
  .spread( function ( tasks ) {
    Promise.all( tasks )
    .then( function ( ) {
      if (tasks.indexOf( 'readme') > -1) {
        return runTask( projectFolder, 'readme' );
      }
      return true;
    } )
    .then( function ( ) {
      if (tasks.indexOf( 'prompt:clever' ) > -1) {
        return runTask( projectFolder, 'prompt:clever' );
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

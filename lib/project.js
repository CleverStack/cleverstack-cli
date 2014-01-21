var Promise = require( 'bluebird' )
  , path    = require( 'path' )
  , async   = require( 'async' )
  , spawn   = require( 'win-spawn' )
  , fs      = Promise.promisifyAll( require( 'fs' ) )
  , utils   = require( path.resolve( path.join( __dirname, 'utils' ) ) );

Promise.longStackTraces( );

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

module.exports.location = module.exports.locations = function ( useCWD, fn ) {
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

module.exports.installModule = function ( project, modulePath, fn ) {
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
        , proc = spawn( 'npm', ['run', 'setup'] );

      proc.stderr.on('data', function ( data ) {
        err += data + '';
      } );

      proc.on( 'close', function ( code ) {
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

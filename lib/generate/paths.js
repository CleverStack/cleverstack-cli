var path  = require( 'path' )
  , tcase = require( 't-case' );

/**
 * Returns the template path for a specific seed
 *
 * @param  {Object} project Object returned from project.locations( )
 * @param  {String} name    Name of the seed
 * @return {String}         Path to the template
 * @api public
 */

exports.getTemplatePath = function ( project, name ) {
  return path.resolve( [ __dirname, '..', '..', 'templates', project.name ].concat( name ).join( path.sep ) );
}

/**
 * Returns module's path
 *
 * @param  {Object} project Object returned from project.locations( )
 * @param  {String} name    Name of the module
 * @return {String}         Path to the module
 * @api public
 */

exports.getModulePath = function ( project, name ) {
  var n           = name.split( path.sep )
    , moduleName  = n.splice( -1 )[ 0 ]
    , proj        = project.useCWD === true ? process.cwd( ) : path.join( project.moduleDir, project.modulePath );

  return path.resolve( [ proj ].concat( n.length > 0 ? n.join( path.sep ) : [ ], moduleName ).join( path.sep ) );
}

/**
 * Returns the correct filename from templates
 *
 * @param  {String} templateName Template's file name
 * @param  {String} name         Module's name
 * @return {String}              New file name
 * @api public
 */

exports.fileName = function ( templateName, name ) {
  name = templateName
          .replace( 'Template', tcase.snakeCase( name.replace( /s$/i, '' ) ) )
          .replace( 'template', tcase.classCase( name.replace( /s$/i, '' ) ) );

  return name;
}

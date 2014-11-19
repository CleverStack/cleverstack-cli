var path    = require( 'path' )
  , async   = require( 'async' )
  , fs      = require( 'fs' )
  , tcase   = require( 't-case' )
  , es      = require( 'event-stream' )
  , i       = require( 'i' )()
  , paths   = require( path.join( __dirname, 'paths' ) );

/**
 * Transforms the file from a template to the actual module
 *
 * @param  {String}   from Path to the file to convert from
 * @param  {String}   to   Path to convert the file into
 * @param  {String}   name Name of the module
 * @param  {Function} fn   Callback functions
 * @return {Function}      Returns fn
 * @api public
 */

var transformFile = exports.transformFile = function( from, to, name, fn ) {
    var file  = fs.createWriteStream( to );
    var read  = fs.createReadStream( from, { encoding: 'utf-8' } )
                    .pipe( es.replace( '{{modulename}}',      name ) )
                    .pipe( es.replace( '{{Template}}',        i.singularize( tcase.classCase( name ) ) ) )
                    .pipe( es.replace( '{{TemplateName}}',    i.singularize( tcase.classCase( name ) ) ) )
                    .pipe( es.replace( '{{template-name}}',   i.singularize( tcase.paramCase( name ) ) ) )
                    .pipe( es.replace( '{{_template_}}',      i.singularize( tcase.classCase( name ) ) ) )
                    .pipe( es.replace( '{{template_name}}',   i.singularize( tcase.classCase( name ) ) ) )
                    .pipe( file );

    read.on( 'error', fn );

    file
        .on( 'error', fn )
        .on( 'close', function() {
            fn( null,  to );
        });
}

/**
 * Compiles a list of files to transform
 *
 * @param  {String[]}   dirs    Path to directories to look into
 * @param  {String[]}   names   Module names
 * @param  {String[]}   tmpls   Which templates we want from the seed
 * @param  {Object}     project Object returned from util.locations.get( )
 * @param  {Function}   fn      Callback functions
 * @return {Functions}          Returns fn
 * @api public
 */

exports.template = function( dirs, names, tmpls, project, fn ) {
    var files = [];

    async.each(
        names,
        function( name, next ) {
            async.each(
                tmpls,
                function( tmpl, _next ) {
                    var filter = path.join( paths.getModulePath( project, name ), tmpl );

                    async.eachSeries( 
                        dirs.filter( function( dir ) {
                            return filter.indexOf( dir ) > -1;
                        }),
                        function eachFile( dir, __next ) {
                            var _files        = []
                                , templateHome  = paths.getTemplatePath( project, tmpl )
                                , finder        = require( 'findit' )( templateHome );

                            finder.on( 'file', function( file ) {
                                _files.push( file );
                            });

                            finder.on( 'end', function() {
                                async.eachSeries(
                                    _files,
                                    function eachFileEnd( file, ___next ) {
                                        var _fileName = i.singularize( name.split( path.sep ).splice( -1 )[ 0 ] );

                                        var fileName  = file.replace( templateHome, '' )
                                                            .replace( 'Template', tcase.classCase( _fileName ) )
                                                            .replace( 'template', tcase.classCase( _fileName ) )
                                          , to        = path.resolve( path.join( paths.getModulePath( project, name ) , tmpl, fileName  ) );

                                        transformFile( file, to, name, function( err, filePath) {
                                            if (!!err) {
                                                return ___next( err );
                                            }

                                            files.push( filePath );

                                            ___next( );
                                        });
                                    },
                                    function( err ) {
                                        __next( err );
                                    }
                                );
                            });
                        },
                        _next
                    );
                },
                next
            );
        },
        function( err ) {
            fn( err, files );
        }
    );
}
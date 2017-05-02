// app.js

// BASE SETUP =================================================================

// call the packages we need
var express       = require( 'express' );      // call express
var app           = express();                 // define our app using express
var bodyParser    = require( 'body-parser' );
var cors          = require( 'cors' );
var path          = require( 'path' );
var favicon       = require( 'serve-favicon' );
var logger        = require( 'morgan' );
var cookieParser  = require( 'cookie-parser' );

// configuration ==============================================================
    
// config files
var db = require( './config/db' );

// view engine setup
app.set( 'views', path.join( __dirname, 'views' ) );
app.set( 'view engine', 'jade' );

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use( bodyParser.urlencoded({ extended: true }) );
app.use( bodyParser.json() );

// uncomment after placing your favicon in /public
//app.use( favicon( path.join( __dirname, 'public', 'favicon.ico' ) ) );
app.use( logger( 'dev' ) );
app.use( cookieParser() );
app.use( express.static( path.join( __dirname, 'public') ) );
app.use( cors() );


// routes ======================================================================
var routes = require( './routes/index' );
var moviesRouter = require( './routes/movies' );

app.use( '/', routes );
app.use( '/movies', moviesRouter );

// error handlers =============================================================

// catch 404 and forward to error handler
app.use( function( req, res, next ) {
  var err = new Error( 'Not Found' );
  err.status = 404;
  next( err );
});

// development error handler
// will print stacktrace
if ( app.get( 'env' ) === 'development' ) {
  app.use( function( err, req, res, next ) {
    res.status( err.status || 500 );
    res.render( 'error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use( function( err, req, res, next ) {
  res.status( err.status || 500 );
  res.render( 'error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;

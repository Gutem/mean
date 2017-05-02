var express = require( 'express' );
var router = express.Router();
var Movie = require( './../models/movie.js' );

router.use( function( req, res, next ) {
  next();
});

// /movies
router.route( '/' )
    .get( function( req, res ) {
        Movie.find( function( err, movies ) {
            if ( err )
                res.send( err );
            res.json( movies );
        });
    })

    .post( function( req, res ) {
        var movie = new Movie();
        movie.title = req.body.title;
        movie.title_image_url = req.body.title_image_url;
        movie.trailer_url = req.body.trailer_url;
        movie.summaries = req.body.summaries;
        movie.genres = req.body.genres;
        movie.box_office = req.body.box_office;

        movie.save( function( err ) {
            if ( err )
                res.send( err );
            res.json({ message: 'Movie created!' });
        });    
    });

// /movies/:movie_id
router.route( '/:movie_id' )
    .get( function ( req, res ) {
        Movie.findById( req.params.movie_id, function( err, movie ) {
            if ( err )
                res.send( err );
            res.json( movie );
        });
    })

    .put( function( req, res ) {
        Movie.findById( req.params.movie_id, function( err, movie ) {

            if ( err )
                res.send( err );

            movie.title = req.body.title;
            movie.title_image_url = req.body.title_image_url;
            movie.trailer_url = req.body.trailer_url;
            movie.summaries = req.body.summaries;
            movie.genres = req.body.genres;
            movie.box_office = req.body.box_office;

            movie.save(function( err ) {
                if ( err )
                    res.send( err );
                res.json({ message: 'Movie updated!' });
            });
        });
    })

    .delete( function( req, res ) {
        Movie.remove({
            _id: req.params.movie_id
        }, function( err, movie ) {
            if ( err )
                res.send( err );
            res.json({ message: 'Movie deleted!' });
        });
    });

module.exports = router;

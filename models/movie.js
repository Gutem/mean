var mongoose = require( 'mongoose' );
var Schema = mongoose.Schema;

var MovieSchema = new Schema({
  title: String,
  title_image_url: String,
  trailer_url: String,
  summaries: [ String ],
  genres: [ String ],
  box_office: [ Schema.Types.Mixed ]
});

module.exports = mongoose.model( 'Movie', MovieSchema );


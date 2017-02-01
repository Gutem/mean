'use strict';

var app = angular.module( 'imdb', [ 'ngRoute' ] );

app.config([ 
  '$locationProvider',
  '$routeProvider', function( 
    $locationProvider,
    $routeProvider ) {

  $locationProvider.hashPrefix('');

  $routeProvider
  .when( '/', {
    templateUrl: 'home.html',
    controller: 'MainCtrl'
  })
  .when( '/movies/:id', {
    templateUrl: 'movies.html',
    controller: 'MoviesCtrl'
  })
  .when( '/create', {
    templateUrl: 'movies_create.html',
    controller: 'MoviesCreateCtrl'
  })
  .when( '/movies/:id/edit', {
    templateUrl: 'movies_edit.html',
    controller: 'MoviesEditCtrl'
  })
  .otherwise({
    redirectTo: '/'
  });
}]);

app.directive('youtube', function( $window ) {
  return {
    restrict: "E",

    scope: {
      height:   "@",
      width:    "@",
      videoid:  "@"  
    },

    template: '<div></div>',

    link: function(scope, element, attrs) {
      var tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      var player;

      $window.onYouTubeIframeAPIReady = function() {
        player = new YT.Player(element.children()[0], {
          height: scope.height,
          width: scope.width,
          videoId: scope.videoid
        });
      };
    },  
  }
});

app.controller( 'MainCtrl', [ '$http', '$scope', function( $http, $scope ) {

  $http.get('http://localhost:3000/movies')
    .then( function ( response ) {
        $scope.movies = response.data;
    }, function( error ) {
        console.log( error );
    });
  
  $scope.addPost = function() {
    if(!$scope.title || $scope.title === '') { return; }
    $scope.movies.push({ title: $scope.title, upvotes: 0 });
    $scope.title = '';
  };

  $scope.incrementUpvotes = function( summary ) {
    summary.upvotes += 1;
  };
}]);

app.controller( 'MoviesCtrl', [ '$http', '$scope', '$routeParams', function( $http, $scope, $routeParams ) {

    $http.get('http://localhost:3000/movies/'+[$routeParams.id])
    .then( function ( response ) {
        $scope.movie = response.data;

        $scope.youtube = {
          height:   '480',
          width:    '100%',
          videoid:  $scope.movie.trailer_url
        };
    }, function( error ) {
        console.log( error );
    });

}]);

app.controller( 'MoviesCreateCtrl', [ '$http', '$location', '$scope', '$routeParams', function( $http, $location, $scope, $routeParams ) {

  $scope.createMovie = function(){
      if($scope.movie.title === '') { return; }
      if($scope.movie.genre === '') { return; }
      if($scope.movie.title_image_url === '') { return; }
      if($scope.movie.trailer_url === '') { return; }

      var genre = $scope.movie.genre.split(", ");

      $http({
          method: "POST",
          url: "http://localhost:3000/movies/",
          data: {
            title: $scope.movie.title,
            genre: genre,
            title_image_url: $scope.movie.title_image_url,
            trailer_url: $scope.movie.trailer_url
          }
      })
      .then( function( response ){
          $location.path( "/" );
      })
  };

}]);

app.controller( 'MoviesEditCtrl', [ '$http', '$location', '$scope', '$routeParams', function( $http, $location, $scope, $routeParams ) {

    $scope.movie = {};

    $http.get('http://localhost:3000/movies/'+[$routeParams.id])
    .then( function ( response ) {
        $scope.movie = response.data;

        $scope.youtube = {
          height:   '100%',
          width:    '100%',
          videoid:  $scope.movie.trailer_url
        };
    }, function( error ) {
        console.log( error );
    });

  $scope.updateMovie = function(){
      if($scope.movie.title === '') { return; }
      if($scope.movie.genre === '') { return; }
      if($scope.movie.title_image_url === '') { return; }
      if($scope.movie.trailer_url === '') { return; }

      var genre = $scope.movie.genre.split(", ");

      $http({
          method: "PUT",
          url: "http://localhost:3000/movies/"+[$routeParams.id],
          data: {
            title: $scope.movie.title,
            genre: genre,
            title_image_url: $scope.movie.title_image_url,
            trailer_url: $scope.movie.trailer_url
          }
      })
      .then( function( response ){
          $location.path( "/movies/"+[$routeParams.id] );
      })
  };

}]);
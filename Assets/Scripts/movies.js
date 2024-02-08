var key = "5ddf64d5";

function getMovieInfo(searchTerm){
    fetch(`http://www.omdbapi.com/?apikey=${key}&s=${searchTerm}`)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {

        for(movie of data.Search){
            fetch(`http://www.omdbapi.com/?apikey=${key}&i=${movie.imdbID}`)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {

                var $movieCard = $("<li>", {class: 'movie-card main-color ui-state-default'})
                //data.Title
                $movieCard.append(`<h3 class = 'info title'>${data.Title}</h3>`)
                //data.Released
                $movieCard.append(`<div class = 'info release'>${data.Released}</div>`)
                //data.Genre
                $movieCard.append(`<div class = 'info genre'>${data.Genre}</div>`)
                //data.imdbRating
                $movieCard.append(`<div class = 'info imdb-rating'>${data.imdbRating}/10.0</div>`)
                //data.Poster
                $movieCard.append(`<img class = 'image poster' src = '${data.Poster}'></h3>`)
                //
                // Make the item a draggable ui element
                $movieCard.draggable({
                    cancel: "a.ui-icon", // clicking an icon won't initiate dragging
                    revert: "invalid", // when not dropped, the item will revert back to its initial position
                    containment: "document",
                    helper: "clone",
                    cursor: "move"
                })

                $('#movie-results').append($movieCard);
            })
        }
    })  
}
$(function(){
    var $selectionList = $('#selection-list'), $movieResults = $('#movie-results'), $recipeResults = $('#recipe-results'), $favorites = $('#favorites');

    $selectionList.droppable({
        accept: ".movie-card",
        classes: {
          "ui-droppable-active": "ui-state-highlight"
        },
        drop: function( event, ui ) {
          moveItem( ui.draggable );
        }
      });

    function moveItem( $item ) {
        $item.fadeOut(function() {
        $item.appendTo($selectionList).fadeIn();
        });
      }
  });
  
$('#search-movie').on('submit', (event) => {
    event.preventDefault();
    $('#movie-results').empty();
    getMovieInfo($('input[name="search-movie-input"]').val())
})
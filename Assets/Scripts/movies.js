const movieKey = "5ddf64d5";
const recipeKey = '38111c8e91ad4c0ea2c50e3a7327dfc9';

function getSearchInfo(formData){
    console.log(formData);
    var searchTerm = formData[0].value;
    
    fetch(`http://www.omdbapi.com/?apikey=${movieKey}&s=${searchTerm}`)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        for(movie of data.Search){
            fetch(`http://www.omdbapi.com/?apikey=${movieKey}&i=${movie.imdbID}`)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                console.log(data);
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

                // Make the item a draggable ui element
                $movieCard.draggable({
                    cancel: "a.ui-icon", // clicking an icon won't initiate dragging
                    revert: "invalid", // when not dropped, the item will revert back to its initial position
                    containment: "document",
                    helper: "clone",
                    cursor: "move"
                })
                
                $movieCard.on( "click", function(event) {
                    var $item = $( this ),
                        $target = $( event.target );
               
                    if ($target.is( 'a.ui-icon-close')) {
                      deleteItem($item);
                    }
               
                    return false;
                });

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
          selectItem( ui.draggable );
        }
      });
    
    var removeIcon = "<a href='I/dont/know/what/this/should/be' title='remove this selection' class='ui-icon ui-icon-close'>Remove Selecion</a>"
    function selectItem( $item ) {
        $item.clone(true)
            .append(removeIcon)
            .appendTo($selectionList)
            .fadeIn();
      }
  });
  
function deleteItem( $item ) {
    $item.fadeOut(function() {
        $item.remove();
    });
}

$('.search-form').on('submit', (event) => {
    event.preventDefault();
    $(event.target).parent('results-list').empty();
    getSearchInfo($(event.target).serializeArray());
})
const movieKey = "5ddf64d5";
const recipeKey = "38111c8e91ad4c0ea2c50e3a7327dfc9";

function getSearchInfo($form){
    var formData = $form.serializeArray();
    var searchTerm = formData[0].value;
    
    var searchURL;
    if($form.data('search-type') === 'movie'){
        searchURL = `http://www.omdbapi.com/?apikey=${movieKey}&s=${formData[0].value}`;
    }
    if($form.data('search-type') === 'recipe'){
        searchURL = `http://api.spoonacular.com/recipes/complexSearch?apiKey=${recipeKey}&query=${formData[0].value}&number=5`;
    }
    fetch(searchURL)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        var dataArray
        if($form.data('search-type') === 'movie'){
            dataArray = data.Search;
        }
        if($form.data('search-type') === 'recipe'){
            dataArray = data.results;
        }

        for(item of dataArray){
            if($form.data('search-type') === 'movie'){
                searchURL = `http://www.omdbapi.com/?apikey=${movieKey}&i=${item.imdbID}`;
            }
            if($form.data('search-type') === 'recipe'){
                searchURL = `http://api.spoonacular.com/recipes/${item.id}/information?apiKey=${recipeKey}`;
            }
            fetch(searchURL)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                console.log(data);
                var $itemCard = $("<li>", {class: `movie item-card main-color ui-state-default`})
                
                if($form.data('search-type') === 'movie'){
                    //data.Title
                    $itemCard.append(`<h3 class = 'info title'>${data.Title}</h3>`)
                    //data.Released
                    $itemCard.append(`<div class = 'info release'>${data.Released}</div>`)
                    //data.Genre
                    $itemCard.append(`<div class = 'info genre'>${data.Genre}</div>`)
                    //data.imdbRating
                    $itemCard.append(`<div class = 'info imdb-rating'>${data.imdbRating}/10.0</div>`)
                    //data.Poster
                    $itemCard.append(`<img class = 'image poster' src = '${data.Poster}'></h3>`)   
                    
                }
                if($form.data('search-type') === 'recipe'){
                    $itemCard.append(`<h3 class = 'info title'>${data.title}</h3>`)
                    $itemCard.append(`<img class = 'image poster' src = '${data.image}'>`)
                }
                

                // Make the item a draggable ui element
                $itemCard.draggable({
                    cancel: "a.ui-icon", // clicking an icon won't initiate dragging
                    revert: "invalid", // when not dropped, the item will revert back to its initial position
                    containment: "document",
                    helper: "clone",
                    cursor: "move"
                })
                
                $itemCard.on( "click", function(event) {
                    var $item = $( this ),
                        $target = $( event.target );
               
                    if ($target.is( 'a.ui-icon-close')) {
                        deleteItem($item);
                    } else if ($target.is('a.ui-icon-star')) {
                        favoriteItem($item);
                    }
                    return false;
                });
                console.log($(`ul.results-list[data-search-type=${$form.data('search-type')}]`));
                $(`ul.results-list[data-search-type=${$form.data('search-type')}]`).append($itemCard);
            })
        }
    })  
}
$(function(){
    var $movieSelectionList = $('ul.selection-list[data-search-type=movie]'),
        $recipeSelectionList = $('ul.selection-list[data-search-type=recipe]');

    $movieSelectionList.droppable({
        accept: ".item-card",
        classes: {
          "ui-droppable-active": "ui-state-highlight"
        },
        drop: function( event, ui ) {
          selectItem( ui.draggable, $(event.target) );
        }
      });
    
      $recipeSelectionList.droppable({
        accept: ".item-card",
        classes: {
          "ui-droppable-active": "ui-state-highlight"
        },
        drop: function( event, ui ) {
          selectItem( ui.draggable ,$(event.target));
        }
      });
    var removeIcon = "<a href='I/dont/know/what/this/should/be' title='remove this selection' class='ui-icon ui-icon-close'>Remove Selecion</a>"
    var favoriteIcon = "<a href='I/dont/know/what/this/should/be' title='favorite this selection' class='ui-icon ui-icon-star'>Favorite Selecion</a>"
    
    function selectItem( $item, $target) {
        $item.clone(true)
            .append(removeIcon)
            .append(favoriteIcon)
            .appendTo($target)
            .fadeIn();
      }
  });
  
function deleteItem( $item ) {
    $item.fadeOut(function() {
        $item.remove();
    });
}

function favoriteItemItem( $item ) {
    var favorite
}
$('.search-form').on('submit', (event) => {
    event.preventDefault();
    $(event.target).parent('results-list').empty();
    getSearchInfo($(event.target));
})
const movieKey = "5ddf64d5";
const recipeKey = "38111c8e91ad4c0ea2c50e3a7327dfc9";


$(function(){
    // Define jQuery references for HTML elements
    var $movieResultsList = $('ul.movie.results-list'),
        $movieSelectionList = $('ul.movie.selection-list'),
        $recipeResultsList = $('ul.recipe.results-list'),
        $recipeSelectionList = $('ul.recipe.selection-list');
    
    // Enable Tab functionality
    $('.tabs').tabs();

    //TODO: on initializing page, load saved favorite items and add them to favorited items list
    //  ideas: We can save a list of just the id for the item and make an api call on page load to make sure item info is up to date

    // Sends a request to specified url and passes the data recieved through the callback function
    function fetchAPIData(url, callback){
        fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            callback(data);
        })
    }

    // Search resolution for form submission with type 'movie'
    function movieSearch(formData) {
        // Clear old results
        $movieResultsList.empty();
        // Define url for api request
        var search = formData[0].value;
        var apiURL = `http://www.omdbapi.com/?apikey=${movieKey}&s=${search}`;
        
        // Send a GET request to defined url 
        fetchAPIData(apiURL, (data) => {
            // For each item returned
            for(var item of data.Search){
                // Define a url for api request
                var itemURL = `http://www.omdbapi.com/?apikey=${movieKey}&i=${item.imdbID}`;
                // Send a GET request to defined url
                fetchAPIData(itemURL, (data) => {
                    // Create and add a new card to the results list based on recieved data
                    newMovieCard(data).appendTo($movieResultsList);
                })
            }
        })
    }

    // Search resolution for form submission with type 'recipe'
    function recipeSearch(formData) {
        // Clear old results
        $('#recipe-results').empty();
        var foodQuery = formData[0].value;
        
        // Define url for api request
        var apiUrl = 'https://api.spoonacular.com/recipes/complexSearch?apiKey=' + recipeKey + '&query='+ foodQuery + '&number=5';

        // Send a GET request to defined url 
        fetch(apiUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function(data) {
            for(var recipe of data.results){
                var recipeId = recipe.id;
                var secondFetchUrl = 'https://api.spoonacular.com/recipes/' + recipeId + '/information?apiKey=' + recipeKey + '&i=';

                fetch(secondFetchUrl)
                .then(function(response) {
                    return response.json();
                })
                .then(function(data) {
                    newRecipeCard(data).appendTo($recipeResultsList);
                })
            }
        })
    }

    // Create a new card representing movie data and add it to the list of search results
    function newMovieCard(data){
        // Create card to hold the data
        return newCard().addClass('movie')
        .data('id', data.imdbID)
        // Append movie specific data
        // data.Title
        .append($('<h3 />', {
                    class: 'info title',
                    text: `${data.Title}`
                }))
        // data.Released
        .append($('<div />', {
                    class : 'info release',
                    text : `${data.Released}`
                }))
        // data.Genre
        .append($('<div />', {
                    class : 'info genre',
                    text : `${data.Genre}`
                }))
        // data.imdbRating
        .append($('<div />', {
                    class : 'info imdb-rating',
                    text : `${data.imdbRating}/10.0`
                }))
        // data.Poster
        .append($('<img />', {
                    class : 'image poster',
                    src : `${data.Poster}`
                }));
    }

    // Create a new card representing recipe data and add it to the list of search results
    function newRecipeCard(data){
        // Create card to hold the data
        
        return newCard().addClass('recipe')
        .data('id', data.id)

        .data('recipe-url', data.sourceUrl)
        // Append recipe specific data
        .append(`<h3>${data.title}`)

        .append(`<img src = '${data.image}'>`)
        .append(`<a href='${data.sourceUrl} class='recipe-url' target="_blank">Recipe Link</a>`);
        
    }

    function newDateCard(data){
        var $dateCard = newCard();

        // Define URLs to query api's
        var movieURL = `http://www.omdbapi.com/?apikey=${movieKey}&i=${data.movieID}`;
        var recipeURL = 'https://api.spoonacular.com/recipes/' + data.recipeID + '/information?apiKey=' + recipeKey + '&i=';
        
        // Create a Movie card and append it to new date card
        // Send a GET request to defined url
        fetchAPIData(movieURL, (data) => {
            // Create and add a new card to the results list based on recieved data
            newMovieCard(data).appendTo($dateCard);                    
        })

        // Create a Recipe card and append it to new date card
        fetch(recipeURL)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            newRecipeCard(data).appendTo($dateCard);
        })

        // Return the new card
        return $dateCard
    }
    // Create and return new card all cards should be based on
    function newCard(){
        // Create a new base card
        var $newCard = $("<li />", {
                class: `item-card ui-state-default`});

        // Define listeners for the card
        // Makes the card a draggable element
        $newCard.draggable({
            cancel: "a.ui-icon", // clicking an icon won't initiate dragging
            revert: "invalid", // when not dropped, the item will revert back to its initial position
            containment: "document",
            helper: "clone",
            cursor: "move"
        })
        
        // Add icon handling behavior
        // Note: the icons aren't being added here, just information on what to do with icons added in the future
        $newCard.on( "click", function(event) {
            var $item = $(this),
                $target = $(event.target);
            
            // If the delete selection icon is clicked
            if ($target.is( 'a.ui-icon-close')) {
                deleteItem($item);
                return false;
            }
        });
        return $newCard;
    }

    // TODO: The next two sections might be able to be collapsed into a single jquery call. More research needed
    // Make the movieSelectionList area a droppable area
    $movieSelectionList.droppable({
        // Only accept item cards with movie class
        accept: ".item-card.movie",
        // Not entirely sure how this one works, but it's highlighting the droppable area while dragging
        classes: {
            "ui-droppable-active": "ui-state-highlight"
        },
        // Define function to run on item that is dropped in the area
        drop: function( event, ui ) {
            // (item dropped, this area)
            selectItem( ui.draggable, $(event.target));
        }
    });
    
    // Make the recipeSelectionList area a droppable area
    $recipeSelectionList.droppable({
        // Only accept item cards with movie class
        accept: ".item-card.recipe",
        // Not entirely sure how this one works, but it's highlighting the droppable area while dragging
        classes: {
          "ui-droppable-active": "ui-state-highlight"
        },
        // Define function to run on item that is dropped in the area
        drop: function( event, ui ) {
            // (item dropped, this area)
            selectItem( ui.draggable ,$(event.target));
        }
    });

    // Define icon prefabs to add to cards
    var removeIcon = "<a href='I/dont/know/what/this/should/be' title='remove this selection' class='ui-icon ui-icon-close'>Remove Selecion</a>";
    

    // TODO: Add duplicate detection. Currently, selecting the same card multiple times creates multiple instances of the same item
    // Make a copy of item card and add it to list of selected cards
    function selectItem( $item, $target) {
        // Make a deep copy of dropped item and it's listeners
        $clone = $item.clone(true);
        // Clone is faded out
        $clone.fadeOut(0,() =>{
            // Add a ui icon to delete clone card
            $clone.append(removeIcon)
            // add clone to droppable list area
            .appendTo($target)
            // fade clone in
            .fadeIn();
        })
      }

    // Delete the item from it's selection list
    function deleteItem( $item ) {
        // Fade out the item
        $item.fadeOut(function() {
            // Remove the item from the DOM
            $item.remove();
        });
    }

    
    
    function loadFavorites(){
        var favoriteDates = JSON.parse(localStorage.getItem('favoriteDates'));
        if(!favoriteDates){
            favoriteDates = [];
        }

        return favoriteDates;
    }

    // Function to add the information of an item to list of favorites and save a reference for it in local storage
    function saveFavoriteDate( $item ) {
        //TODO: Handle adding an item to the list of favorites and storing it in local storage
        var movieID = $item[0].data('id'),
            recipeID = $item[1].data('id');
            newDate = {movieID, recipeID};
        

        favorites = loadFavorites();
        favorites.push({movieID, recipeID});
        $(newDateCard(newDate)).appendTo('#favorites-list');
        localStorage.setItem('favoriteDates', JSON.stringify(favorites));
    }


    // Function to generate a random set of activities and display them as a dialog modal
    function generateDate(){
        var $randomMovie = pickRandomItem($movieSelectionList),
            $randomRecipe = pickRandomItem($recipeSelectionList);


            dateArray = [];

        dateArray.push($randomMovie);
        dateArray.push($randomRecipe);

        return dateArray;
    }
    // Selects a random item from a list and returns a reference
    function pickRandomItem($itemList){
        var randomItem;

        //TODO: pick a random item from the list
        randomItem = $itemList[0].children[Math.floor(Math.random() * $itemList[0].children.length)];

        return $(randomItem);
    }

    // Attach a listener to the search forms
    $('form.search-form').on('submit', function(event) {
        // Prevent default submit function
        event.preventDefault();
        // Serialize form data (not too important for now, but will make sense when more information is added to the forms)
        formData = $(event.target).serializeArray();
        // Determine a destination for the data and send it there
        switch($(event.target).data('search-type')){
            case 'movie':
                movieSearch(formData);
                break;
            case 'recipe':
                recipeSearch(formData);
                break;
            default:
                //TODO: write some better error handling
                console.log("This shouldn't have happened");
        }
    })

    // On load, populate favorited date pairings
    for(var date of loadFavorites()){
        $(newDateCard(date)).appendTo('#favorites-list');
    }

    // Event Listener Section
    $('#generate').on('click', function(){
        var currentDate = generateDate();
        var currentMovie = currentDate[0].clone(true);
        var currentRecipe = currentDate[1].clone(true);


        $('#modal').dialog({
            title: 'Your Date',
            height: 800,
            width: 850,

            buttons: [
                {
                    text: 'Save Date',
                    click: function(){
                        $(this).dialog('close');
                        saveFavoriteDate(currentDate);
                    }
                }
            ]
        });

        $('#modal').append(currentMovie);
        $('#modal').append(currentRecipe);
    })
    // Attach a listener to the generate date button

});
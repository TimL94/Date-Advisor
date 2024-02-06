var key = "5ddf64d5";
var $movieList = $('#movie-list');

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

                var $movieCard = $("<li>", {class: 'movie-card'})
                //data.Title
                $movieCard.append(`<h3 class = 'info title'>${data.Title}</h3>`)
                //data.Released
                $movieCard.append(`<div class = 'info release'>${data.Released}</div>`)
                //data.imdbRating
                $movieCard.append(`<div class = 'info imdb-rating'>${data.imdbRating}/10.0</div>`)
                //data.Poster
                $movieCard.append(`<img class = 'image poster' src = '${data.Poster}'></h3>`)
                //
                $movieList.append($movieCard);
            })
        }
    })  
}

$('#search-movie').on('submit', (event) => {
    event.preventDefault();
    $movieList.empty();
    getMovieInfo($('input[name="search-movie-input"]').val())
})
// getMovieInfo("Batman");
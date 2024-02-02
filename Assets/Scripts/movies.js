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
                var $movieCard = $("<div>", {class: 'movie-card'})
                //data.Title
                $movieCard.append(`<h3 class = 'title'>${data.Title}</h3>`)
                //data.Released
                $movieCard.append(`<div class = 'release'>${data.Released}</div>`)
                //data.imdbRating
                $movieCard.append(`<div class = 'imdb-rating'>${data.imdbRating}</div>`)
                //data.Poster
                $movieCard.append(`<img class = 'poster' src = '${data.Poster}'></h3>`)
                //
                $movieList.append($movieCard);
            })
        }
    })  
}

getMovieInfo("Batman");
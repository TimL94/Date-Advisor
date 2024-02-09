$('#search-recipe-button').on('click', function(event){
    event.preventDefault();
    var apiKey = '38111c8e91ad4c0ea2c50e3a7327dfc9';
    var foodQuery = $('#search-recipe-input').val();
    $('#recipe-results').empty();



    var apiUrl = 'https://api.spoonacular.com/recipes/complexSearch?apiKey=' + apiKey + '&query='+ foodQuery + '&number=5' + '&query=pasta';

    fetch(apiUrl)
    .then(function(response) {
        return response.json();
    })
    .then(function (data) {
        console.log(data);
        for (current of data.results){
            var recipeId = current.id;
            var secondFetchUrl = 'https://api.spoonacular.com/recipes/' + recipeId + '/information?apiKey=' + apiKey + '&i=';
            fetch(secondFetchUrl)
            .then(function(response){
                return response.json();
            })
            .then(function(data){
                console.log(data);
                var $movieCard = $("<li>", {class: 'movie-card main-color ui-state-default'});

                $movieCard.append(`<h3 class = 'info title'>${data.title}</h3>`)
                $movieCard.append(`<img class = 'image poster' src = '${data.image}'>`)

                $('#recipe-results').append($movieCard);
            })
        }


        
    })
})
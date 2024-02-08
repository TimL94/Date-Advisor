$('#search-recipe-button').on('click', function(event){
    event.preventDefault();
    var apiKey = '38111c8e91ad4c0ea2c50e3a7327dfc9';
    var foodQuery = $('#search-recipe-input').val();
    console.log(foodQuery);



    var apiUrl = 'https://api.spoonacular.com/recipes/complexSearch?apiKey=' + apiKey + '&query='+ foodQuery + '&number=5' + '&query=pasta';

    fetch(apiUrl)
    .then(function(response) {
        return response.json();
    })
    .then(function (data) {
        console.log(data);    
        for (i=0; i < data.results.length; i++){
            var recipeInoUrl = 'https://api.spoonacular.com/recipes/' + data.results[i].id + '/information?apiKey=' + apiKey;
            fetch(recipeInoUrl)
            .then(function(response) {
            return response.json();
            })
            .then(function(data) {
                console.log(data);
        })
        }
        
    })
})
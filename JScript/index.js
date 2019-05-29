$(document).ready(function () {
    var showGame = document.getElementById('showGame');
    showGame.innerHTML = '';
    fetch("http://localhost:3000/products")
    .then(function(response) {
        return response.json();
      })
    .then(function(data) {
        let authors = data.results; // Get the results
        console.log(data.products);
        for(var x in data.products){
            var game = data.products[x];
            console.log(game.productImage)
            showGame.innerHTML += `<div class="card" style="width: 325px;margin:10px;" onclick="goto()">
                                        <img class="card-img-top" src="http://localhost:3000/${game.productImage}" alt="Card image cap">
                                        <div class="card-body">
                                            <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                                        </div>
                                    </div>`
        }
    })
});

function change(){
    $("#loginModal").modal('hide');
    $("#registerModal").modal('show');
}

function signUp(){

}

function goto() { 
    window.location.replace("HelloWorld");
 }

function check(){
    var showGame = document.getElementById('showGame');
    showGame.innerHTML = '';
    showGame.innerHTML += '<div class = "box" style="background-color: black"></div>'
}

function search(){
    
}


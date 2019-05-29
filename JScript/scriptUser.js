$(document).ready(function(){
    var queryString = decodeURIComponent(window.location.search);
    var id = (queryString.split('='))[1];
  
    fetch(`http://localhost:3000/products/findByProductId/${id}`)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
        document.getElementById('nameLabel').innerHTML = `${data.firstName} ${data.lastName}`;
        document.getElementById('ageLabel').innerHTML = data.age;
        document.getElementById('emailLabel').innerHTML = data.email;
        document.getElementById('addressLabel').innerHTML = data.address;
        document.getElementById('pointLabel').innerHTML = data.pointer;
    })
});

function initialData(){

    var el = document.getElementById('nameLabel');
    var text = (el.innerText || el.textContent);
    var arrayName = text.split(" ");
    document.getElementById('firstNameEdit').value = arrayName[0];
    document.getElementById('lastNameEdit').value = arrayName[1];

    el = document.getElementById('ageLabel');
    text = (el.innerText || el.textContent);
    document.getElementById('ageEdit').value = text;

    el = document.getElementById('emailLabel');
    text = (el.innerText || el.textContent);
    document.getElementById('emailEdit').value = text;

    el = document.getElementById('addressLabel');
    text = (el.innerText || el.textContent);
    document.getElementById('addressEdit').value = text;
}

function reset(BtnID){
    document.getElementById(BtnID).value="";
}

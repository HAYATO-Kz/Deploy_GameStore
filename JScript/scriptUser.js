$(document).ready(function(){
    var queryString = decodeURIComponent(window.location.search);
    var text = (queryString.split('?'))[1];
    var token = (text.split('@'))[1];
    var id = (((text.split('@'))[0]).split('='))[1];

        // Get User Json
        $.ajax({
            url: "http://localhost:3000/users/" + id,
            type: 'GET',
            beforeSend: function(req) {
                req.setRequestHeader('Authorization', 'Bearer ' + token);
            },
            success: function(data) {
                data = data.user[0];
                document.getElementById('nameLabel').innerHTML = `${data.name.first_name} ${data.name.last_name}`;
                document.getElementById('ageLabel').innerHTML = data.age;
                document.getElementById('emailLabel').innerHTML = data.email;
                document.getElementById('addressLabel').innerHTML = data.address;
                document.getElementById('pointLabel').innerHTML = data.point;
            }
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

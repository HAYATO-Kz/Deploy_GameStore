function initialData(){

    var el = document.getElementById('nameLabel');
    var text = (el.innerText || el.textContent);
    var arrayName = text.split(" ");
    document.getElementById('firstNameEdit').value = arrayName[0];
    document.getElementById('lastNameEdit').value = arrayName[1];

    el = document.getElementById('ageLabel');
    text = (el.innerText || el.textContent);
    // var number = parseInt(text);
    document.getElementById('ageEdit').value = text;

    el = document.getElementById('emailLabel');
    text = (el.innerText || el.textContent);
    document.getElementById('emailEdit').value = text;

    el = document.getElementById('addressLabel');
    text = (el.innerText || el.textContent);
    document.getElementById('addressEdit').value = text;

}
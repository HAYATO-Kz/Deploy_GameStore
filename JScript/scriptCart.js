var text;
var cartId;
var userId;
var productId;

$(document).ready(function() {
    var queryString = decodeURIComponent(window.location.search);
    text = queryString.split("?")[1];
    productId = text.split("@")[1];
    cartId = text.split("@")[0].split("=")[1];

    fetch("http://localhost:3000/cart/" + cartId)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            console.log(data);
            fetch("http://localhost:3000/stock/")
                .then(function(response) {
                    return response.json();
                })
                .then(function(data) {
                    console.log(
                        data.filter(function(item) {
                            return item.productId == productId;
                        })
                    );
                });
        });
});

function reRun(cart) {
    var showItem = document.getElementById("cartBody");
    for (var x in cart) {
        var item = cart[x];
        showItem.innerHTML += `<tr class="d-flex">
        <td class="col-md-4" id="titleId">Mark</td>
        <td class="col-md-3" id="quantityId">Otto</td>
        <td class="col-md-3" id="priceId">@mdo</td>
    <td class="coฃl-md-2">
            <div class="row">
                <div class="col-md-10">
                    <button type="button" class="btn btn-secondary btn-block dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        EDIT
                    </button>
                    <div class="dropdown-menu">
                        <div class="form-group container">
                            <label for="newQuantityInput">New Quantity</label>
                            <input type="number" id="newQuantityInput" class="form-control mb-3">
                            <button class="btn btn-secondary btn-block">EDIT</button>
                        </div>
                    </div>
                </div>
                <div class="col-md-2">
                    <button type="button" class="close" aria-label="Close" onclick="deleteRow(this)">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
            </div>
        </td>
    </tr>`;
    }
}

function deleteRow(docID) {
    $.ajax({
        url: "http://localhost:3000/carts/delete/" + cartId,
        type: 'DELETE',
        success: function(res) {
            docID.closest("tr").remove();
        }
    })


}

function deleteAll() {
    //ยังไม่ได้ สร้าง
    $.ajax({
        url: "http://localhost:3000/carts/deleteAll/" + userId,
        type: 'DELETE',
        success: function(res) {
            docID.closest("tr").remove();
        }
    })
}

function endBuyProcess() {
    $("#cartTable")
        .find("tr:gt(0)")
        .remove();
    $("#paymentChoose").collapse("hide");
    $("#addressChoose").collapse("hide");
}

function useOld() {
    document.getElementById("inputNewAddress").disabled = true;
}

function useNew() {
    document.getElementById("inputNewAddress").disabled = false;
}

function edit() {
    var quantity = document.getElementById('newQuantityInput').value;

    var data = {
        propName: "quantity",
        value: parseInt(quantity)
    };

    $.ajax({
        dataType: "json",
        url: "http://localhost:3000/carts/update/" + cartId,
        type: "PATCH",
        data: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        },
        success: function(res) {
            document.getElementById('quantityId').innerHTML = quantity;
        }
    });
}
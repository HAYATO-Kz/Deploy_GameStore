function deleteRow(docID){
    docID.closest('tr').remove();
};

function endBuyProcess(){
    $("#cartTable").find("tr:gt(0)").remove();
    $("#paymentChoose").collapse('hide');
    $("#addressChoose").collapse('hide');
}

function useOld(){
    document.getElementById('inputNewAddress').disabled = true;
}

function useNew() {
    document.getElementById('inputNewAddress').disabled = false;
}

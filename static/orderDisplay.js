var myObj;

function generateOrderTable(data){
    var table = "<table border='1' id='order-table'>";
    table += "<tr><th>Order Number</th><th>Order Detail</th><th>Total Price</th><th></th></tr>";
    for(row in myObj){
        table += "<tr id='" + data[row][0] + "'><td>" + data[row][0] + "</td><td>" + data[row][3] + "</td><td>" + data[row][1] + "</td><td><button id='complete" + data[row][0]  + "'>Complete</button></td></tr>";
    }
    table += "</table>";
    
    document.getElementById("updatedOrders").innerHTML = table;
    var buttonArr = Array();
    for(row in myObj){
        var id = document.getElementById("complete" + data[row][0]);
        buttonArr.push(id);
    }
    buttonArr.forEach(function(button, index){
        button.addEventListener("click",  function(){orderCompleted(button.id.substring(8))});
    })
}

function initial(){
    fetch('/selectOrdersNotComplete')
    .then(function(response){
        return response.json();
    }).then(function(data){
        myObj = data;
        generateOrderTable(data);
    })
}

function orderCompleted(rowID){
    // order to be removed from the table by simply calling the same path as above
    fetch('/updateOrdersCompleted/' + rowID, {
        method:'PUT'
    })
        .then(function(response){
            return response
        }).then(function(data){
            initial();
        });    
}

setTimeout(initial, 10000);
window.onload = initial;
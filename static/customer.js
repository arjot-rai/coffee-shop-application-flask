var order = {};
var itemName = {};
var itemPrice = {};
var myObj;


function initial(){
    fetch('/selectMenu')
        .then(function(response){
            return response.json();
        }).then(function(data){
            myObj = data;
            var table = "<table border='1' id='menu-table'>";
            table += "<tr><th>Item</th><th>Price</th><th></th><th></th></tr>";
            for(row in data){
                table += "<tr id='" + data[row][0] + "'><td>" + data[row][1] + "</td><td>" + data[row][2] + "</td><td><button id='add" + data[row][0]  + "'>Add</button></td><td><button id='remove" + data[row][0] + "'>Remove</button></tr>";
            }
            table += "</table>";
            
            document.getElementById("menu").innerHTML = table;
            var buttonarr = Array();
            for(row in data){
                let id = document.getElementById("add" + data[row][0]);
                buttonarr.push(id);
            }
            buttonarr.forEach(function(button, index){
                button.addEventListener("click", function(){addToOrder(button.id.substring(3))});
                
            })
            var buttonarr = Array();
            for(row in data){
                let id = document.getElementById("remove" + data[row][0]);
                buttonarr.push(id);
            }
            buttonarr.forEach(function(button, index){
                button.addEventListener("click", function(){removeFromOrder(button.id.substring(6))});            
            })


        })

}

function showOrders(){
    var table = "<table border='1' id='order-table'>";
    table += "<tr><th>Item</th><th>Price</th><th>Quantity</th>";
    for(i in order){
        table += "<tr><td>" + itemName[i] + "</td><td>" + itemPrice[i] + "</td><td>" + order[i] + "</td>";
    }

    table += "<tr><td>SubTotal</td><td></td><td>" + calculateTotalPrice() + "</td>";
    table += "</table>";
    document.getElementById("selected").innerHTML = table;    

}

function addToOrder(itemID){
    if(!(itemID in order)){
        order[itemID] = 1;
        for(row in myObj){
            if(itemID == myObj[row][0]){
                itemName[itemID] = myObj[row][1];
                itemPrice[itemID] = myObj[row][2];
            }
        }

    } else{
        order[itemID] += 1;
    }
    
    showOrders();
}

function removeFromOrder(itemID){
    if(itemID in order){
        order[itemID] -= 1;
        if(order[itemID] == 0){
            delete order[itemID];
            delete itemName[itemID];
            delete itemPrice[itemID];
        }
    }
    
    showOrders();
}
//submits oders to be stored in the in the orders table 
function submitOrder(){
    if(Object.keys(order).length == 0){
        alert("order cannot be empty!");
    }else{
        var totalPrice = calculateTotalPrice();
        var time = new Date();

        fetch('/insertOrders', {
            method: "POST", 
            body: JSON.stringify({ 
                detail: JSON.stringify(order), 
                total: totalPrice, 
                isCompleted: 0,
                time: time 
            }), 
            headers: { 
                "Content-type": "application/json; charset=UTF-8"
            } 
        }).then(function(response){
            return response.json()
        }).then(function(data){
            console.log(data)
            alert("Your order number is: " + data);
            document.getElementById("selected").innerHTML = "";
            order = {}
        })
    }
}

function checkOrder(){
    var http = new XMLHttpRequest();
    var url = '/orders';

    http.open('GET', url, true);
    http.onreadystatechange = function(){
        document.open();
        document.write(this.responseText);
        document.close();
    }
    http.send();
}

function calculateTotalPrice(){
    var total = 0.0;
    for(row in myObj){
        if(myObj[row][0] in order){
            total += myObj[row][2] * order[myObj[row][0]];
        }
    }
    
    return total;
}

window.onload = initial;
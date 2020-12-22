window.onload = initial;
function initial(){
    fetch('/selectMenu')
    .then(function(response){
        return response.json();
    }).then(function(data){
        myObj = data;
        var table = "<table border='1' id='menu-table'>";
        table += "<tr><th>Item</th><th>Price</th><th></th></tr>"
        for(row in data){
            table += "<tr id='" + data[row][0] + "'><td>" + data[row][1] + "</td><td>" + data[row][2] + "</td><td><button id='editMenu" + data[row][0]  + "'>Change Price</button></td><td><button id='removeMenu" + data[row][0] + "'>Remove</button></tr>";
        }
        table += "</table>";
        
        document.getElementById("editableMenu").innerHTML = table;
        var buttonarr = Array();
        for(row in data){
            let id = document.getElementById("editMenu" + data[row][0]);
            buttonarr.push(id);
        }
        buttonarr.forEach(function(button, index){
            button.addEventListener("click", function(){changePrice(button.id.substring(8))});
            
        })
        var buttonarr = Array();
        for(row in data){
            let id = document.getElementById("removeMenu" + data[row][0]);
            buttonarr.push(id);
        }
        buttonarr.forEach(function(button, index){
            button.addEventListener("click", function(){removeFromMenu(button.id.substring(10))});            
        })

    })
}

function changePrice(id){
    var newPrice = prompt("Enter new price: ");

    if(newPrice != null){
        console.log(newPrice)
        fetch('/updateItemInMenu/' + id + "/" + newPrice, {
            method:'PUT'
        })
            .then(function(response){
                return response
            }).then(function(data){
                initial();
            });
    }
}

function removeFromMenu(id){
    console.log(id)
    fetch('/deleteItemInMenu/' + id)
        .then(function(response){
            return response.json()
        })
        .then(function(data){
            console.log(data)
            initial();
        }); 
}

function addItemToMenu(){
    fetch('/insertMenu', {
        method: "POST", 
        body: JSON.stringify({ 
            item: document.getElementById("newmenuitem").value, 
            price: document.getElementById("newmenuitemprice").value, 
        }), 
        headers: { 
            "Content-type": "application/json; charset=UTF-8"
        } 
    }).then(function(response){
        initial()
    });
}
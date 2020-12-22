function getOrderStatus(){
    fetch('/getOrderStatus/' + document.getElementById("orderid").value)
        .then(function(response){
            return response.json()
        })
        .then(function(data){
            if(data == "-1"){
                alert("No such order exists!")
            } else{
                document.getElementById("displayOrderID").innerHTML = "Order number: " + document.getElementById("orderid").value;
                var isCompleted = data == 0 ? "Not Completed" : "Completed"
                document.getElementById("displayStatus").innerHTML = "Order Status: " + isCompleted;
                document.getElementById("orderid").value = "";
            } 
        });
}

function deleteOrder(){

    fetch('/deleteOrder/' + document.getElementById("orderid").value)
        .then(function(response){
            return response.json()
        })
        .then(function(data){
            if(data=="1"){
                alert("Order cancelled!!");
            } else{
                alert("Order cannot be cancelled!!")
            }
        }); 
}
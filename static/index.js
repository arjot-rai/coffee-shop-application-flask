function customer(){
    var http = new XMLHttpRequest();
    var url = '/customer';

    http.open('GET', url, true);
    http.onreadystatechange = function(){
        document.open();
        document.write(this.responseText);
        document.close();
    }
    http.send();
}

function employee(){
    var http = new XMLHttpRequest();
    var url = '/employee';

    http.open('GET', url, true);
    http.onreadystatechange = function(){
        document.open();
        document.write(this.responseText);
        document.close();
    }
    http.send();
}

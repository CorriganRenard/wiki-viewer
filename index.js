//document ready function
function ready(fn) {
    if (document.readyState != 'loading') {
        fn();
    } else {
        document.addEventListener("DOMContentLoaded", fn);

    }
}
//post promise
function post(url){
    return new Promise(function(resolve, reject) {
        var req = new XMLHttpRequest();
        req.open('POST', url);

        req.onload = function() {
            if (req.status == 200) {
                resolve(req.response);
            }
            else {
                reject(Error(req.statusText));
            }
        };
        req.onerror = function() {
            reject(Error("Network Error"));
        }
        req.send();
    });
}
//parse the json gotten from the above post promise
function postJSON(url) {
    return post(url).then(JSON.parse);
}

//get promise
function get(url){
    return new Promise(function(resolve, reject) {
        var req = new XMLHttpRequest();
        req.open('GET', url);

        req.onload = function() {
            if (req.status == 200) {
                resolve(req.response);
            }
            else {
                reject(Error(req.statusText));
            }
        };
        req.onerror = function() {
            reject(Error("Network Error"));
        };
        req.send();
    });
}
//parse the json from the above get promise
function getJSON(url) {
    return get(url).then(JSON.parse);
}

//on form submit run Api Request
function wikiApiRequest(){
    return function(){
        //get the value of the input field
        var inputVar = document.getElementById("input-text").value;
        //api call set-up
        var endPoint = "https://en.wikipedia.org/w/api.php";
        var format = "?format=json";
        var action = "&action=query";
        var extract = "&prop=extracts&exintro="
        var options = "&origin=*&list=search&srsearch="
        var apiCall = endPoint + format + action + extract + options + inputVar;

        //do something with it
        getJSON(apiCall).then(function(results){
            var output = document.getElementById("results");
            output.innerHTML = "";
            console.log(results.query.search);
            for(var key in results.query.search) {
                var pageTitle = results.query.search[key].title;
                var pageSnip = results.query.search[key].snippet;
                console.log(results.query.search[key].title);
                output.innerHTML += "<a href='https://en.wikipedia.org/wiki/" + pageTitle + "'><div class='entry'><h1 class='title'>" + pageTitle + "</h1><p class='snip'>" + pageSnip + "</p></div></a>"
            }

        });
        //reset the form
        document.getElementById("search").reset();
    }
}
// when document is ready, start listening
ready(function(){
    var input = document.getElementById("search");

    input.onsubmit = wikiApiRequest();

});
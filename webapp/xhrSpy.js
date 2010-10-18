(function(){
    var body = document.getElementsByTagName("body")[0];
    var baseUrl = "http://legoas/har/viewer/webapp/";

    var app = document.createElement("iframe");
    app.setAttribute("style",
        "position: absolute;" +
        "bottom: 5px;" +
        "right: 5px;" +
        "width: 600px;" +
        "height: 160px;" +
        "background-color: white;" +
        "border: 3px solid #D7D7D7;" +
        "z-index: 99999999;");

    app.src = baseUrl + "scripts/xhr-spy/spy.php";
    body.appendChild(app);
})();

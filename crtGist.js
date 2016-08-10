;(function () {
    //Event
    var btnCrtGist = document.getElementById("btnCrtGist");
    
    btnCrtGist.addEventListener("click", createGist);
    
    /****Функция создания gist****/
    function createGist() {
        "use strict"
        var fileGist = document.getElementById("inputGistFile"),
            contentGist = document.getElementById("inputGistContent"),
            objRequest = { 
                "files": {
                    [fileGist.value]: {
                    "content": contentGist.value
                    }
                }
            };

        sendPOSTRequest(objRequest, procesRequest);
        
        //Функция отправки POST запроса на создание gist
        function sendPOSTRequest(request, procesRequest) {
            var xhr = new XMLHttpRequest(),
                url = "https://api.github.com/gists";

            xhr.open("POST", url, true);
            xhr.onreadystatechange = function () {
                if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 201) {
                    procesRequest(xhr.responseText);
                };
            };
            xhr.send(JSON.stringify(request));
        };
        //Функция обработки POST запроса
        function procesRequest (strJson) {
            var url = JSON.parse(strJson)["html_url"],
                fldOutLink = document.getElementById("fldOutLink"),
                a = document.createElement("a");
            a.innerHTML = url;
            a.setAttribute("href", url);
            a.setAttribute("target", "_blank");
            
            fldOutLink.innerHTML = "";
            fldOutLink.appendChild(a);
        };
    };
})();
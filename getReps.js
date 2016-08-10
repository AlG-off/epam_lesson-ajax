;(function () {
    //Event
    var inputFld = document.getElementById("inputSrchRep"),
        xhr;

    inputFld.addEventListener("keyup", _.debounce(getTopRepository, 400));

    /*****Функция для поиска ТОР3 репозиториев*****/
    function getTopRepository(e) {
        "use strict"
        var val = e.target.value;

        if(val.length < 3) return;

        sendGETRequest(val, processResponse);

        //Функция отправки GET запроса на получение репозиториев
        function sendGETRequest(request, processResponse) {
            if(xhr) xhr.abort();

            var url = "https://api.github.com/search/repositories?q=" + request + "&sort=stars&order=desc";

            xhr = new XMLHttpRequest();
            xhr.open("GET", url, true);
            xhr.onreadystatechange = function () {
                if(xhr.readyState === 4 && xhr.status === 200) {
                    processResponse(xhr.responseText);
                };
            };
            xhr.send();
        };

        //Функция обработки результата GET запроса
        function processResponse (strJson) {
            var reps = JSON.parse(strJson).items,
                fldOutReps = document.getElementById("fldOutReps"),
                formSndRequest = document.getElementById("formSndRequest"),
                tmpl = document.getElementById("tmplMsgOut").innerHTML,
                compiledTmpl = _.template(tmpl);
            
            if(fldOutReps) fldOutReps.remove();

            fldOutReps = document.createElement("div");
            fldOutReps.setAttribute("id", "fldOutReps");
            fldOutReps.classList.add("form__fld-out");

            for (var i = 0; i < reps.length && i < 3; i++) {
                var div = document.createElement("div"),
                    rep = reps[i];

                div.classList.add("form__msg");
                div.innerHTML = compiledTmpl({
                    "fullName": rep["full_name"],
                    "desc": rep["description"],
                    "lang": rep["language"],
                    "url": rep["html_url"]
                });
                fldOutReps.appendChild(div);
            };
            formSndRequest.appendChild(fldOutReps);
        };
    };
})();

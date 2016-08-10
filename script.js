;(function () {
  /*EVENTS*/
  let inputFld = document.getElementById("inputSrchRepo"),
    btnCrtGist = document.getElementById("btnCrtGist");

  inputFld.addEventListener("keyup", _.debounce(function() {
    if(inputFld.value.length < 3) return;
    getTopRepository();
  }, 400));

  btnCrtGist.addEventListener("click", createGist);

  /*****Функция для поиска ТОР3 репозиториев*****/
  function getTopRepository() {
    "use strict"
    
    sendRequest(inputFld.value);

    function sendRequest(strQuery) {
      let xhr = new XMLHttpRequest(),
        url = "https://api.github.com/search/repositories?q=" + strQuery +"&sort=stars&order=desc";

      xhr.open("GET", url, true);
      xhr.onreadystatechange = function () {
        if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
        procesQuery(xhr.responseText);
        };
      };
      xhr.send();
    };

    function procesQuery (strJson) {
      let arr = JSON.parse(strJson).items,
        fldShowQuery = document.getElementById("fldShowQuery"),
        tmpl = document.getElementById("tmplMsgOut").innerHTML,
        compiled = _.template(tmpl);
      
      fldShowQuery.innerHTML = "";

      for (let i = 0; i < 3; i++) {
        let div = document.createElement("div");

        div.classList.add("form__msg");
        div.innerHTML = compiled({
          "fullName": arr[i]["full_name"],
          "desc": arr[i]["description"],
          "lang": arr[i]["language"],
          "url": arr[i]["html_url"]
        });
        fldShowQuery.appendChild(div);
      };
    };
  };

  /****Функция создания gist****/
  function createGist() {
    "use strict"
    let file = document.getElementById("inputGistFile"),
    content = document.getElementById("inputGistContent");

    sendRequest({ 
    "files": {
      [file.value]: {
      "content": content.value
      }
    }
    });

    function sendRequest(bodyQuery) {
      let xhr = new XMLHttpRequest(),
        url = "https://api.github.com/gists";

      xhr.open("POST", url, true);
      xhr.onreadystatechange = function () {
        if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 201) {
        procesQuery(xhr.responseText);
        };
      };
      xhr.send(JSON.stringify(bodyQuery));
    };

    function procesQuery (strJson) {
      let url = JSON.parse(strJson)["html_url"],
        formCrtGist = document.getElementById("formCrtGist"),
        a = document.createElement("a");

      a.innerHTML = url;
      a.setAttribute("href", url);
      formCrtGist.appendChild(a);
    };
  };
})();
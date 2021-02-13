const POST_REQUEST = './add.php';
const GET_REQUEST = './list.php';
const DELETE_REQUEST = './delete.php';
const PUT_REQUEST = './edit.php';

const prefixCHECK = "fas";
const CHECK = "fa-check-circle";
const prefixUNCHECK = "far";
const UNCHECK = "fa-circle";
const LINE_THROUGT = "lineThrough";

const optionsDate = {weekday: "long", month:"long", day:"numeric"};
const today = new Date();

let list = [];
let id = 0;

let divListLeft = document.createElement('div');
divListLeft.className = "containers";
document.getElementById("container").appendChild(divListLeft);

let divListLeftHeader = document.createElement('div');
divListLeftHeader.className = "listContainerHeader";
divListLeft.appendChild(divListLeftHeader);

let divClearIcon = document.createElement('div');
divClearIcon.className = "clear";
divListLeftHeader.appendChild(divClearIcon);

let refreshIcon = document.createElement('i');
refreshIcon.className = "fas fa-sync fa-2x blueIcon clickable";
divClearIcon.appendChild(refreshIcon);

let divDate = document.createElement('div');
divDate.id = "divDate";
divListLeftHeader.appendChild(divDate);

let displayDate = document.createElement('h2');
displayDate.id = "date";
displayDate.innerHTML = today.toLocaleDateString("fr-FR", optionsDate);
divDate.appendChild(displayDate);

let divList = document.createElement('div');
divList.className = "displayList";
divListLeft.appendChild(divList);

let divAddItem = document.createElement('div');
divAddItem.className = "containers";
document.getElementById("container").appendChild(divAddItem);

let secondDivAddItem = document.createElement('div');
secondDivAddItem.className = "addItemContainer";
divAddItem.appendChild(secondDivAddItem);

let plusCircle = document.createElement('i');
plusCircle.className = "fas fa-plus-circle fa-2x blueIcon clickable refresh";
secondDivAddItem.appendChild(plusCircle);

let inputField = document.createElement('input');
inputField.setAttribute('type', 'text');
inputField.setAttribute('placeholder', 'Add a to-do');
inputField.className = "input";
secondDivAddItem.appendChild(inputField);

refreshIcon.addEventListener('click', function() {
  list.forEach(element => {
    if(element.trash) {
      return;
    }
    list[element.id].trash = true;
    deleteElementRequest(element);
  })
  updateToDoElements();
})

document.addEventListener('keyup', function(key) {

  if(key.key == 'Delete' || key.key == 'Backspace') {
    list.forEach(toDo => {
      if(toDo.done && !toDo.trash) {
        let element = document.createElement('i');
        element.className = "clickable trash far fa-trash-alt fa-2x blueIcon";
        element.id = toDo.id;
        removeToDo(element);
      }
    })
  }
})

divList.addEventListener('click', function(elementTargeted) {
  const element = elementTargeted.target;
  let textHtml = element.parentNode.querySelector(".itemParagraph");
  if(element.className == 'input') {
      return;
  } 
  else if(textHtml != null && element.attributes.job.value != 'undefined') {
    const elementJob = element.attributes.job.value;

    if(elementJob == "complete") {
      validateToDo(element);
    } else if(elementJob == "edit" || elementJob == "text") {
      editToDo(element);
    } else if(elementJob == "delete") {
      removeToDo(element);
    }
  }
})

inputField.addEventListener("keyup", function(event) {
  if(event.key == 'Enter') {
    const toDo = inputField.value;

    if(toDo) {
      addToDo(toDo)
      inputField.value = "";
    }
  }
})

plusCircle.addEventListener('click', function() {
  let inputFieldValue = inputField.value;
  if(inputFieldValue != null && inputFieldValue.length >= 1) {
    addToDo(inputFieldValue);
    inputField.value = "";
  }
})

function postRequest(list, givenId) {
  fetch(POST_REQUEST, {
    method: 'POST',
    headers: {
      'Accept' : 'application/json',
      'Content-Type': 'application/json'
    },
    body: list
  })
  .then(response => response.json)
  .catch(e => console.log("Error on post request : " + e));

  getRequestForNewElement(givenId);
}

function getRequestForNewElement(givenId) {
  fetch(GET_REQUEST, {
    method: 'GET',
    headers : {
      'Accept' : 'application/json',
      'Content-Type': 'application/json'
    }
  })
  .then(response => response.json())
  .then(data => createHtmlForNewElement(data, givenId))
  .catch(e => console.log("Error on get request : " + e));
}

function getRequestForExistingElement() {
  fetch(GET_REQUEST, {
    method: 'GET',
    headers : {
      'Accept' : 'application/json',
      'Content-Type': 'application/json'
    }
  })
  .then(response => response.json())
  .then(data => updateElement(data))
  .catch(e => console.log("Error on get request : " + e));
}

function editElementRequest(element) {
  fetch(PUT_REQUEST, {
    method: 'PUT',
    headers : {
      'Accept' : 'application/json',
      'Content-Type': 'application/json'
    },
    body: element
  })
  .then(response => response.json())
  .then(updateToDoElements())
  .catch(e => console.log("Error on put request : " + e));
}

function editCompleteElementRequest(element) {
  fetch(PUT_REQUEST + `?id=${element.id}`, {
    method: 'PUT',
    headers : {
      'Accept' : 'application/json',
      'Content-Type': 'application/json'
    },
  })
  .then(response => response.json())
  .then(updateToDoElements())
  .catch(e => console.log("Error on put request : " + e));
}

function deleteElementRequest(element) {
  fetch(DELETE_REQUEST + `?id=${element.id}`, {
    method: 'DELETE',
    headers : {
      'Accept' : 'application/json',
      'Content-Type': 'application/json'
    },
  })
  .then(response => response.json())
  .catch(e => console.log("Error on put request : " + e));
}

destroy();

function destroy() {
  console.log("destroyed")
  fetch('./destroy.php', {
    method: 'GET',
    headers : {
      'Accept' : 'application/json',
      'Content-Type': 'application/json'
    }
  })
  .catch(e => console.log("Une erreur est survenue : " + e));
}
  
function addToDo(inputField) {

  let newElement = {
    name: inputField,
    id: id,
    done: false,
    trash: false
  };
  
  postRequest(JSON.stringify(newElement), id);

  list.push(newElement);

  id++;
}

function updateToDoElements() {

  while(divList.firstChild) {
    divList.removeChild(divList.firstChild);
  }

  getRequestForExistingElement();
}

function updateElement(element) {

  for(i = 0; i < id; i++) {
    createHtmlForNewElement(element, i);
  }
}

function createHtmlForNewElement(item, givenId) {

  item = JSON.parse(item[givenId]);

  if(item.trash) {
    return;
  }

  const DONE = item.done ? prefixCHECK + " " + CHECK : prefixUNCHECK + " " + UNCHECK;
  const LINE = item.done ? LINE_THROUGT : "";

  const add = `<ul class="list" id="list${item.id}">
                <li class="toDoItemList">
                <i class = "clickable complete ${DONE} fa-2x blueIcon" name="iconeBeforeText" job="complete" id="${item.id}"></i>
                <h3 class="itemParagraph ${LINE}" id="${item.id}" job="text"> ${item.name} </h3>
                <i class = "clickable edit far fa-edit fa-2x blueIcon" id="${item.id}" job="edit"></i>
                <i class = "clickable trash far fa-trash-alt fa-2x blueIcon" job="delete" id="${item.id}"></i></li>
              </ul>`;

  const position = "beforeend";

  divList.insertAdjacentHTML(position, add);
}


function validateToDo(element) {
  element.classList.toggle(prefixUNCHECK);
  element.classList.toggle(UNCHECK);
  element.classList.toggle(prefixCHECK);
  element.classList.toggle(CHECK);

  let textHtml = element.parentNode.querySelector(".itemParagraph");
  textHtml.classList.toggle(LINE_THROUGT);

  editCompleteElementRequest(list[element.id]);
  
  list[element.id].done = list[element.id].done ? false : true;
}

function removeToDo(element) {

  list[element.id].trash = true;

  deleteElementRequest(list[element.id]);

  updateToDoElements();
}

function editToDo(element) {

  let textHtml = element.parentNode.querySelector(".itemParagraph");

  let tempInput = document.createElement('input');
  tempInput.setAttribute('type', 'text');
  tempInput.className = 'input';
  tempInput.id = 'tempInput';
  tempInput.value = list[element.id].name;
  textHtml.parentNode.replaceChild(tempInput, textHtml)

  tempInput.addEventListener("keyup", function(event) {
    if(event.key === 'Enter' || event.key === 'Escape') {
      const newName = tempInput.value;
      if(newName) {
        list[element.id].name = newName;
        editElementRequest(JSON.stringify(list[element.id]));
      }
    }
  })
  tempInput.focus();
}
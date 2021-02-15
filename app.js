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

let inputFieldImageUrl = document.createElement('input');
inputFieldImageUrl.setAttribute('type', 'text');
inputFieldImageUrl.setAttribute('placeholder', 'Add an image URL for your to-do\'s background');
inputFieldImageUrl.className = "input";
secondDivAddItem.appendChild(inputFieldImageUrl);

refreshIcon.addEventListener('click', function() {

  list = [];
  id = 0;

  deleteElementRequest();

  document.location.reload();
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
  } else if(textHtml != null) {

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
    getInputFieldsValues();
  }
})

inputFieldImageUrl.addEventListener("keyup", function(event) {
  if(event.key == 'Enter') {
    getInputFieldsValues();
  }
})

function getInputFieldsValues() {
  const toDo = inputField.value;
  const toDoBackground = inputFieldImageUrl.value;

  if(toDo && !toDoBackground) {
    addToDo(toDo, toDoBackground);
    inputField.value = "";
    inputFieldImageUrl.value = "";
  } 
  else if (toDo && toDoBackground) {
    addToDo(toDo, toDoBackground);
    inputField.value = "";
    inputFieldImageUrl.value = "";
    let ulElementDisplayingList = document.getElementById("list" + (id-1));
    ulElementDisplayingList.style.backgroundImage = `url("${toDoBackground}")`;
  }
}

plusCircle.addEventListener('click', function() {
  let inputFieldValue = inputField.value;
  if(inputFieldValue) {
    getInputFieldsValues();
  }
})

function postRequest(element) {
  fetch(POST_REQUEST, {
    method: 'POST',
    headers: {
      'Accept' : 'application/json',
      'Content-Type': 'application/json'
    },
    body: element
  })
  .then(response => response.json)
  .catch(e => console.log("Error on post request : " + e));

  createHtmlForNewElement(element);
}

getRequestForExistingElements();

function getRequestForExistingElements() {
  fetch(GET_REQUEST, {
    method: 'GET',
    headers : {
      'Accept' : 'application/json',
      'Content-Type': 'application/json'
    }
  })
  .then(response => response.json())
  .then(data => retrieveElements(data))
  .catch(e => console.log("Error on get request : " + e));
}

function editElementRequest(element, value) {

  fetch(PUT_REQUEST + `?id=${element}` + '&' + value, {
    method: 'PUT',
    headers : {
      'Accept' : 'application/json',
      'Content-Type': 'application/json'
    },
  })
  .then(response => response.json())
  .catch(e => console.log("Error on put request : " + e));
}

function deleteElementRequest(element) {

  let elementId = '';

  if(element != null) {
    elementId = element.id;
  }

  fetch(DELETE_REQUEST + `?id=${elementId}`, {
    method: 'DELETE',
    headers : {
      'Accept' : 'application/json',
      'Content-Type': 'application/json'
    },
  })
  .then(response => response.json())
  .catch(e => console.log("Error on delete request : " + e));
}
  
function addToDo(inputField, backgroundImage) {

  if(!backgroundImage) {
    backgroundImage = "";
  }

  let newElement = {
    name: inputField,
    id: id,
    done: false,
    trash: false,
    background: backgroundImage
  };
  
  postRequest(JSON.stringify(newElement));

  list.push(newElement);

  id++;
}

function retrieveElements(element) {

  if(element != null) {
    if(list.length == 0) {
      element.forEach(item => {
        list.push(JSON.parse(item));
        createHtmlForNewElement(item);
        id++;
        item = JSON.parse(item);
        
        if(item.background) {
          let ulElementDisplayingList = document.getElementById("list" + (id-1));
          ulElementDisplayingList.style.backgroundImage = `url("${item.background}")`;
        }
      });  
    }
  }
}

function createHtmlForNewElement(item) {

  item = JSON.parse(item);

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

  editElementRequest(list[element.id].id, 'value=done');
  
  list[element.id].done = list[element.id].done ? false : true;
}

function removeToDo(element) {

  let ulElementDisplayingList = document.getElementById("list" + list[element.id].id);
  divList.removeChild(ulElementDisplayingList);

  list[element.id].trash = true;

  deleteElementRequest(list[element.id]);
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
        editElementRequest(JSON.stringify(list[element.id].id), 'name=' + list[element.id].name);

        const LINE = list[element.id].done ? LINE_THROUGT : "";
        let newHtml = document.createElement('h3');
        newHtml.className = "itemParagraph" + " " + LINE;
        newHtml.id = list[element.id].id;
        newHtml.setAttribute('job', 'text');
        newHtml.innerHTML = list[element.id].name;
        tempInput.parentNode.replaceChild(newHtml, tempInput);
      }
    }
  })
  tempInput.focus();
}
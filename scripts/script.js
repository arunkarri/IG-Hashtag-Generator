let apiUrl = 'https://www.instagram.com/web/search/topsearch/?context=blended&query=';

let query = document.getElementById('search');
let contentRow = document.getElementById('content');
let buttons = document.getElementById('buttons');
let container = document.getElementById('toast-container');
let hashtags = [];

// $(function () {
//   $('.toast').toast('show');
// });

let hashtagSearch = function (query) {
  console.log(query);
  return `${apiUrl}${query}`;
};

function btnCheck() {
  let btn = document.getElementById('search-btn');

  if (query.value.length === 0) {
    setAttribute(btn, 'disabled', 'true');
  } else {
    btn.removeAttribute('disabled');
  }
}
function searchEvent(event) {
  event.preventDefault();
  getResults();
}

// get Recipe api call
async function getResults() {
  try {
    buttons.innerHTML = `<div class="d-flex justify-content-center">
    <div class="spinner-border text-light" role="status">
      <span class="sr-only">Loading...</span>
    </div>
    </div>
    <br>`;

    let req = await fetch(hashtagSearch(query.value));
    let res = await req.json();
    hashtags = res.hashtags;
    console.log(res);
    copyButtons();
    buildTbodyUI(res.hashtags);
  } catch (error) {
    console.log(error);
  }
}

function copyButtons() {
  buttons.innerHTML = '';
  if (hashtags.length > 1) {
    let copyAll = createElement('span');
    setAttribute(copyAll, 'class', 'badge rounded-pill bg-dark text-light');
    setAttribute(copyAll, 'onclick', `copyMultipleHashtags(${hashtags.length})`);
    copyAll.innerText = 'Copy All';
    appendChild(buttons, copyAll);
  }

  if (hashtags.length > 10) {
    let copy10 = createElement('span');
    setAttribute(copy10, 'class', 'badge rounded-pill bg-danger text-light');
    setAttribute(copy10, 'onclick', 'copyMultipleHashtags(10)');
    copy10.innerText = 'Copy First 10';
    appendChild(buttons, copy10);
  }
  if (hashtags.length > 20) {
    let copy20 = createElement('span');
    setAttribute(copy20, 'class', 'badge rounded-pill bg-danger text-light');
    setAttribute(copy20, 'onclick', 'copyMultipleHashtags(20)');
    copy20.innerText = 'Copy First 20';
    appendChild(buttons, copy20);
  }

  if (hashtags.length > 30) {
    let copy30 = createElement('span');
    setAttribute(copy30, 'class', 'badge rounded-pill bg-danger text-light');
    setAttribute(copy30, 'onclick', 'copyMultipleHashtags(30)');
    copy30.innerText = 'Copy First 30';
    appendChild(buttons, copy30);
  }
}

// Build Table

let tableDiv = createElement('div');
setAttribute(tableDiv, 'class', 'table-div');
appendChild(contentRow, tableDiv);

let table = createElement('table');
setAttribute(table, 'class', 'table table-responsive text-light');
appendChild(tableDiv, table);

let thead = createElement('thead');
appendChild(table, thead);

let tr = createElement('tr');
appendChild(thead, tr);

let th1 = createElement('th');
setAttribute(th1, 'scope', 'col');

appendChild(tr, th1);

let th2 = createElement('th');
setAttribute(th2, 'scope', 'col');
th2.innerText = 'Hashtag';
appendChild(tr, th2);

let th3 = createElement('th');
setAttribute(th3, 'scope', 'col');
th3.innerText = 'Number of Posts';
appendChild(tr, th3);

let tbody = createElement('tbody');
appendChild(table, tbody);

// Load Data to Table
function buildTbodyUI(data) {
  tbody.innerHTML = '';
  if (data === []) {
    appendChild(table, '<h3 class="text-light">No data found!! </h3>');
  } else {
    for (let i = 0; i < data.length; i++) {
      let dataTr = createElement('tr');

      let dataTd1 = createElement('td');
      let copy = createElement('i');
      setAttribute(copy, 'class', 'far fa-copy copy-icon');
      setAttribute(copy, 'onClick', `copytoClipBoard('${data[i].hashtag.name}')`);
      appendChild(dataTd1, copy);

      let dataTd2 = createElement('td');
      dataTd2.innerText = data[i].hashtag.search_result_subtitle;
      let dataTd3 = createElement('td');
      dataTd3.innerText = data[i].hashtag.name;

      appendChild(dataTr, dataTd1);
      appendChild(dataTr, dataTd2);
      appendChild(dataTr, dataTd3);
      appendChild(tbody, dataTr);
    }
  }
}

function copytoClipBoard(text) {
  let input = `#${text}`;
  container.innerHTML = '';

  showToast();
  copy(input);
}

function copy(input) {
  navigator.clipboard.writeText(input).then(
    function () {
      $('.toast').toast('show');
    },
    function (err) {
      console.error('Async: Could not copy text: ', err);
    }
  );
}

function showToast() {
  let toastDiv = createElement('div');
  setAttribute(toastDiv, 'class', 'toast ml-auto');
  setAttribute(toastDiv, 'role', 'alert');
  setAttribute(toastDiv, 'data-delay', '1500');
  setAttribute(toastDiv, 'data-autohide', 'true');
  appendChild(container, toastDiv);

  let toastHeader = createElement('div');
  setAttribute(toastHeader, 'class', 'toast-header');
  appendChild(toastDiv, toastHeader);

  let toastHeaderText = createElement('strong');
  setAttribute(toastHeaderText, 'class', 'mr-auto text-primary');
  toastHeaderText.innerText = 'Copy to Clipboard';
  appendChild(toastHeader, toastHeaderText);

  let toastBody = createElement('div');
  setAttribute(toastBody, 'class', 'toast-body');
  toastBody.innerText = 'Hashtag(s) copied to Clipboard';
  appendChild(toastDiv, toastBody);
}

function copyMultipleHashtags(length) {
  showToast();
  let text = '';
  for (var i = 0; i < length; i++) {
    text = text + `#${hashtags[i].hashtag.name} `;
  }
  copy(text.trim());
}

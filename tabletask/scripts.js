var data = [],
    flName = document.querySelector('.name'),
    description = document.querySelector('.description'),
    address = document.querySelector('.street'),
    city = document.querySelector('.city'),
    state = document.querySelector('.state'),
    zip = document.querySelector('.zip'),
    piece = [],
    currentPage = 0,
    totalPages = 0,
    byName = true,
    byId = true,
    byLastName = true,
    byEmail = true,
    byPhone = true,
    chosen,
    navigation = document.querySelector('.navigation'),
    prev = document.getElementById('prev'),
    next = document.getElementById('next'),
    first = document.getElementById('first'),
    last = document.getElementById('last'),
    form = document.forms[0],
    filter = form.elements.filter,
    loaded = document.querySelector('.loaded'),
    loading = document.querySelector('.loading'),
    total = document.querySelector('.total');

navigation.style.visibility = 'hidden';
loading.hidden = true;

//Загрузка данных
function getData(choice) {
  var xhr = new XMLHttpRequest();
  if (choice == 'small') {
  var request = 'http://www.filltext.com/?rows=32&id={number|1000}&firstName={firstName}&lastName={lastName}&email={email}&phone={phone|(xxx)xxx-xx-xx}&address={addressObject}&description={lorem|32}';
  } else {
  var request = 'http://www.filltext.com/?rows=1000&id={number|1000}&firstName={firstName}&delay=3&lastName={lastName}&email={email}&phone={phone|(xxx)xxx-xx-xx}&address={addressObject}&description={lorem|32}';
  }

  xhr.open('GET', request, true);
  xhr.send();

  loading.hidden = false;

  xhr.onprogress = function (e) {
    loaded.style.width = loaded.clientWidth + 5 + 'px';
    if (loaded.clientWidth >= total.clientWidth)
    loading.hidden = true;
  }
  xhr.onload = function () {
    loading.hidden = true;
    loaded.style.width = '0px';
    data = JSON.parse(this.responseText);
    setPiece();
    getTotalPages();
    showData();
  }
}
// Отвечает за отображение кусочка
// информации на текущую страницу
function setPiece() {
  var x = currentPage * 50;
  piece = data.slice(x, x + 50);
}
function deleteData() {
  var tbody = document.getElementById('tbody');
  if (tbody) table.removeChild(tbody);
  var tbody = document.createElement('tbody');
  tbody.id = 'tbody';
  table.appendChild(tbody);
}
//Навигация, отображение страниц
function showPages() {
  if (data.length > 50)
    navigation.style.visibility = 'visible';

  current.innerHTML = currentPage;

  if (currentPage == 0) {
    prev.hidden = true;
    first.hidden = true;
  } else {
    prev.innerHTML = currentPage -1;
    prev.hidden = false;
    first.hidden = false;
  }
  if (currentPage == totalPages) {
    next.hidden = true;
    last.hidden = true;
  } else {
    last.hidden = false;
    next.hidden = false;
    next.innerHTML = currentPage + 1;
  }
}
//Навигация, управление страницами
function toPrev() {
  currentPage -= 1;
  setProperPart();
}
function toNext() {
  currentPage += 1;
  setProperPart();
}
function toLast() {
  currentPage = totalPages;
  setProperPart();
}
function toFirst() {
  currentPage = 0;
  setProperPart();
}
function setProperPart() {
  showPages();
  setPiece();
  showData();
}
function getTotalPages() {
  totalPages = parseInt(data.length / 50) - 1;
}
//Отображение данных в таблице
function showData(filtered) {
  var localPiece = filtered || piece;
  deleteData();
  showPages();

  for (var i = 0; i < localPiece.length; i++) {
    var tr = document.createElement('tr');
    var id = document.createElement('td'),
        fName = document.createElement('td'),
        lName = document.createElement('td'),
        email = document.createElement('td'),
        phone = document.createElement('td');
    id.innerHTML = localPiece[i].id;
    fName.innerHTML = localPiece[i].firstName;
    lName.innerHTML = localPiece[i].lastName;
    email.innerHTML = localPiece[i].email;
    phone.innerHTML = localPiece[i].phone;

    tr.appendChild(id);
    tr.appendChild(fName);
    tr.appendChild(lName);
    tr.appendChild(email);
    tr.appendChild(phone);

    tbody.appendChild(tr);
    tr.onclick = function () {
      //установить ID по клику на строку
      chosen = this.firstElementChild.innerHTML;
      showChosen();
    }
  }
}
//Отображение выбранного элемента внизу страницы
function showChosen() {
  for (var i=0; i < data.length; i++) {
    if (data[i].id == chosen) chosen = data[i];
  }

  flName.innerHTML = chosen.firstName+' '+chosen.lastName;
  description.innerHTML = chosen.description;
  address.innerHTML = chosen.address.streetAddress;
  city.innerHTML = chosen.address.city;
  state.innerHTML = chosen.address.state;
  zip.innerHTML = chosen.address.zip;
}

//Сортировка массива
function sortBy(val) {
  var compareMethod;

  // устанавливаем метод сортировки
  // в зависимости от val
  if (val == 'id') {
    if (byId) {
      //Установить метод сортировки
      compareMethod = function (a,b){
        return a.id - b.id;
      };
      // Стрелка вверх для отображения направления
      // сортировки
      document.querySelector('.sort-by-id').innerHTML = '&darr;';
      byId = false;
    } else {
      //поменять метод сортировки
      compareMethod = function (a,b){
        return b.id - a.id;
      };
      // Стрелка вниз для отображения направления
      // сортировки
      document.querySelector('.sort-by-id').innerHTML = '&uarr;';
      byId = true;
    }
  } else if (val == 'fn'){
    if (byName) {
      compareMethod = function (a,b){
        return a.firstName.localeCompare(b.firstName);
      };
      document.querySelector('.sort-by-fn').innerHTML = '&darr;';
      byName = false;
    } else {
      compareMethod = function (a,b){
        return b.firstName.localeCompare(a.firstName);
      };
      document.querySelector('.sort-by-fn').innerHTML = '&uarr;';
      byName = true;
    }
  } else if (val == 'ln') {
    if (byLastName) {
      compareMethod = function (a,b){
        return a.lastName.localeCompare(b.lastName);
      };
      document.querySelector('.sort-by-ln').innerHTML = '&darr;';
      byLastName = false;
    } else {
      compareMethod = function (a,b){
        return b.lastName.localeCompare(a.lastName);
      };
      document.querySelector('.sort-by-ln').innerHTML = '&uarr;';
      byLastName = true;
    }
  } else if (val == 'em'){
      if (byEmail) {
        compareMethod = function (a,b){
          return a.email.localeCompare(b.email);
        };
        document.querySelector('.sort-by-em').innerHTML = '&darr;';
        byEmail = false;
      } else {
          compareMethod = function (a,b){
            return b.email.localeCompare(a.email);
          };
          document.querySelector('.sort-by-em').innerHTML = '&uarr;';
          byEmail = true;
        }
      } else if (val == 'ph') {
        if (byPhone) {
          compareMethod = function (a,b){
            return a.phone.localeCompare(b.phone);
          };
          document.querySelector('.sort-by-ph').innerHTML = '&darr;';
          byPhone = false;
        } else {
          compareMethod = function (a,b){
            return b.phone.localeCompare(a.phone);
          };
          document.querySelector('.sort-by-ph').innerHTML = '&uarr;';
          byPhone = true;
        }
      }
      if (form.elements.sort.value == 'all') {
        data = data.sort(compareMethod);
        setPiece();
      } else {
        piece = piece.sort(compareMethod);
      }

      showData();
}

filter.oninput = function (e) {
  var value = form.elements.filter.value;
  var filterMethod = function (item) {
    if (~item.id.toString().indexOf(value) ||
        ~item.firstName.indexOf(value) ||
        ~item.lastName.indexOf(value) ||
        ~item.phone.indexOf(value) ||
        ~item.email.indexOf(value)) {
        return true;
    } else return false;
  };

  if (form.elements.sort.value == 'all') {
    var filtered = data.filter(filterMethod);
    if (filtered.length > 50) {
      filtered = filtered.slice(0, 50);
    }
  } else {
    var filtered = piece.filter(filterMethod);
  }

  showData(filtered);
}

form.onsubmit = function () {
  return false;
}

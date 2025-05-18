// const txt = `"1","Ogrodzieniec","Zamek Ogrodzieniec – ruiny zamku leżącego na Jurze Krakowsko-Częstochowskiej, wybudowanego w systemie tzw. Orlich Gniazd, we wsi Podzamcze w województwie śląskim, w powiecie zawierciańskim, około 2 km na wschód od Ogrodzieńca. Zamek został wybudowany w XIV – XV w. przez ród Włodków Sulimczyków.","99PLN","50PLN"
// "2","Ojców","wieś w województwie małopolskim, w powiecie krakowskim, w gminie Skała, na terenie Wyżyny Krakowsko-Częstochowskiej, w Dolinie Prądnika, na Szlaku Orlich Gniazd. W Królestwie Polskim istniała gmina Ojców. W latach 1975–1998 miejscowość położona była w województwie krakowskim. W latach 1928–1966 Ojców miał status uzdrowiska posiadającego charakter użyteczności publicznej.","40PLN","15PLN`;

// console.log(txt.split(/[\r\n]+/gm));
const shoppingCart = [];

const chooseFileElement = document.querySelector(".uploader__input");
const excursionsList = document.querySelector(".excursions");
const summary = document.querySelector(".summary");
const order = document.querySelector(".order");

chooseFileElement.addEventListener("change", function (e) {
  const file = e.target.files[0];
  if (file && file.type === "text/csv") {
    console.log("success this is a CSV file.");
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function (e) {
      const csvContent = e.target.result;
      const csvContentArr = csvContent.split(/[\r\n]+/gm);
      const excursionsObjs = convertArrsToObjs(csvContentArr);
      renderExcursions(excursionsObjs);
      renderSummaryList();
      updateTotalSum();
    };
  }
});

excursionsList.addEventListener("click", function (e) {
  const isSubmitBtn = e.target.classList.contains(
    "excursions__field-input--submit"
  );
  if (!isSubmitBtn) return;

  e.preventDefault();
  const excursionItem = e.target.closest(".excursions__item");
  console.log(excursionItem);
  const order = getExcursionOrderObj(excursionItem);
  if (order) {
    addToShoppingCart(order);
    renderSummaryList();
    updateTotalSum();
    excursionItem.querySelector(`input[name="adults"]`).value = 0;
    excursionItem.querySelector(`input[name="children"]`).value = 0;
  }
});

summary.addEventListener("click", function (e) {
  if (!e.target.classList.contains("summary__btn-remove")) return;
  e.preventDefault();

  const item = e.target.closest(".summary__item");
  const id = +item.dataset.id;

  const shoppingCartItemToDelete = shoppingCart.find((obj) => obj.id === id);
  const indexOfItem = shoppingCart.indexOf(shoppingCartItemToDelete);
  shoppingCart.splice(indexOfItem, 1);

  renderSummaryList();
  updateTotalSum();
});

order.addEventListener("submit", function (e) {
  e.preventDefault();
  const name = order.querySelector(`input[name="name"]`).value.trim();
  const email = order.querySelector(`input[name="email"]`).value.trim();
  const total = document.querySelector(".order__total-price-value").textContent;

  const isValidName = (name) => {
    const nameRegex = /^[a-ząćęłńóśźż]+( [a-ząćęłńóśźż]+)+$/i;
    return nameRegex.test(name.trim());
  };
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (!isValidName(name) || !isValidEmail(email)) {
    alert("Wprowadź poprawne imię i email.");
    return;
  }

  alert(
    `Dziękujemy za złożenie zamówienia o wartości ${total}. Szczegóły zamówienia zostały wysłane na adres e-mail: ${email}.`
  );

  shoppingCart.length = 0;
  renderSummaryList();
  updateTotalSum();
  order.reset();
});

function convertArrsToObjs(arr) {
  const activityList = [];

  arr.forEach((element) => {
    let activityArr = element.replace(/^"|"$/g, "").split(`","`);
    activityArr = activityArr.map((el) => el.replace(/"/g, "").trim());
    const activityObj = {
      id: +activityArr[0],
      title: activityArr[1],
      description: activityArr[2],
      priceAdult: +activityArr[3],
      priceChild: +activityArr[4],
    };
    activityList.push(activityObj);
  });
  console.log(activityList);
  return activityList;
}

function renderExcursions(arr) {
  const excursionItemProto = excursionsList.querySelector(
    ".excursions__item--prototype"
  );
  excursionItemProto.style.display = "none";

  arr.forEach((obj) => {
    const excursionItem = excursionItemProto.cloneNode(true);
    excursionItem.classList.remove("excursions__item--prototype");
    excursionItem.style.display = "";
    excursionItem.dataset.id = obj.id;
    excursionItem.querySelector(".excursions__title").innerText = obj.title;
    excursionItem.querySelector(".excursions__description").innerText =
      obj.description;
    excursionItem.querySelector(".excursions__price-adult").innerText =
      obj.priceAdult;
    excursionItem.querySelector(".excursions__price-child").innerText =
      obj.priceChild;
    excursionsList.appendChild(excursionItem);
  });
}

function getExcursionOrderObj(el) {
  const isValidNumber = (num) => /^\d+$/.test(num);
  const amountAdult = el.querySelector(`input[name="adults"]`).value;
  const amountChild = el.querySelector(`input[name="children"]`).value;

  if (!isValidNumber(amountAdult) || !isValidNumber(amountChild)) {
    alert("Wprowadź poprawną liczbę osób dorosłych i dzieci.");
    return;
  }
  if (+amountAdult === 0 && +amountChild === 0) {
    alert(
      "Musisz dodać przynajmniej jednego uczestnika (dorosły lub dziecko)."
    );
    return;
  }

  const excursionObj = {
    id: +el.dataset.id,
    title: el.querySelector(".excursions__title").innerText,
    description: el.querySelector(".excursions__description").innerText,
    priceAdult: +el.querySelector(".excursions__price-adult").innerText,
    amountAdult: +amountAdult || 0,
    priceChild: +el.querySelector(".excursions__price-child").innerText,
    amountChild: +amountChild || 0,
  };

  console.log(excursionObj);
  return excursionObj;
}

function addToShoppingCart(order) {
  order.total =
    order.amountAdult * order.priceAdult + order.amountChild * order.priceChild;

  shoppingCart.push(order);
}

function renderSummaryList() {
  const summeryList = document.querySelector(".summary");
  const summeryListItemProto = summeryList.querySelector(
    ".summary__item--prototype"
  );
  summeryListItemProto.style.display = "none";

  const oldItems = summeryList.querySelectorAll(
    ".summary__item:not(.summary__item--prototype)"
  );
  oldItems.forEach((item) => item.remove());
  shoppingCart.forEach((el) => {
    const summeryListItem = summeryListItemProto.cloneNode(true);
    summeryListItem.style.display = "";
    summeryListItem.classList.remove("summary__item--prototype");
    summeryListItem.dataset.id = el.id;
    summeryListItem.querySelector(".summary__name").innerText = el.title;
    summeryListItem.querySelector(
      ".summary__total-price"
    ).innerText = `${el.total}PLN`;
    summeryListItem.querySelector(
      ".summary__prices"
    ).innerText = `dorośli: ${el.amountAdult} x ${el.priceAdult}PLN, dzieci: ${el.amountChild} x ${el.priceChild}PLN`;
    summeryList.appendChild(summeryListItem);
  });
}

function updateTotalSum() {
  const total = shoppingCart.reduce((sum, item) => sum + item.total, 0);
  document.querySelector(
    ".order__total-price-value"
  ).textContent = `${total}PLN`;
}

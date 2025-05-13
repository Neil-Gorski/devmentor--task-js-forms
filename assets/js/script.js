// const txt = `"1","Ogrodzieniec","Zamek Ogrodzieniec – ruiny zamku leżącego na Jurze Krakowsko-Częstochowskiej, wybudowanego w systemie tzw. Orlich Gniazd, we wsi Podzamcze w województwie śląskim, w powiecie zawierciańskim, około 2 km na wschód od Ogrodzieńca. Zamek został wybudowany w XIV – XV w. przez ród Włodków Sulimczyków.","99PLN","50PLN"
// "2","Ojców","wieś w województwie małopolskim, w powiecie krakowskim, w gminie Skała, na terenie Wyżyny Krakowsko-Częstochowskiej, w Dolinie Prądnika, na Szlaku Orlich Gniazd. W Królestwie Polskim istniała gmina Ojców. W latach 1975–1998 miejscowość położona była w województwie krakowskim. W latach 1928–1966 Ojców miał status uzdrowiska posiadającego charakter użyteczności publicznej.","40PLN","15PLN`;

// console.log(txt.split(/[\r\n]+/gm));

const chooseFileElement = document.querySelector(".uploader__input");
chooseFileElement.addEventListener("change", function (e) {
  const file = e.target.files[0];
  if (file && file.type === "text/csv") {
    console.log("success this is a CSV file.");
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function (e) {
      const csvContent = e.target.result;
      const csvContentArr = csvContent.split(/[\r\n]+/gm);
      console.log(csvContentArr);
      convertArrsToObjs(csvContentArr);
    };
  }
});

function convertArrsToObjs(arr) {
  const activityList = [];
  arr.forEach((element) => {
    const activityArr = element.split(`","`);
    const activityObj = {
      id: activityArr[0],
      title: activityArr[1],
      description: activityArr[2],
      piceAdult: activityArr[3],
      priceChild: activityArr[4],
    };
    activityList.push(activityObj);
  });
  console.log(activityList);
  return activityList;
}

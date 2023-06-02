let bookList = [],
  sepetList = [];

toastr.options = {
  closeButton: false,
  debug: false,
  newestOnTop: false,
  progressBar: false,
  positionClass: "toast-bottom-right",
  preventDuplicates: false,
  onclick: null,
  showDuration: "300",
  hideDuration: "1000",
  timeOut: "5000",
  extendedTimeOut: "1000",
  showEasing: "swing",
  hideEasing: "linear",
  showMethod: "fadeIn",
  hideMethod: "fadeOut",
};

const toggleModel = () => {
  const sepetModelEl = document.querySelector(".sepet_model");
  sepetModelEl.classList.toggle("active");
};

const getBooks = () => {
  fetch("./products.json")
    .then((res) => res.json())
    .then((books) => (bookList = books));
};

getBooks();

const createBookStars = (starRate) => {
  let starRateHtml = "";
  for (let i = 0; i < starRate; i++) {
    if (Math.round(starRate) >= i)
      starRateHtml += '<i class="bi bi-star-fill active"></i>';
    else starRateHtml += '<i class="bi bi-star-fill"></i>';
  }
  return starRateHtml;
};

const BOOK_TYPES = {
  ALL: "Tümü",
  NOVEL: "Roman",
  CHILDREN: "Çocuk",
  SELFIMPROVEMENT: "Kişisel Gelişim",
  HISTORY: "Tarih",
  FINANCE: "Finans",
  SCIENCE: "Bilim",
};

const createBookTypesHtml = () => {
  const filterEl = document.querySelector(".filter");
  let filterHtml = "";
  let filterTypes = ["ALL"];
  bookList.forEach((book) => {
    if (filterTypes.findIndex((filter) => filter == book.type) == -1)
      filterTypes.push(book.type);
  });
  filterTypes.forEach((type, index) => {
    filterHtml += `<li class="${
      index === 0 ? "active" : null
    }" onclick="filterBooks(this)" data-type="${type}">${
      BOOK_TYPES[type] || type
    }</li>`;
  });
  filterEl.innerHTML = filterHtml;
};

const createBookItemsHtml = () => {
  const bookListEl = document.querySelector(".book_list");
  let bookListHtml = "";
  bookList.forEach((book, index) => {
    bookListHtml += `
    <div class="col-5 ${index % 2 == 0 ? "offset-2" : ""} mb-4">
      <div class="row">
        <div class="col-6 kitap_kart">
          <img
            class="img-fluid shadow"
            width="258"
            height="400"
            src="${book.imgSource}"
            alt="Resim yüklenemedi"
          />
        </div>
        <div class="col-6 d-flex flex-column justify-content-between">
          <div class="kitap_detay">
            <span class="fos gray fs-5">${book.author}</span><br />
            <span class="fs-4 black fw-bold">${book.name}</span><br />
            <span class="kitap_yildiz">
              ${createBookStars(book.starRate)}
            </span>
            <span class="kitap_inceleme">${book.reviewCount} inceleme</span>
          </div>
          <p class="kitap_icerik fos gray fs-5">${book.description}</p>
          <div>
            <span class="black fw-bold me-2 fs-4">${book.price}</span>
            ${
              book.oldPrice
                ? `<span class="eski_fiyat fs-4 fw-bold">${book.oldPrice}</span>`
                : ""
            }
          </div>
          <button class="buton_mor" onclick="addBookToSepet(${
            book.id
          })">Sepete Ekle</button>
        </div>
      </div>
    </div>
  `;
  });
  bookListEl.innerHTML = bookListHtml;
};

const filterBooks = (filterEl) => {
  document.querySelector(".filter .active").classList.remove("active");
  filterEl.classList.add("active");
  let bookType = filterEl.dataset.type;
  getBooks();
  if (bookType !== "ALL") {
    bookList = bookList.filter((book) => book.type === bookType);
  }
  createBookItemsHtml();
};

const listSepetItems = () => {
  const sepetListEl = document.querySelector(".sepet_list");
  document.querySelector(".sepet_top").innerHTML =
    sepetList.length > 0 ? sepetList.length : null;
  const totalPriceEl = document.querySelector(".total_price");

  let sepetListHtml = "";
  let totalPrice = 0;
  sepetList.forEach((item) => {
    totalPrice += item.product.price * item.quantity;
    sepetListHtml += `
    <li class="sepet_item">
            <img
              src="${item.product.imgSource}"
              width="100"
              height="150"
            />
            <div class="sepet_items-info">
              <h4 class="black fw-bold">${item.product.name}</h4>
              <span class="fs-5">${item.product.price}₺</span><br />
              <span class="sepet_kaldir" onclick="removeItemToSepet(${item.product.id})">Kaldır</span>
            </div>
            <div class="book_sayi">
              <span class="azalt" onclick="azaltItemToSepet(${item.product.id})">-</span>
              <span class="">${item.quantity}</span>
              <span class="artir"onclick="arttirItemToSepet(${item.product.id})">+</span>
            </div>
          </li>
    `;
  });
  sepetListEl.innerHTML = sepetListHtml
    ? sepetListHtml
    : `
  <li class="sepet_item">Sepette Ürün Bulunamadı</li>`;
  totalPriceEl.innerHTML =
    totalPrice > 0 ? "Toplam Fiyat: " + totalPrice.toFixed(2) + "₺" : null;
};

const addBookToSepet = (bookId) => {
  let findBook = bookList.find((book) => book.id === bookId);
  if (findBook) {
    const sepetIndex = sepetList.findIndex(
      (item) => item.product.id === bookId
    );
    if (sepetIndex === -1) {
      let addedItem = { quantity: 1, product: findBook };
      sepetList.push(addedItem);
    } else {
      if (
        sepetList[sepetIndex].quantity < sepetList[sepetIndex].product.stock
      ) {
        sepetList[sepetIndex].quantity += 1;
      } else {
        toastr.warning("Kitap stokta yok", "Uyarı");
        return;
      }
    }
    listSepetItems();
    toastr.success("İşlem başarıyla tamamlandı", "Başarılı");
  }
};

const removeItemToSepet = (bookId) => {
  const findedIndex = sepetList.findIndex((book) => book.product.id === bookId);

  if (findedIndex !== -1) {
    sepetList.splice(findedIndex, 1);
  }
  listSepetItems();
};

const azaltItemToSepet = (bookId) => {
  const findedIndex = sepetList.findIndex(
    (basket) => basket.product.id == bookId
  );
  if (findedIndex != -1) {
    if (sepetList[findedIndex].quantity != 1)
      sepetList[findedIndex].quantity -= 1;
    else removeItemToSepet(bookId);
  }
  listSepetItems();
};
const arttirItemToSepet = (bookId) => {
  const findedIndex = sepetList.findIndex(
    (basket) => basket.product.id == bookId
  );
  if (findedIndex != -1) {
    if (sepetList[findedIndex].quantity < sepetList[findedIndex].product.stock)
      sepetList[findedIndex].quantity += 1;
    else toastr.error("Kitap stokta yok", "Uyarı");
  }
  listSepetItems();
};
setTimeout(() => {
  createBookItemsHtml();
  createBookTypesHtml();
}, 100);

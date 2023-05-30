let bookList = [];

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
          <button class="buton_mor">Sepete Ekle</button>
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

setTimeout(() => {
  createBookItemsHtml();
  createBookTypesHtml();
}, 100);

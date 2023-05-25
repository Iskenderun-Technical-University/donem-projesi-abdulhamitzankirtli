let bookList = [];

const toggleModel = () => {
    const sepetModelEl = document.querySelector(".sepet_model");
    sepetModelEl.classList.toggle("active");
};
const getBooks = () => {
    fetch("./prroducs.json")
        .then(res => res.json())
        .then(books => (bookList = books));
};
getBooks();

const creatBookItemsHtml = () => {
    const bookListEl = document.querySelector(".book_list")
    let bookListHtml = "";
    bookList.forEach((book) => { bookListHtml += ''; 
});
    bookListEl.innerHtml = bookListHtml
};

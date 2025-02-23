const books = [];
const RENDER_BOOK = 'render-book';

document.addEventListener('DOMContentLoaded', function () {
  const submitForm = document.getElementById('bookForm');
  if (submitForm) {
    submitForm.addEventListener('submit', function (event) {
      event.preventDefault();
      addBook();
    });
  }
  loadData();
});


function addBook() {
  const bookItemTitle = document.getElementById('bookFormTitle').value;
  const bookItemAuthor = document.getElementById('bookFormAuthor').value;
  const bookItemYear = document.getElementById('bookFormYear').value;
  const bookItemIsComplete = document.getElementById('bookFormIsComplete').checked; 

  const bookId = databookid();
  const bookObject = generateBooksObject(bookId, bookItemTitle, bookItemAuthor, bookItemYear,bookItemIsComplete);
  
  books.push(bookObject);
  saveData(); 
  document.dispatchEvent(new Event(RENDER_BOOK));
  document.getElementById('bookForm').reset();
}

function loadData() {
  const savedBooks = localStorage.getItem('books');
  if (savedBooks) {
    books.push(...JSON.parse(savedBooks));
  }
  document.dispatchEvent(new Event(RENDER_BOOK));
}


function generateBooksObject(id, title, author, year, isComplete) {
  return {
    id,
    title,
    author,
    year,
    isComplete,
  };
}

function createBookElement(bookObject) {
  const bookItem = document.createElement('div');
  bookItem.classList.add('book-item');
  bookItem.setAttribute('data-bookid', bookObject.id);
  bookItem.setAttribute('data-testid', 'bookForm');

  const bookTitle = document.createElement('h3');
  bookTitle.innerText = bookObject.title;
  bookTitle.setAttribute('data-testid', 'bookFormTitle');

  const bookAuthor = document.createElement('p');
  bookAuthor.innerText = `Penulis: ${bookObject.author}`;
  bookAuthor.setAttribute('data-testid', 'bookFormAuthor');

  const bookYear = document.createElement('p');
  bookYear.innerText = `Tahun: ${bookObject.year}`;
  bookYear.setAttribute('data-testid', 'bookFormYear');

  const buttonContainer = document.createElement('div');

  const completeButton = document.createElement('button');
  completeButton.innerText = bookObject.isComplete ? 'Belum dibaca' : 'Selesai dibaca'; 
  completeButton.setAttribute('data-testid', 'bookItemIsCompleteButton');
  completeButton.addEventListener('click', function () {
    toggleBookStatus(bookObject.id);
  });

  const deleteButton = document.createElement('button');
  deleteButton.innerText = 'Hapus Buku';
  deleteButton.setAttribute('data-testid', 'bookItemDeleteButton');
  deleteButton.addEventListener('click', function () {
    deleteBook(bookObject.id);
  });

  const editButton = document.createElement('button');
  editButton.innerText = 'Edit Buku';
  editButton.setAttribute('data-testid', 'bookItemEditButton');
  editButton.addEventListener('click', function () {
    editBook(bookObject.id);
  });

  buttonContainer.appendChild(completeButton);
  buttonContainer.appendChild(deleteButton);
  buttonContainer.appendChild(editButton);

  bookItem.appendChild(bookTitle);
  bookItem.appendChild(bookAuthor);
  bookItem.appendChild(bookYear);
  bookItem.appendChild(buttonContainer);

  return bookItem;
}

function databookid() {
  return +new Date();
}

function toggleBookStatus(bookId) {
  const book = books.find((item) => item.id === bookId);
  if (book) {
    book.isComplete = !book.isComplete;
    document.dispatchEvent(new Event(RENDER_BOOK));
    saveData();
  }
}

function deleteBook(bookId) {
  const bookIndex = books.findIndex((item) => item.id === bookId);
  if (bookIndex !== -1) {
    books.splice(bookIndex, 1);
    document.dispatchEvent(new Event(RENDER_BOOK));
    saveData();
  }
}

function editBook(bookId) {
  const book = books.find((item) => item.id === bookId);
  if (book) {
    document.getElementById('bookFormTitle').value = book.title;
    document.getElementById('bookFormAuthor').value = book.author;
    document.getElementById('bookFormYear').value = book.year;
    document.getElementById('bookFormIsComplete').checked = book.isComplete;

    editingBookId = bookId; 
    document.getElementById('bookFormSubmit').innerText = 'Update Buku';
  }
}

document.addEventListener(RENDER_BOOK, function () {
  const incompleteBookList = document.getElementById('incompleteBookList');
  const completeBookList = document.getElementById('completeBookList');
  
  incompleteBookList.innerHTML = '';
  completeBookList.innerHTML = '';
  
  for (const book of books) {
    const bookElement = createBookElement(book);
    if (book.isComplete) {
      completeBookList.appendChild(bookElement);
    } else {
      incompleteBookList.appendChild(bookElement);
    }
  }
});

function saveData() {
  localStorage.setItem('books', JSON.stringify(books));
}


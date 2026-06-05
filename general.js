const axios = require('axios');
const BASE = process.env.BASE_URL || 'http://localhost:3000';

// Task 10 requirements: implement 4 methods using async/await or Promises

// 1) Get all books - async/await
async function getAllBooks() {
  const res = await axios.get(`${BASE}/books`);
  return res.data;
}

// 2) Get book by ISBN - Promises
function getBookByISBN(isbn) {
  return axios.get(`${BASE}/books/isbn/${isbn}`).then(r => r.data);
}

// 3) Get books by author - Promises
function getBooksByAuthor(author) {
  return axios.get(`${BASE}/books/author/${encodeURIComponent(author)}`).then(r => r.data);
}

// 4) Get books by title - Promises
function getBooksByTitle(title) {
  return axios.get(`${BASE}/books/title/${encodeURIComponent(title)}`).then(r => r.data);
}

module.exports = {
  getAllBooks,
  getBookByISBN,
  getBooksByAuthor,
  getBooksByTitle
};

// If run directly, demonstrate usage
if (require.main === module) {
  (async () => {
    try {
      console.log('All books:');
      const all = await getAllBooks();
      console.log(all);

      console.log('\nBook by ISBN:');
      const book = await getBookByISBN('9780143127741');
      console.log(book);

      console.log('\nBooks by author:');
      const byAuthor = await getBooksByAuthor('Tolkien');
      console.log(byAuthor);

      console.log('\nBooks by title:');
      const byTitle = await getBooksByTitle('Martian');
      console.log(byTitle);
    } catch (err) {
      console.error(err.response ? err.response.data : err.message);
    }
  })();
}

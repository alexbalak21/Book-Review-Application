const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const DATA_PATH = path.join(__dirname, 'data', 'books.json');
let books = {};
try {
  books = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
} catch (err) {
  console.warn('Could not read books.json, starting with empty dataset');
  books = {};
}

// In-memory users store
const users = [];
const JWT_SECRET = 'change_this_secret';

// Helper to persist books (optional)
function saveBooks() {
  fs.writeFileSync(DATA_PATH, JSON.stringify(books, null, 2));
}

// Public endpoints
app.get('/', (req, res) => {
  res.send({ message: 'Book Review Application API' });
});

// Get all books
app.get('/books', (req, res) => {
  res.json(books);
});

// Get book by ISBN
app.get('/books/isbn/:isbn', (req, res) => {
  const { isbn } = req.params;
  const book = books[isbn];
  if (!book) return res.status(404).json({ message: 'Book not found' });
  return res.json(book);
});

// Get reviews for a book
app.get('/books/:isbn/review', (req, res) => {
  const { isbn } = req.params;
  const book = books[isbn];
  if (!book) return res.status(404).json({ message: 'Book not found' });
  return res.json(book.reviews || {});
});

// Search by author
app.get('/books/author/:author', (req, res) => {
  const { author } = req.params;
  const lc = author.toLowerCase();
  const results = Object.values(books).filter(b => b.author.toLowerCase().includes(lc));
  res.json(results);
});

// Search by title
app.get('/books/title/:title', (req, res) => {
  const { title } = req.params;
  const lc = title.toLowerCase();
  const results = Object.values(books).filter(b => b.title.toLowerCase().includes(lc));
  res.json(results);
});

// Register a new user
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'Username and password required' });
  const exists = users.find(u => u.username === username);
  if (exists) return res.status(400).json({ message: 'User already exists' });
  const hashed = await bcrypt.hash(password, 10);
  users.push({ username, password: hashed });
  res.json({ message: 'User registered successfully' });
});

// Login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'Username and password required' });
  const user = users.find(u => u.username === username);
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ message: 'Login successful', token });
});

// Auth middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token missing' });
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token invalid' });
    req.user = user;
    next();
  });
}

// Add or modify a book review (protected)
app.put('/auth/review/:isbn', authenticateToken, (req, res) => {
  const { isbn } = req.params;
  const { review } = req.body;
  const username = req.user.username;
  const book = books[isbn];
  if (!book) return res.status(404).json({ message: 'Book not found' });
  if (!book.reviews) book.reviews = {};
  book.reviews[username] = review;
  saveBooks();
  res.json({ message: 'Review added/updated', reviews: book.reviews });
});

// Delete a book review (protected)
app.delete('/auth/review/:isbn', authenticateToken, (req, res) => {
  const { isbn } = req.params;
  const username = req.user.username;
  const book = books[isbn];
  if (!book) return res.status(404).json({ message: 'Book not found' });
  if (!book.reviews || !book.reviews[username]) return res.status(404).json({ message: 'Review not found for this user' });
  delete book.reviews[username];
  saveBooks();
  res.json({ message: 'Review deleted' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Book Review API running on port ${PORT}`);
});

# Book-Review-Application
Coursea Node exercie to create a CRUD API for Book Review Application

Estimated Time Needed: 2 hours
In this final project, we will build a server-side online book review application and integrate it with a secure REST API server which will use authentication at the session level using JWT. You will then test your application using Promises callbacks or Async-Await functions.
Objectives:
After completing this lab, you will be able to:

Create APIs and perform CRUD operations on an Express server using Session & JWT authentication.
Use Async/Await or Promises with Axios in Node.js.
Create REST API endpoints and test them using cURL/Postman.

Run & Test
 - Install dependencies: `npm install`
 - Start server: `npm start` (or `npm run dev` with nodemon)

Example cURL commands:
 - Get all books:
	 `curl http://localhost:3000/books`
 - Get book by ISBN:
	 `curl http://localhost:3000/books/isbn/9780143127741`
 - Search by author:
	 `curl http://localhost:3000/books/author/Tolkien`
 - Search by title:
	 `curl http://localhost:3000/books/title/Martian`
 - Get reviews for a book:
	 `curl http://localhost:3000/books/9780143127741/review`

Auth flow examples (register/login) and protected review endpoints are provided in the API.

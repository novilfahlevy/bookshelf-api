const {
  getBooksHandler,
  addBookHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler
} = require('./handler')

const routes = [
  {
    method: 'GET',
    path: '/books',
    handler: getBooksHandler
  },
  {
    method: 'GET',
    path: '/books/{bookId}',
    handler: getBookByIdHandler,
  },
  {
    method: 'POST',
    path: '/books',
    handler: addBookHandler
  },
  {
    method: 'PUT',
    path: '/books/{bookId}',
    handler: editBookByIdHandler,
  },
  {
    method: 'DELETE',
    path: '/books/{bookId}',
    handler: deleteBookByIdHandler,
  },
  {
    method: '*',
    path: '/{any*}',
    handler: () => 'Page not found.',
  }
]

module.exports = routes
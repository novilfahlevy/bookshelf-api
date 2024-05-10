const { nanoid } = require('nanoid')
const books = require('./books')

function getBooksHandler(request, h) {
  const {
    name,
    reading,
    finished
  } = request.query

  let response = books

  // jika user ingin mencari buku berdasarkan nama
  if (name) {
    response = books.filter(book => book['name'].toLowerCase().includes(name.toLowerCase()))
  }

  // jika user ingin mencari buku yang belum dibaca
  if (reading == 0) {
    response = books.filter(book => !book['reading'])
  }

  // jika user ingin mencari buku yang sudah dibaca
  if (reading == 1) {
    response = books.filter(book => book['reading'])
  }

  // jika user ingin mencari buku yang belum selesai dibaca
  if (finished == 0) {
    response = books.filter(book => !book['finished'])
  }

  // jika user ingin mencari buku yang sudah selesai dibaca
  if (finished == 1) {
    response = books.filter(book => book['finished'])
  }

  return h
    .response({
      status: 'success',
      data: {
        books: response.map(book => ({
          id: book['id'],
          name: book['name'],
          publisher: book['publisher'],
        }))
      }
    })
    .code(200)
}

function addBookHandler(request, h) {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload

  // jika user tidak memasukkan nama buku maka akan gaga/ditolak
  if (!name) {
    return h
      .response({
        status: 'fail',
        message: 'Gagal menambahkan buku. Mohon isi nama buku'
      })
      .code(400)
  }

  // jika halaman terbacanya malah lebih banyak daripada jumlah halaman bukunya maka akan gaga/ditolak
  if (readPage > pageCount) {
    return h
      .response({
        status: 'fail',
        message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
      })
      .code(400)
  }

  const bookId = nanoid(16)
  const bookCreatedAt = new Date().toISOString()

  const newBook = {
    id: bookId,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished: pageCount === readPage,
    reading,
    insertedAt: bookCreatedAt,
    updatedAt: bookCreatedAt
  }

  books.push(newBook)

  return h
    .response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: { bookId }
    })
    .code(201)
}

function getBookByIdHandler(request, h) {
  const book = books.find(book => book.id == request.params.bookId)

  // buku tidak ditemukan
  if (!book) {
    return h
      .response({
        status: 'fail',
        message: 'Buku tidak ditemukan'
      })
      .code(404)
  }

  return h
    .response({
      status: 'success',
      data: { book }
    })
    .code(200)
}

function editBookByIdHandler(request, h) {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload

  // jika user tidak memasukkan nama buku maka akan gaga/ditolak
  if (!name) {
    return h
      .response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku',
      })
      .code(400)
  }

  // jika halaman terbacanya malah lebih banyak daripada jumlah halaman bukunya maka akan gaga/ditolak
  if (readPage > pageCount) {
    return h
      .response({
        status: 'fail',
        message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
      })
      .code(400)
  }

  const finished = pageCount === readPage
  const updatedAt = new Date().toISOString()

  const index = books.findIndex((note) => note.id === request.params.bookId)

  // jika buku tidak ditemukan
  if (index == -1) {
    return h
      .response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
      })
      .code(404)
  }
  
  books[index] = {
    ...books[index],
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    finished,
    updatedAt,
  }

  return h
    .response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    })
    .code(200)
}

function deleteBookByIdHandler(request, h) {
  const index = books.findIndex((note) => note.id === request.params.bookId)

  // jika buku tidak ditemukan
  if (index == -1) {
    return h
      .response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
      })
      .code(404)
  }

  books.splice(index, 1)

  return h
    .response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    })
    .code(200)
}

module.exports = {
  getBooksHandler,
  getBookByIdHandler,
  addBookHandler,
  editBookByIdHandler,
  deleteBookByIdHandler
}
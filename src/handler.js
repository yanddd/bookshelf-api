import { nanoid } from "nanoid";
import books from "./books.js";

const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  const id = nanoid(16);
  const finished = readPage === pageCount ? true : false;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    finished,
    insertedAt,
    updatedAt,
  };

  if (!name || readPage > pageCount) {
    const response = h.response({
      status: "fail",
      message: `Gagal menambahkan buku. ${
        !name
          ? "Mohon isi nama buku"
          : "readPage tidak boleh lebih besar dari pageCount"
      }`,
    });
    response.code(400);
    return response;
  }
  books.push(newBook);
  const response = h.response({
    status: "success",
    message: "Buku berhasil ditambahkan",
    data: {
      bookId: id,
    },
  });
  response.code(201);
  return response;
};

const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query;
  let bookFilter = books;

  if (name) {
    bookFilter = books.filter((bookname) =>
      bookname.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  if (reading === "0" || reading === "1") {
    bookFilter = books.filter(
      (bookread) => bookread.reading === (reading == "1")
    );
  }

  if (finished === "0" || finished === "1") {
    bookFilter = books.filter(
      (bookfinish) => bookfinish.finished === (finished == "1")
    );
  }

  const response = h.response({
    status: "success",
    data: {
      books: bookFilter.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      })),
    },
  });
  response.code(200);
  return response;
};

const getBookByIdHandler = (request, h) => {
  const { id } = request.params;
  const book = books.filter((b) => b.id === id)[0];
  if (book !== undefined) {
    return {
      status: "success",
      data: {
        book,
      },
    };
  }

  const response = h.response({
    status: "fail",
    message: "Buku tidak ditemukan",
  });
  response.code(404);
  return response;
};

const editBookByIdHandler = (request, h) => {
  const { id } = request.params;

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  const updatedAt = new Date().toISOString();
  const finished = readPage === pageCount ? true : false;
  const index = books.findIndex((book) => book.id === id);

  if (!name || readPage > pageCount) {
    const response = h.response({
      status: "fail",
      message: `Gagal memperbarui buku. ${
        !name
          ? "Mohon isi nama buku"
          : "readPage tidak boleh lebih besar dari pageCount"
      }`,
    });
    response.code(400);
    return response;
  }

  if (index !== -1) {
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
    };

    const response = h.response({
      status: "success",
      message: "Buku berhasil diperbarui",
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: "fail",
    message: "Gagal memperbarui buku. Id tidak ditemukan",
  });
  response.code(404);
  return response;
};

const deleteBookByIdHandler = (request, h) => {
  const { id } = request.params;

  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: "success",
      message: "Buku berhasil dihapus",
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: "fail",
    message: "Buku gagal dihapus. Id tidak ditemukan",
  });
  response.code(404);
  return response;
};

export {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};

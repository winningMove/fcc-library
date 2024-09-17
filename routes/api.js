/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";

const Book = require("../model/Book.js");

module.exports = async function (app) {
  app
    .route("/api/books")
    .get(async function (req, res) {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      const books = await Book.find({}).lean().exec();
      if (books.length === 0) return res.json([]);

      res.json(
        books.map(({ comments, _id, title }) => ({
          _id,
          title,
          commentcount: comments.length,
        }))
      );
    })

    .post(async function (req, res) {
      const title = req.body.title;

      if (!title) return res.send("missing required field title");

      const { _id } = await new Book({ title }).save();

      res.json({ _id, title });
    })

    .delete(async function (req, res) {
      //if successful response will be 'complete delete successful'
      const books = await Book.deleteMany({}).exec();
      res.send("complete delete successful");
    });

  app
    .route("/api/books/:id")
    .get(async function (req, res) {
      const bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}

      const book = await Book.findById(bookid).lean().exec();
      if (!book) return res.send("no book exists");

      res.json(book);
    })

    .post(async function (req, res) {
      const bookid = req.params.id;
      const comment = req.body.comment;
      //json res format same as .get

      if (!comment) return res.send("missing required field comment");

      let book = await Book.findById(bookid).exec();
      if (!book) return res.send("no book exists");

      book.comments.push(comment);
      const { _id, title, comments } = await book.save();

      res.json({ _id, title, comments });
    })

    .delete(async function (req, res) {
      const bookid = req.params.id;
      //if successful response will be 'delete successful'

      let book = await Book.findById(bookid).lean().exec();
      if (!book) return res.send("no book exists");

      await Book.deleteOne({ _id: bookid }).exec();
      res.send("delete successful");
    });
};

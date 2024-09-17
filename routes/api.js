/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";

import Book from "../model/Book.mjs";
import mongoose from "mongoose";
const express = require("express");
const app = express();

// after done, remove express imports and pass app to exports function
module.exports = async function () {
  await mongoose.connect(process.env.DB).catch((e) => {
    console.log("Error connecting to db: " + e);
  });
  mongoose.connection.on("error", (e) => {
    console.log("Error in database connection: " + e);
  });

  app
    .route("/api/books")
    .get(async function (req, res) {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      const books = await Book.find({}).exec();
      if (books.length === 0) return res.json([]);

      res.json(
        books.map(({ comments, ...book }) => ({
          book,
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

      const book = await Book.findById(bookid).exec();
      if (!book) return res.send("no book exists");

      res.json(JSON.stringify(book));
    })

    .post(async function (req, res) {
      const bookid = req.params.id;
      const comment = req.body.comment;
      //json res format same as .get

      if (!comment) return res.send("missing required field comment");

      let book = await Book.findById(bookid).exec();
      if (!book) return res.send("no book exists");

      book.comments.push(comment);
      book = await book.save();

      res.json(JSON.stringify(book));
    })

    .delete(async function (req, res) {
      const bookid = req.params.id;
      //if successful response will be 'delete successful'

      let book = await Book.findById(bookid).exec();
      if (!book) return res.send("no book exists");

      book = await book.deleteOne().exec();
      res.send("delete successful");
    });
};

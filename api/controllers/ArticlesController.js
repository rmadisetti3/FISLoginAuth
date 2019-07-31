/**
 * ArticlesController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
// var express = require("express");
// var app = express();
// var mysql = require("mysql");
// var bodyParser = require("body-parser");

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
// //app.use(express.json());
// //app.use(express.urlencoded());
// //app.use(app.router);
// app.use(express.static("public"));

// // Get the named datastore
var rdi = sails.getDatastore("default");

// // Get the datastore configured for a specific model
var rdi = Articles.getDatastore();

module.exports = {
  list: function(req, res) {
    rdi.leaseConnection(
      function(connection, proceed) {
        connection.query("SELECT title, body, id FROM articles;", function(
          err,
          results,
          fields
        ) {
          if (err) {
            return proceed(err);
          }

          proceed(undefined, results);
        });
      },
      function(err, results) {
        // Handle results here after the connection has been closed
        res.view("list", { articles: results });
      }
    );
  },
  add: function(req, res) {
    res.view("add");
  },
  create: function(req, res) {
    let title = req.body.title;
    let body = req.body.body;
    rdi.leaseConnection(
      function(connection, proceed) {
        connection.query(
          `INSERT INTO fisdb.articles(title, body) values('${title}', '${body}')`,
          function(err, results, fields) {
            if (err) {
              //console.log(err);
              return proceed(err);
            }
            console.log(`Added article: ${title}, ${body}`);
            proceed(undefined, results);
          }
        );
      },
      function(err, results) {
        // Handle results here after the connection has been closed
        res.redirect("/articles/list");
      }
    );
  },
  delete: function(req, res) {
    let num = req.params.num;
    console.log(num);
    rdi.leaseConnection(
      function(connection, proceed) {
        connection.query(`DELETE FROM fisdb.articles WHERE id = ${num};`, function(
          err,
          results,
          fields
        ) {
          if (err) {
            return proceed(err);
          }

          proceed(undefined, results);
        });
      },
      function(err, results) {
        // Handle results here after the connection has been closed
        res.redirect("/articles/list");
      }
    );
  },
  deleteAll: function(req, res) {
    rdi.leaseConnection(
      function(connection, proceed) {
        connection.query(`DELETE FROM fisdb.articles;`, function(
          err,
          results,
          fields
        ) {
          if (err) {
            return proceed(err);
          }

          proceed(undefined, results);
        });
      },
      function(err, results) {
        // Handle results here after the connection has been closed
        res.redirect("/articles/list");
      }
    );
  }
};

/**
 * ArticlesController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
var express = require("express");
var app = express();
var mysql = require("mysql");
var bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(express.json());
//app.use(express.urlencoded());
//app.use(app.router);
app.use(express.static("public"));

// Get the named datastore
var rdi = sails.getDatastore("default");

// Get the datastore configured for a specific model
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
    var title = document.getElementById("title-input").value;
    var body = document.getElementById("body-input").value;
    rdi.leaseConnection(
      function(connection, proceed) {
        connection.query(
          `INSERT INTO articles(title, body) values(${title}, ${body})`,
          function(err, results, fields) {
            if (err) {
              return proceed(err);
            }

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
    Articles.destroy({ id: req.params.id }).exec(function(err) {
      if (err) {
        res.send(500, { error: "Database Error" });
      }

      res.redirect("/articles/list");
    });

    return false;
  },
  edit: function(req, res) {
    Articles.findOne({ id: req.params.id }).exec(function(err, article) {
      if (err) {
        res.send(500, { error: "Database Error" });
      }

      res.view("edit", { article: article });
    });
  },
  update: function(req, res) {
    var title = req.body.title;
    var body = req.body.body;

    Articles.update({ id: req.params.id }, { title: title, body: body }).exec(
      function(err) {
        if (err) {
          res.send(500, { error: "Database Error" });
        }

        res.redirect("/articles/list");
      }
    );

    return false;
  }
};

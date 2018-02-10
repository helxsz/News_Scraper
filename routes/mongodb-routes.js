// *********************************************************************************
// mongodb-routes.js - this file offers a set of routes for manipulating the db and scraping Medium.com based on client requests
// *********************************************************************************

// Dependencies

// https://github.com/alfonsotech/fleece/blob/master/tweet.js

// =============================================================
const path = require("path");
const db = require("../models");
// Routes on the exports object

// =============================================================
module.exports =  (app) => {

    app.get("/saved-articles",(req, res) => {

        db.Article
            .find({
                isSaved: true
            })
            .then(dbArt => {
                if (dbArt) {
                    let hbsObject = {
                        articles: dbArt
                    };

                    res.render("saved", hbsObject);
                } else {
                    res.send(dbArt);
                }
            }).catch(err => {
                res.json(err);
            });
    });


    app.post("/save-article/:id", (req, res) => {
        db.Article
            .findOneAndUpdate({
                _id: req.params.id
            }, {
                $set: {
                    isSaved: true
                }
            })
            .then( dbArt => {
                res.json(dbArt);
            })
            .catch( err => {
                res.json(err);
            });
    });

    app.get("/articles/:id", (req, res) => {
        db.Article
            .findOne({
                _id: req.params.id
            })
            .populate("notes")
            .then(dbArticle => {
                if (dbArticle.notes) {
                    res.send(dbArticle.notes);
                } else {
                    res.send(dbArticle);
                }
            })
            .catch(err => {
                res.json(err);
            });
    });
    app.post("/articles/:id", (req, res) => {
        db.Note
            .create(req.body)
            .then(dbNote => {
                return db.Article.findOneAndUpdate({
                    _id: req.params.id
                }, {
                    $push: {
                        notes: dbNote._id
                    }
                }, {
                    new: true
                });
            }).then(dbArt => {
                res.json(dbArt);
            })
            .catch(err => {
                res.json(err);
            });
    });

    app.put("/article/:id", (req, res) => {
        const articleId = req.params.id;
        db.Article.update({
                _id: articleId
            }, {
                $set: {
                    isSaved: false
                }
            })
            .then(dbArt => {
                res.json(dbArt);
            }).catch(err => {
                res.json(err);
            });
    });

    app.delete("/notes/:id/:articleId", (req, res) => {
        const noteId = req.params.id;
        const articleId = req.params.articleId;
        db.Article.update({
                _id: articleId
            }, {
                $pull: {
                    notes: noteId
                }
            })
            .then(dbArt => {
                return db.Note.findByIdAndRemove({
                    _id: noteId
                }).then(removed => {
                    res.json(removed);
                }).catch(err => {
                    res.json(err);
                });
            });
    });
};

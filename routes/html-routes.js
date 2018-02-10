// *********************************************************************************
// html-routes.js - this file offers a set of routes for sending users to the various html pages
// *********************************************************************************

// Dependencies
// =============================================================
const db = require("../models");

// Routes
// =============================================================
module.exports = app => {

    app.get("/", (req, res) => {
        db.Article
            .find({})
            .then(dbArt => {
                if (dbArt) {
                    const hbsObject = {
                        articles: dbArt
                    };
                res.render("home", hbsObject);
                } else {
                    res.render("home");
                }
            }).catch(err => {
                res.json(err);
            });
    });
};

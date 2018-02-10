const path = require("path");
const db = require("../models");
const request = require("request");
const cheerio = require("cheerio");

//https://translate.yandex.com/developers/keys
const translate = require('translate');
translate.engine = 'yandex';
translate.key = 'trnsl.1.1.20180210T074405Z.2f863be86b71a8d3.d897cf1ba7efdeeb1aa8e4418c9ed3b396ec74e9';
translate('Hello world', 'es').then(text => {
  console.log(text);  // Hola mundo
});

//http://localhost:3000/scrape/index?url=https://www.coindesk.com/category/business-news/use-cases-verticals/internet-of-things/

module.exports =  (app) => {

  // "https://www.coindesk.com/category/business-news/use-cases-verticals/internet-of-things/"
  // "https://medium.com/topic/technology"
  app.get("/scrape/index",  (req, res) => {
      let url = req.query.url;
      if(url==null) url = "https://www.coindesk.com/category/business-news/use-cases-verticals/internet-of-things/";
      scrapeSiteIndex(url, res);
  });

  //setInterval(scrape.scrapeJSFeeds, 86400000);
  //setInterval(scrape.scrapeMediumFCC, 86400000);

  function scrape_stateofthedapps(html){
      const $ = cheerio.load(html);
      console.log(html);
      let results = [];
      $("div.data-v-675c7280").each((i, element) => {
          const headline = $(element).find("h3").text();
          const summary = $(element).find(".description").text();
          const url = $(element).find("a").attr("href");
          results.push({
              headline: headline,
              summary: summary,
              url: url
          });
      });
      return results;
  }


   function scrapeMediumFCC() {
        console.log('inside scrapeMediumFCC');
        request("https://medium.freecodecamp.org/", function(error, response, html) {
          var $ = cheerio.load(html);
          $(".postArticle").each(function(i, element) {
            var $this = $(this);
            var result = {};

            var title = $(this).children(".js-trackedPost").children('a').children('.postArticle-content').children('.section').children('.section-content').children('.section-inner').children("h3").text();
            splitTitle = title.split('');
            var shortTitle = []
            for(var i = 0; i<300; i++) {
              shortTitle.push(splitTitle[i]);
            }
            shortTitle = shortTitle.join('')

            result.title = shortTitle + '...';
            var link = $(this).children(".js-trackedPost").children('a').attr("href");
            result.link = link;
            console.log('result: >>>>>>>>>>>>>>', result.title);

            });
        });
  }


  function scrape_medium(html){
      const $ = cheerio.load(html);
      let results = [];
      $("div.js-trackedPost").each((i, element) => {
          const headline = $(element).find("h3").text();
          const summary = $(element).find("h4").text();
          const url = $(element).find("a").attr("href");
          let imgURL = $(element).find("a").css('background-image');
          imgURL = imgURL.split('url("')[1];
          imgURL = imgURL.replace('")', "");
          results.push({
              headline: headline,
              summary: summary,
              url: url,
              imgURL : imgURL
          });
      });
      return results;
  }


  function scrape_coindesk(html){
    const $ = cheerio.load(html);
    let results = [];
    $("div.post").each((i, element) => {
        const headline = $(element).find("h3").text();
        const summary = $(element).find(".desc").text();
        const url = $(element).find("a").attr("href");
        let imgURL = $(element).find(".picture img").attr("data-cfsrc");

        console.log(headline,summary,url,imgURL);
        results.push({
            headline: headline,
            summary: summary,
            url: url,
            imgURL : imgURL
        });
    });
    return results;
  }

  function scrapeSiteIndex(url,res){

    request(url, (error, response, html) => {
        //console.log(html);
        let results = [];

        if( url.indexOf('https://medium.com') >= 0 ){
          results = scrape_medium(html);
        }else if( url.indexOf('https://www.coindesk.com/') >=0 ){
          results = scrape_coindesk(html);
        }else if( url.indexOf('https://www.stateofthedapps.com/') >=0 ){
          results = scrape_stateofthedapps(html);
        }


        for(var i=0;i<results.length;i++){
          console.log(results[i].headline);
          translate(results[i].headline, 'zh').then(text => {
            console.log(text);  // Hola mundo
          });

        }


        /**/
        results.forEach(data => {
            db.Article
                .create(data)
                .then(dbArticle => {

                }).catch(err => {
                    console.log(err.errmsg);
                })
        })

        res.send(results);
    });
  }




  //http://localhost:3000/scrape/article?url=https://www.coindesk.com/kaspersky-labs-reveal-increase-mining-botnet-usage/

  app.get("/scrape/article",  (req, res) => {
      let url = req.query.url;
      scrapeSiteArticle(url, res);
  });

  function scrapeSiteArticle(url,res){

    request(url, (error, response, html) => {
        result = '';
        if( url.indexOf('https://medium.com') >= 0 ){
        }else if( url.indexOf('https://www.stateofthedapps.com/') >=0 ){
        }else if( url.indexOf('https://www.coindesk.com/') >=0 ){
          results = scrape_coindesk_article(html);
        }
        res.send(results);
    });
  }

  function scrape_coindesk_article(html){
    const $ = cheerio.load(html);
    let results = [];
    $("div.article-content-container p").each((i, element) => {
        const content = $(element).text();

        results.push({
            content: content,
        });
    });
    return results;
  }

};

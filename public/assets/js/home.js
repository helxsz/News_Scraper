$("#scrape").on("click", function () {
  if ($("#articles").children().length > 1){
    //return;
  }
  $.ajax({
    method: "GET",
    url: "/scrape/index?url="+$("#url").val()
  }).done(results => {
    console.log(results);
    console.log("/scrape/index?url="+$("#url").val());
    $.ajax({
      method: "GET",
      url: "/"
    }).done(data => {
      const modal = $("#myModal");
      $(modal).css("display", "block");
      $("#article-length").text(results.length);
      $(".close").on("click", () => {
        $(modal).css("display", "none");
      });
      window.onclick = event => {
        if (event.target !== modal) {
          $(modal).css("display", "none");

          window.location.replace("/");
        }
      }
    });
  });
});

if ($("#articles").children().length > 1){
  $("#headline").empty();
}

$(document).on("click", ".saveArticle", function () {
  $(this).addClass("loading");
  const removeClass = () => {
    $(this).removeClass("loading");
  }
  removeClass.bind(this);

  var thisId = $(this).attr("data-id");

  $.ajax({
    method: "POST",
    url: "/save-article/" + thisId
  }).done(data => {
    setTimeout(removeClass, 1000)
  });
});

$("#saved").on("click", function () {
  $.ajax({
    method: "GET",
    url: "/saved-articles"
  }).done(function (data) {
    if(data){
      window.location.replace("/saved-articles");
    }
    else {
      alert("You have no saved articles");
    }
  });
});

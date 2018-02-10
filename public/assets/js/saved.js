$(document).on("click", ".addNote", function () {

    const thisId = $(this).attr("data-id");
    $.ajax({
            method: "GET",
            url: "/articles/" + thisId
        })
        .done(data => {
            data.forEach(note => {
                $("div").data("id", thisId).children("#notes").append(`<p>${note.message}</p><button class='negative ui button delNote' data-id='${note._id}'>X</button>`);
            });
        });
});

$(document).on("click", ".save-note", function () {
    if ($(this).parents(".buttons").siblings(".bodyinput").val().length < 1) {
        return;
    }
    $(this).addClass("loading");
    const removeClass = () => {
      $(".bodyinput").val("");
      $(this).removeClass("loading");
    }
    removeClass.bind(this);

    const thisId = $(this).attr("data-id");
    $.ajax({
            method: "POST",
            url: "/articles/" + thisId,
            data: {
                message: $(this).parents(".buttons").siblings(".bodyinput").val()
            }
        })
        .done(data => {
            setTimeout(removeClass, 1000);
        });

    // $("#titleinput").val("");
    $(this).siblings(".bodyinput").val("");
});

$(document).on("click", ".delNote", function () {
    const thisId = $(this).data("id");
    const articleId = $(this).parents(".modal-body").data("id");
    $.ajax({
            method: "DELETE",
            url: "/notes/" + thisId + "/" + articleId
        })
        .done(function (data) {
            console.log(data);
        });
        window.location.replace("/saved-articles");
    $(this).siblings(".bodyinput").val("");
});
$(document).on("click", ".removeSaved", function () {
    const thisId = $(this).data("id");
    $.ajax({
            method: "PUT",
            url: "/article/" + thisId
        })
        .done(function (data) {
            window.location.replace("/saved-articles");
        });
});

$(".modal-trigger").click(function (e) {
    e.preventDefault();
    dataModal = $(this).attr("data-modal");
    $("#" + dataModal).css({
        "display": "block"
    });
});

$(".close-modal, .modal-sandbox").click(function () {
    $(".modal").css({
        "display": "none"
    });
    $("div#notes").empty();
});

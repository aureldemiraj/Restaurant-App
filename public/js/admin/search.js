let input = $("#kerko");
$("#kerko").keypress(function (e) {
  if (e.which === 13) {
    if (input.val() === "") {
      $(".col-md-6").show();
      return;
    }
    $(".card-body")
      .children("h5")
      .each(function (elem) {
        if (this.textContent.toLowerCase() !== input.val().toLowerCase()) {
          $(this).parents(".col-md-6").hide();
        }
      });
  }
});

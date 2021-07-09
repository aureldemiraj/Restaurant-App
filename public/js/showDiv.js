$("#remove").click(function (e) {
  $(".showVideoDiv").remove();
});

setTimeout(() => {
  $(".showVideoDiv").css("visibility", "visible");
}, 2000);

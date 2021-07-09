let URL = "http://localhost:3000";
const card =
  localStorage.getItem("card") === ""
    ? []
    : JSON.parse(localStorage.getItem("card"));

console.log(card);

if (card && card.length > 0) {
  $("#shopping-cart").append(`<span
    class="badge badge-secondary"
    style="position: relative; right: 5px; bottom: 7px;"
    >${card.length}</span
  >`);
  console.log(localStorage.getItem("card").length);
}

$(".shtoNeShporte").click(function (e) {
  e.preventDefault();
  console.log("sdf");

  const id = $(this).parent().parent().parent().attr("data-id");
  const items = JSON.parse(localStorage.getItem("card") || "[]");
  if (items.includes(id)) return;
  items.push(id);
  localStorage.setItem("card", JSON.stringify(items));
  console.log(items);
  fetchProducts();
});
const [modal] = $("#myModal");
const modalJ = $("#myModal");
console.log(modal);

$("#shopping-cart").click(function (e) {
  e.preventDefault();
  console.log(modal[0]);
  fetchProducts();
});

function fetchProducts() {
  if (modalJ.children()[0].children.length > 1) {
    modalJ.children()[0].removeChild(modalJ.children()[0].lastChild);
  }
  console.log(modalJ.children());

  fetch(URL + "/api/product/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: localStorage.getItem("card"),
  })
    .then((data) => {
      return data.json();
    })
    .then((data) => {
      console.log(data);
      const html = document.createElement("div");
      data.forEach((d) => {
        html.innerHTML += `<p>Produkti ${d.name}</p>`;
      });
      html.innerHTML += "<button>Porosit</button></div>";
      modalJ.children()[0].append(html);
      modal.style.display = "block";
    });
}
// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];
// When the user clicks on <span> (x), close the modal
span.onclick = function () {
  modal.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

$("#form").submit(function (eventObj) {
  $(this).append(
    `<input type="hidden" name="cart" value="${
      localStorage.getItem("card") == null ? "" : localStorage.getItem("card")
    }" /> `
  );
  console.log("ok");

  localStorage.setItem("card", []);
  return true;
});

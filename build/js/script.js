var open = document.querySelector(".menu-btn__toggle--open");
var menu = document.querySelector(".menu")

open.addEventListener("click", function(evt) {
    evt.preventDefault();
    menu.classList.toggle("menu__list--show");
  });


  <script>
  var open = document.querySelector(".menu-btn__toggle--open");
  var menu = document.querySelector(".menu");
  var close = document.querySelector(".menu__toggle--close");

  open.addEventListener("click", function(evt) {
    evt.preventDefault();
    menu.classList.add("menu__list--show");
  });

  close.addEventListener("click", function(evt) {
    evt.preventDefault();
    menu.classList.remove("menu__list--show");
  })
</script>

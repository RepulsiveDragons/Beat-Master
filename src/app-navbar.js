const template = document.createElement("template");
template.innerHTML = `
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" integrity="sha512-iBBXm8fW90+nuLcSKlbmrPcLa0OT92xO1BIsZ+ywDWZCvqsWgccV3gFoRBv0z+8dLJgyAHIhR35VZc2oM/gI1w==" crossorigin="anonymous" referrerpolicy="no-referrer" />
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css">
<style>
nav{
  font-family: 'Zen Dots', cursive;
}
</style>
<nav class="navbar has-shadow is-black">
<div class="navbar-brand">
  <a class="navbar-item" href="index.html">
  <i class="fas fa-compact-disc"></i>
  </a>
  <a class="navbar-burger" id="burger">
    <span></span>
    <span></span>
    <span></span>
  </a>
</div>
<div class="navbar-menu" id="nav-links">
  <div class="navbar-start">
    <a class="navbar-item is-hoverable" href="index.html" id="home-page">
      Home
    </a>
  
    <a class="navbar-item is-hoverable" href="app.html" id="app-page">
      App
    </a>

    <a class="navbar-item is-hoverable" href="high-scores.html" id="high-scores-page">
    Leaderboard
    </a>

  </div> <!-- end navbar-start -->
</div>
</nav> 
`;
class Navbar extends HTMLElement{
  constructor(){
    super();
    this.attachShadow({mode: "open"});
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback(){
    this.burgerIcon = this.shadowRoot.querySelector('#burger');
    this.navbarMenu = this.shadowRoot.querySelector('#nav-links');
    this.currentpage = `#${this.dataset.currentpage}`;
    this.currentNavItem = this.shadowRoot.querySelector(this.currentpage);

    //makes the current nav item not clickable and hoverable
    this.currentNavItem.removeAttribute("href");
    this.currentNavItem.className = "navbar-item has-text-weight-bold is-active";

    //open navbar menu when the burger icon is clicked
    this.burgerIcon.addEventListener('click', () => {
    this.navbarMenu.classList.toggle('is-active');
    });
  }

} 


customElements.define('app-navbar', Navbar);
const template = document.createElement("template");
template.innerHTML = `
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css">
<style>
header{
  font-family: 'Zen Dots', cursive;
}
</style>
<header class="hero p-2">
  <h1 class="title has-text-warning-dark has-text-centered has-text-weight-bold"><slot name="my-title"></slot></h1>
  <p class="subtitle has-text-warning has-text-centered mt-3 px-6"><slot name="my-subtitle"></slot></p>
</header>
`;
class AppHeader extends HTMLElement{
  constructor(){
    super();
    this.attachShadow({mode: "open"});
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
} 


customElements.define('app-header', AppHeader);
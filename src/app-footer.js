const template = document.createElement("template");
template.innerHTML = `
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css">
<style>
footer{
  font-family: 'Zen Dots', cursive;
}
</style>
<footer class="hero p-2 has-text-white-ter">
  <p><slot name="my-footer"></slot></p>
</footer>
`;
class AppFooter extends HTMLElement{
  constructor(){
    super();
    this.attachShadow({mode: "open"});
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
} 


customElements.define('app-footer', AppFooter);
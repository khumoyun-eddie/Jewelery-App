// Apply external styles to the shadow dom
const linkElem = document.createElement("link");
linkElem.setAttribute("rel", "stylesheet");
linkElem.setAttribute("href", "./style.collection-plp.css");
const template = document.createElement("template");
let style = document.createElement("style");

style.textContent =`
.products-list__item {
    width: 35.3rem;
    height: 41rem;
    background-color: var(--color-primary-2);
    text-align: center;
    clip-path: polygon(
        20px 0%,
        calc(100% - 20px) 0%,
        100% 20px,
        100% calc(100% - 20px),
        calc(100% - 20px) 100%,
        20px 100%,
        0% calc(100% - 20px),
        0% 20px
      );
    position: relative;
  }
  .item-header {
    position: relative;
    height: 80%;
  }
  .item-img {
    position: absolute;
    left: 0;
    top: 0%;
  }
  .item-content {
    width: 100%;
    text-align: center;
    position: absolute;
    left: 0;
    bottom: 1.9rem;
  }
  .products-list__item a{
    color: var(--color-primary-1);
  }
  .item-price {
    margin-top: 4px;
    margin-bottom: 10px;
    font-size: 1.4rem;
    font-family: var(--primary-font);
    line-height: 20px;
    letter-spacing: 0.15em;
  }
  .item-type {
    font-size: 1.4rem;
    line-height: 20px;
    letter-spacing: 0.15em;
    color: var(--color-secondary-1);
    text-transform: uppercase;
    font-weight: 700;
  }
`
template.innerHTML = `
<style>
.products-list__item {
    width: 35.3rem;
    height: 41rem;
    background-color: var(--color-primary-2);
    text-align: center;
    clip-path: polygon(
        20px 0%,
        calc(100% - 20px) 0%,
        100% 20px,
        100% calc(100% - 20px),
        calc(100% - 20px) 100%,
        20px 100%,
        0% calc(100% - 20px),
        0% 20px
      );
    position: relative;
  }
  .item-header {
    position: relative;
    height: 80%;
  }
  .item-img {
    position: absolute;
    left: 0;
    top: 0%;
  }
  .item-content {
    width: 100%;
    text-align: center;
    position: absolute;
    left: 0;
    bottom: 1.9rem;
  }
  .products-list__item a{
    color: var(--color-primary-1);
  }
  .item-price {
    margin-top: 4px;
    margin-bottom: 10px;
    font-size: 1.4rem;
    font-family: var(--primary-font);
    line-height: 20px;
    letter-spacing: 0.15em;
  }
  .item-type {
    font-size: 1.4rem;
    line-height: 20px;
    letter-spacing: 0.15em;
    color: var(--color-secondary-1);
    text-transform: uppercase;
    font-weight: 700;
  }</style>
<div class="products-list__item">
    <a href="">
        <div class="item-header">
          <img src="" loading="lazy" alt="" class="item-img">
        </div>
        <div class="item-content">
            <h4 class="heading-text heading-4">
                <slot name="title"/>    
            </h4>
            <p class="item-price">
                <slot name="price"/>
            </p>
            <p class="item-type">New Collection</p>
        </div>
    </a>
</div>
`;
class FeaturedProduct extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    // this.shadowRoot.appendChild(linkElem)
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.shadowRoot.querySelector(".item-img").src = this.getAttribute("image");
    this.shadowRoot.querySelector("a").href = this.getAttribute("url");
    // this.shadowRoot.querySelector("h4").innerText = this.getAttribute("title");
  }
}

window.customElements.define("featured-product", FeaturedProduct);

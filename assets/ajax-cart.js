class Cart {
    formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    });
  
    async fetchAPI(api, formData) {
      const response = await fetch(`/cart/${api}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      return await response.json();
    }
  
    addItem(formData) {
      return this.fetchAPI("add.js", formData);
    }
  
    changeItem(formData) {
      return this.fetchAPI("change.js", formData);
    }
  
    async getCartDetails() {
      const response = await fetch(`/cart.js`);
      return response.json();
    }
  
    async getProduct(handle) {
      const response = await fetch(`/products/${handle}.js`);
      return response.json();
    }
  
    async updateCart() {
      const cartDetails = await this.getCartDetails();
      
      this.renderCartItems(cartDetails);
      // this.addCartItemCount()
    }
  
    closeModal() {
      const sideCart = document.querySelector(".side-cart");
      sideCart.classList.toggle("open");
      document.body.removeAttribute("style");
    }
  
    renderCartItems(cartDetails) {
      if (cartDetails.item_count !== 0) {
        document.querySelector(".side-cart__full").style.display = "block";
        document.querySelector(".side-cart__empty").style.display = "none";
      } else {
        document.querySelector(".side-cart__full").style.display = "none";
        document.querySelector(".side-cart__empty").style.display = "block";
        return;
      }
      const cartItemsWrapper = document.querySelector(".side-cart__products-list");
      cartItemsWrapper.innerHTML = "";
      // if(cartDetails.length === 0) return
      for (let item of cartDetails.items) {
        // console.log(item);
        const template = `
        <div class="side-cart__product item" data-id="${item.key}" data-amount="${item.quantity}" >
        <a href="${item.url}" class="item__img-wrapper">
          <img src="${item.image}" class="item__img" alt="${item.title}">
        </a>
        <div class="item__details">
          <div class="details-wrapper">
            <a href="${item.url}" class="item__title heading-text heading-2">${item.product_title}</a>
            <p class="item__price">${this.formatter.format(item.price / 100)}</p>
            <p class="item__type">Size: ${item.variant_title}</p>
            <h4 class="heading-text heading-4 control-remove">Remove</h4>
          </div>
        </div>
      </div>
              `;
  
        cartItemsWrapper.insertAdjacentHTML("beforeend", template);
      }
  console.log(cartDetails)
      const sideCartTotalPrice = document.querySelector(".side-cart__total-price");
      sideCartTotalPrice.textContent = this.formatter.format(cartDetails.total_price / 100);
      const itemsCount = document.querySelector('.side-cart__count')
      itemsCount.textContent = `(${cartDetails.item_count})`
  
      // const headerCartLinks = document.querySelectorAll(".cart-item");
      // headerCartLinks.textContent = cartDetails.item_count;
      // console.log(headerCartLinks.textContent)
    }
  
    async toggleCart() {
      await this.updateCart();
      const sideCart = document.querySelector(".side-cart");
  
      sideCart.classList.toggle("open");
      document.body.setAttribute("style", "overflow: hidden");
    }
  
    addToCart(productID) {
  console.log(productID)
      const formData = {
        items: [
          {
            id: productID,
            quantity: 1,
          },
        ],
      };
  
      this.addItem(formData).then(() => this.toggleCart());
    //   this.addItem(formData);
  
    }
  
    addToCartWithSellingPlans(id, qty, sellingPlanId) {
      let formData = {
        items: [
          {
            id,
            quantity: qty,
            selling_plan: sellingPlanId,
          },
        ],
      };
      this.addItem(formData).then(() => this.toggleCart());
    }
  
    addCartItemCount() {
      this.getCartDetails().then((cartDetails) => {
        // const headerCartLinks = document.querySelectorAll(".cart-item");
        // headerCartLinks.textContent = cartDetails.item_count;
        // console.log(headerCartLinks.textContent)
      });
    }
  
    increaseItemAmount({ itemID, itemAmount }) {
      const formData = {
        id: itemID,
        quantity: Number(itemAmount) + 1,
      };
  
      this.changeItem(formData).then(() => this.updateCart());
    }
  
    decreaseItemAmount({ itemID, itemAmount }) {
      const formData = {
        id: itemID,
        quantity: Number(itemAmount) - 1,
      };
  
      this.changeItem(formData).then(() => this.updateCart());
    }
  
    deleteItem({ itemID }) {
      const formData = {
        id: itemID,
        quantity: 0,
      };
      this.changeItem(formData).then(() => this.updateCart());
    }
  }
  
  const sideCart = new Cart();
  const openCartIcon = document.querySelector(".side-cart__opener");
  const closeIcon = document.querySelector(".side-cart__close");
  const form = document.querySelector(".product-form");
  // sideCart.addCartItemCount()
  openCartIcon.addEventListener("click", () => {
    sideCart.toggleCart();
  });
  closeIcon.addEventListener("click", () => {
    sideCart.closeModal();
  });
  form?.addEventListener("submit", function (e) {
    e.preventDefault();
  
    let productID;
    if (e.target.dataset.novariant == "true") {
      const span = form.querySelector(".product-novariant");
      productID = span.dataset.productid;
    } else {
      const variantId = document.querySelector(".product-variants__list").value;

      productID = variantId;
    }
    sideCart.addToCart(productID);
  });
  
  const removeItem = document.querySelector('.control-remove')
  removeItem?.addEventListener('click', function(e){
    const cartItem = e.target.closest(".item");
    console.log(cartItem)
    sideCart.deleteItem({ itemID: cartItem.dataset.id });
  })
  const itemWrapper = document.querySelector(".side-cart__products-list");
  itemWrapper?.addEventListener("click", function (e) {
    const target = e.target.closest(".item__control");
    if (!target) return;
    const operator = target.dataset.operator;
    const cartItem = target.closest(".item");
  
    if (operator === "plus") {
      sideCart.increaseItemAmount({ itemID: cartItem.dataset.id, itemAmount: cartItem.dataset.amount });
    }
    if (operator === "minus") {
      sideCart.decreaseItemAmount({ itemID: cartItem.dataset.id, itemAmount: cartItem.dataset.amount });
    }
    if (operator === "remove") {
      sideCart.deleteItem({ itemID: cartItem.dataset.id });
    }
  });
  
  const cartBtns = document.querySelectorAll(".product__details--link");
  for (let i = 0; i < cartBtns.length; i++) {
    const addToCartBtn2 = cartBtns[i];
    addToCartBtn2.addEventListener("click", function (e) {
      e.preventDefault();
      const variantId = addToCartBtn2.dataset.id;
  
      const formData = {
        items: [
          {
            id: variantId,
            quantity: 1,
          },
        ],
      };
  
      // sideCart.addItem(formData).then(() => sideCart.toggleCart());
      sideCart.addItem(formData);
  
    });
  }
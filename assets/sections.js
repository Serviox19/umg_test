class ProductCard extends HTMLElement {

  static get observedAttributes() {
    return ['product'];
  }

  constructor() {
    super();

    this.addToCart = this.addToCart.bind(this);
    this._product = null;

    this.cart = document.querySelector('cart-notification') || document.querySelector('cart-drawer');
  }

  attributeChangedCallback(attr, oldVal, newVal) {
    if (newVal === 'null' || newVal === 'undefined') return;
    if (oldVal !== newVal) {
      if (['product'].includes(attr)) {
        let product = JSON.parse(newVal);
        this._product = product;
      }
      if (this._product) {
        this.addProductOptions();
      }
    }
  }

  addProductOptions() {
    let cta = null;

    if (this._product.variants.length === 1) {
      console.log(this._product);
      const variant = this._product.variants[0];
      if (variant.available) {
        const button = `
          <button class="add-to-cart" data-variant-id="${variant.id}" name="add" data-option data-available="true">Add To Bag</button>
        `;
        cta = button;
      }
    }
    if (cta) {
      this.querySelector('.product-card__cta').innerHTML = cta;
    }
    // Add add to cart on click event
    this.querySelectorAll('[data-option]').forEach(option =>
      option.addEventListener('click', this.addToCart)
    );
  }

  addToCart(e) {
    e.preventDefault();
    const element = e.target.closest('[data-option]');
    if (element.dataset.available === 'true') {
      const variantId = element.dataset.variantId;
      const options = {
        id: variantId,
        quantity: 1
      };

      jQuery.ajax({
        type: 'POST',
        url: '/cart/add.json',
        data: options,
        dataType: 'json',
        success: function () {
          window.location.reload();
        }
      });
    }
  }
}

customElements.define('product-card', ProductCard);
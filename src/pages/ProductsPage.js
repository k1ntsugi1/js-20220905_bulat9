import SortableTable from '../components/SortableTable.js';
import header from '../store/product-header.js';

export default class ProductsPage {
  
    subElements = {}
  
    constructor({mainClass, range, url}) {
  
      const [path, backendURL] = url;
  
      this.mainClass = mainClass;
      this.path = path;
      this.backendURL = backendURL;
      this.range = {
        from: new Date(range.from),
        to: new Date(range.to)
      };
      
      this.inputData = [header, {
        range: this.range, 
        url: (new URL(this.path, this.backendURL)).toString(),
        isSortLocally: false,
        showingPage: 'ProductsPage',
      }]; 
  
      this.Constructor = SortableTable;
  
      this.render();
    }
  
    get ProductsElement() {
      const wrapper = document.createElement('div');
      const products = `
        <div class="products-list">
            <div class="content__top-panel">
                <h1 class="page-title">Товары</h1>
                <a href="/products/add" class="button-primary" data-element="addProductBtn">Добавить товар</a>
            </div>
            <div data-element="productsContainer" class="products-list__container"></div>
        </div>`;
      wrapper.innerHTML = products;
      return wrapper.firstElementChild;
    }
  
    setSubElements() {
      const elements = this.element.querySelectorAll('[data-element]');
      for (const element of elements) {
        const name = element.dataset.element;
        this.subElements[name] = element;
      }
    }
  
    setWrapperOfElementHTML() {
      this.wrapperOfElementHTML = new this.Constructor(...this.inputData);
    }
  
    async update() {
      this.mainClass.toggleProgressbar();
      const { productsContainer } = this.subElements;
  
      this.setWrapperOfElementHTML();
      await this.wrapperOfElementHTML.render();

      productsContainer.append(this.wrapperOfElementHTML.element);
  
      this.mainClass.toggleProgressbar();
    }
  
    addProductHandler = (event) => {
      const target = event.target.closest('[data-element="addProductBtn"]');
      if (!target) {return ;}
      const href = target.getAttribute('href');
      target.dispatchEvent(this.createCustomEventOfUpdatingHref(`${href}`));

      window.history.pushState(null, null, `${href}`);
    }

    createCustomEventOfUpdatingHref(href) {
      return new CustomEvent('updatedHref', {
        bubbles: true,
        detail: { href }
      });
    }
  
    async render() {
      this.element = this.ProductsElement;
      this.element.addEventListener('click', this.addProductHandler);
      this.setSubElements();
  
      await this.update();
      
      return this.element;
    }
  
    remove() {
      this.element?.remove();
      this.element = null;
    }
  
    destroy() {
      this.wrapperOfElementHTML.destroy();
      this.remove();
    }
}
  
  
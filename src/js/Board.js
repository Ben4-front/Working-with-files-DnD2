export default class Board {
  constructor(container, stateService) {
    this.container = container;
    this.stateService = stateService;

    this.state = this.stateService.load() || {
      todo: { title: 'TODO', items: [] },
      progress: { title: 'IN PROGRESS', items: [] },
      done: { title: 'DONE', items: [] }
    };

    this.render();
  }

  saveState() {

    this.stateService.save(this.state);
  }

  render() {
    this.container.innerHTML = '';
    

    for (const key in this.state) {
      if (Object.prototype.hasOwnProperty.call(this.state, key)) {
        this.renderColumn(key, this.state[key]);
      }
    }
  }

  renderColumn(key, columnData) {
    const columnEl = document.createElement('div');
    columnEl.classList.add('column');
    columnEl.dataset.key = key; 

    columnEl.innerHTML = `
      <div class="column-header">${columnData.title}</div>
      <div class="cards-list"></div>
      <div class="footer">
         <div class="add-btn">+ Add another card</div>
      </div>
    `;

    const list = columnEl.querySelector('.cards-list');
    

    columnData.items.forEach(text => {
      this.createCardElement(list, text);
    });

    this.container.appendChild(columnEl);
    this.bindEvents(columnEl, key);
  }

  createCardElement(container, text) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.textContent = text;


    const deleteBtn = document.createElement('div');
    deleteBtn.classList.add('card-delete');
    deleteBtn.innerHTML = '&#x2716;'; 
    
    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation(); 
      this.deleteCard(card);
    });

    card.appendChild(deleteBtn);
    container.appendChild(card);
  }

  bindEvents(columnEl, key) {
    const addBtn = columnEl.querySelector('.add-btn');
    const footer = columnEl.querySelector('.footer');

    addBtn.addEventListener('click', () => {
      addBtn.style.display = 'none';
      
      const form = document.createElement('div');
      form.classList.add('add-form');
      form.innerHTML = `
        <textarea class="add-input" placeholder="Enter a title for this card..." rows="3"></textarea>
        <div class="add-controls">
           <button class="add-submit">Add Card</button>
           <span class="add-cancel">&times;</span>
        </div>
      `;

      footer.appendChild(form);
      const input = form.querySelector('.add-input');
      input.focus();


      form.querySelector('.add-submit').addEventListener('click', () => {
        const value = input.value.trim();
        if (value) {

          const list = columnEl.querySelector('.cards-list');
          this.createCardElement(list, value);
          

          this.state[key].items.push(value);
          this.saveState();
        }
        form.remove();
        addBtn.style.display = 'block';
      });


      form.querySelector('.add-cancel').addEventListener('click', () => {
        form.remove();
        addBtn.style.display = 'block';
      });
    });
  }

  deleteCard(cardEl) {

    const columnEl = cardEl.closest('.column');
    const key = columnEl.dataset.key;
    const list = columnEl.querySelector('.cards-list');


    const index = Array.from(list.children).indexOf(cardEl);

    cardEl.remove();

    if (index > -1) {
      this.state[key].items.splice(index, 1);
      this.saveState();
    }
  }


  updateStateFromDOM() {
    const columns = this.container.querySelectorAll('.column');
    
    columns.forEach(col => {
      const key = col.dataset.key;
      const items = [];
      const cards = col.querySelectorAll('.card');
      
      cards.forEach(card => {

        const textNode = Array.from(card.childNodes).find(node => node.nodeType === Node.TEXT_NODE);
        if (textNode) {
            items.push(textNode.textContent.trim());
        }
      });

      this.state[key].items = items;
    });

    this.saveState();
  }
}
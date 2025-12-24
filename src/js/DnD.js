export default class DnD {
  constructor(board) {
    this.board = board;
    this.draggedEl = null; 
    this.ghostEl = null;   
    this.placeholder = null; 
    
    this.shiftX = 0;
    this.shiftY = 0;
    

    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);


    document.addEventListener('mousedown', this.onMouseDown);
  }

  onMouseDown(e) {

    if (e.button !== 0) return;


    if (e.target.classList.contains('card-delete')) return;
    
    const card = e.target.closest('.card');
    if (!card) return;

    e.preventDefault();


    this.draggedEl = card;


    const rect = this.draggedEl.getBoundingClientRect();
    this.shiftX = e.clientX - rect.left;
    this.shiftY = e.clientY - rect.top;


    this.ghostEl = card.cloneNode(true);
    this.ghostEl.classList.add('dragged');

    this.ghostEl.style.width = `${rect.width}px`;
    this.ghostEl.style.height = `${rect.height}px`;
    
    document.body.appendChild(this.ghostEl);
    this.moveGhost(e.pageX, e.pageY);


    this.placeholder = document.createElement('div');
    this.placeholder.classList.add('placeholder');
    this.placeholder.style.width = `${rect.width}px`;
    this.placeholder.style.height = `${rect.height}px`;


    document.body.classList.add('grabbing');


    this.draggedEl.style.display = 'none';
    this.draggedEl.parentNode.insertBefore(this.placeholder, this.draggedEl);


    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
  }

  onMouseMove(e) {
    this.moveGhost(e.pageX, e.pageY);


    const elementBelow = document.elementFromPoint(e.clientX, e.clientY);
    if (!elementBelow) return;


    const list = elementBelow.closest('.cards-list');
    
    if (!list) return; 


    const cardBelow = elementBelow.closest('.card');
    

    if (cardBelow) {

      const { top, height } = cardBelow.getBoundingClientRect();
      const middle = top + height / 2;
      
      if (e.clientY < middle) {

        if (cardBelow.previousElementSibling !== this.placeholder) {
             list.insertBefore(this.placeholder, cardBelow);
        }
      } else {

        if (cardBelow.nextElementSibling !== this.placeholder) {
             list.insertBefore(this.placeholder, cardBelow.nextElementSibling);
        }
      }
    } else {

      list.appendChild(this.placeholder);
    }
  }

  moveGhost(pageX, pageY) {
    this.ghostEl.style.left = `${pageX - this.shiftX}px`;
    this.ghostEl.style.top = `${pageY - this.shiftY}px`;
  }

  onMouseUp(e) {
    if (!this.draggedEl) return;


    this.placeholder.replaceWith(this.draggedEl);
    this.draggedEl.style.display = 'block';


    this.ghostEl.remove();
    document.body.classList.remove('grabbing');


    this.board.updateStateFromDOM();

    this.draggedEl = null;
    this.ghostEl = null;
    this.placeholder = null;

    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
  }
}
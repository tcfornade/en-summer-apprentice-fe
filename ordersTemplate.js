//imports
import { updateOrder } from "./updateOrder";
import { deleteOrder } from "./deleteOrder";

export function createOrderItem(order) {
    const orderItem = document.createElement('tr');
  
    const orderIDCell = document.createElement('td');
    orderIDCell.textContent = order.orderId;
    orderItem.appendChild(orderIDCell);
  
    const nrTicketsCell = document.createElement('td');
    const nrTicketsInput = document.createElement('input');
    nrTicketsInput.type = 'number';
    nrTicketsInput.value = order.numberOfTickets;
    nrTicketsInput.id = 'nrTicketsInput';
    nrTicketsInput.disabled = true;
    nrTicketsCell.appendChild(nrTicketsInput);
    orderItem.appendChild(nrTicketsCell);
  
  
    const categoryCell = document.createElement('td');
    const categorySelect = document.createElement('select');
    const standardOption = document.createElement('option');
    standardOption.value = 'Standard';
    standardOption.textContent = 'Standard';
    const vipOption = document.createElement('option');
    vipOption.value = 'VIP';
    vipOption.textContent = 'VIP';
    categorySelect.appendChild(standardOption);
    categorySelect.appendChild(vipOption);
    categorySelect.value = order.ticketCategory;
    categorySelect.id = 'categorySelect';
    categoryCell.appendChild(categorySelect);
    categorySelect.disabled = true;
    orderItem.appendChild(categoryCell);
  
    const dateCell = document.createElement('td');
    dateCell.textContent = order.orderedAt; 
    orderItem.appendChild(dateCell);
  
    const priceCell = document.createElement('td');
    priceCell.textContent = order.totalPrice; 
    orderItem.appendChild(priceCell);
  
    
  const actionsCell = document.createElement('td');

 //buton Delete 
const deleteButton = document.createElement('button');
const trashIcon = document.createElement('i');
trashIcon.classList.add('fa-solid', 'fa-trash-can', 'fa-shake'); 
deleteButton.appendChild(trashIcon);
deleteButton.id = 'buttonDelete';

deleteButton.addEventListener('click', async () => {

  const deletionResult = await deleteOrder(orderData.orderId);

  if (deletionResult.success) {

     console.log('order.orderId');

    console.log('successful deletion')

  } else {

    console.error(deletionResult.message);

  }

});

//---buton Change
const changeButton = document.createElement('button');
const invoiceIcon = document.createElement('i');
invoiceIcon.classList.add('fa-regular', 'fa-pen-to-square'); 
changeButton.appendChild(invoiceIcon);
changeButton.id = 'buttonChange';

//----change button listener
changeButton.addEventListener('click', () => {
  changeButton.textContent = ''; 
  changeButton.disabled = true; 
  deleteButton.textContent = '';
  deleteButton.disabled = true;

  const checkIcon = document.createElement('i');
  checkIcon.classList.add('fas', 'fa-check'); 
  checkIcon.id='checkIcon'
  

  //---check Icon Listener
  checkIcon.addEventListener('click', () => {
    const nrTicketsInput = document.getElementById('nrTicketsInput');
    const categorySelect = document.getElementById('categorySelect');
  
    const data = {
      orderId: order.orderId,
      numberOfTickets: nrTicketsInput.value,
      ticketCategory: categorySelect.value
    };
   
    //---apel catre API de update order
    updateOrder(data);

  });
  changeButton.appendChild(checkIcon);

  const xmarkIcon = document.createElement('i');
  xmarkIcon.classList.add('fas', 'fa-times'); 
  xmarkIcon.id='xmarkIcon';
  changeButton.appendChild(xmarkIcon);

  // ---- xMark Icon Listener
xmarkIcon.addEventListener('click', () => {
  checkIcon.disabled = true; // Dezactivează checkIcon
  xmarkIcon.disabled = true; // Dezactivează xmarkIcon
  changeButton.disabled = false; // Activează changeButton
  deleteButton.disabled = false; // Activează deleteButton
});


//----adaugare dropdown pentru Category
nrTicketsInput.disabled = false;
categorySelect.disabled = false;

});

actionsCell.appendChild(changeButton);
actionsCell.appendChild(deleteButton);


  orderItem.appendChild(actionsCell);

    return orderItem;
  }
  


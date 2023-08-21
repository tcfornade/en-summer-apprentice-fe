import { deleteOrder } from "./deleteOrder";

export async function renderOrderCard(orderData) {
    const orderCard = document.createElement('tr');
    orderCard.classList.add('order-card');
  
    const contentMarkup = `
    <td class="order-details">${orderData.orderId}</td>
    <td class="order-details">${orderData.orderedAt}</td>
    <td class="order-details ticketCategoryDisplay">${orderData.ticketCategory}</td>
    <div class="dropdown-from-orders hide">
        <select>
          <option value="vip">VIP</option>
          <option value="standard">Standard</option>
        </select>
    </div>
    <td class="order-details">
    <span class="ticket-count-display ">${orderData.numberOfTickets}</span>
        <input type="number" class="input-ticket-count hide" value="${orderData.numberOfTickets}" >
      </td>
    <td class="order-details">${orderData.totalPrice}</td>
    <td class="order-actions">
    <button class="btn btn-modify">
         <i class="fa-solid fa-angles-down fa-beat-fade" style="color: #f9a124;"></i>
     </button>
      <button class="btn btn-delete">
        <i class="fa-solid fa-trash-can"></i>
      </button>
      <button class="btn btn-save hide" >
         <i class="fa-solid fa-check"></i>
      </button>
        <button class="btn btn-cancel hide" >
        <i class="fa-solid fa-xmark"></i>
      </button>

    

        <div class="popup-container" id="popupContainer">
          <div class="custom-popup" id="customPopup">
           <p>Sunteți sigur că doriți să ștergeți comanda?</p>
           <button id="confirmDelete">Confirm</button>
           <button id="cancelDelete">Cancel</button>
        </div>
      


    </td>
  `;
  
    orderCard.innerHTML = contentMarkup;
    const modifyButton = orderCard.querySelector('.btn-modify');
    const deleteButton = orderCard.querySelector('.btn-delete');
    const saveButton = orderCard.querySelector('.btn-save');
    const cancelButton = orderCard.querySelector('.btn-cancel');
    const inputTicketCount = orderCard.querySelector('.input-ticket-count'); //hidden initial
    const ticketCountDisplay = orderCard.querySelector('.ticket-count-display');
    const ticketCategoryDisplay=orderCard.querySelector('.ticketCategoryDisplay');
    const ticketCategoryChange=orderCard.querySelector('.dropdown-from-orders');
  
    modifyButton.addEventListener('click', () => {
      modifyButton.classList.add('hide');
      deleteButton.classList.add('hide');
      saveButton.classList.remove('hide'); 
      cancelButton.classList.remove('hide'); 
      ticketCountDisplay.classList.add('hide');
      inputTicketCount.classList.remove('hide');  
      ticketCategoryDisplay.classList.add('hide');
      ticketCategoryChange.classList.remove('hide'); 
    });
  
    saveButton.addEventListener('click', () => {
      const newTicketCount = inputTicketCount.value;
      // Aici poți adăuga cod pentru a actualiza numărul de bilete în obiectul orderData sau în altă parte
      ticketCountDisplay.textContent = newTicketCount;
      saveButton.classList.add('hide'); // Hide the Save button again
      cancelButton.classList.add('hide'); // Hide the Cancel button again
      modifyButton.classList.remove('hide');
      deleteButton.classList.remove('hide');
      ticketCountDisplay.classList.remove('hide');
      inputTicketCount.classList.add('hide'); 
      ticketCategoryDisplay.classList.remove('hide');
      ticketCategoryChange.classList.add('hide');
      
      
      
    });
  
    cancelButton.addEventListener('click', () => {
      saveButton.classList.add('hide'); // Hide the Save button again
      cancelButton.classList.add('hide'); // Hide the Cancel button again
      modifyButton.classList.remove('hide');
      deleteButton.classList.remove('hide');
      ticketCountDisplay.classList.remove('hide');
      inputTicketCount.classList.add('hide');  
      ticketCategoryDisplay.classList.remove('hide');
      ticketCategoryChange.classList.add('hide');
    });
  
   





    // ------delete popup:
    const overlay = document.getElementById('overlay');
    const popupContainer = orderCard.querySelector('#popupContainer');
   
    const confirmDeleteButton = orderCard.querySelector('#confirmDelete');
    const cancelDeleteButton = orderCard.querySelector('#cancelDelete');
    
    deleteButton.addEventListener('click', () => {
      overlay.style.display = 'block';
      popupContainer.style.display = 'block';
    });
    
    confirmDeleteButton.addEventListener('click', async () => {
      const deletionResult = await deleteOrder(orderData.orderId);
    
      if (deletionResult.success) {
        console.log(orderData.orderId);
        orderCard.remove();
        console.log('Ștergere reușită');
      } else {
        console.error(deletionResult.message);
      }
    
      overlay.style.display = 'none';
      popupContainer.style.display = 'none';
    });
    
    cancelDeleteButton.addEventListener('click', () => {
      overlay.style.display = 'none';
      popupContainer.style.display = 'none';
      console.log('Ștergere anulată');
    });


    return orderCard;
  }
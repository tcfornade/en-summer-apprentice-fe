//Imports
import { removeLoader, addLoader } from "./loader";
//import { createOrderItem } from "./ordersTemplate";
//import { renderOrderCard } from "./ordersTemplate";
import { deleteOrder } from "./deleteOrder";


// Navigate to a specific URL
function navigateTo(url) {
  history.pushState(null, null, url);
  renderContent(url);
}
// HTML templates
function getHomePageTemplate() {
  return `
   <div id="content" class="hidden">
      
      <div class="events flex items-center justify-center flex-wrap">
      </div>
    </div>
  `;
}

function getOrdersPageTemplate() {
  return `
  <head>
      <link rel="stylesheet" href="style.css">
  </head>
  <div id="content">
      <h1 class="text-2xl mb-4 mt-8 text-center">Purchased Tickets</h1>
         
  </div>
</div>
`;
}

function setupNavigationEvents() {
  const navLinks = document.querySelectorAll('nav a');
  navLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const href = link.getAttribute('href');
      navigateTo(href);
    });
  });
}

function setupMobileMenuEvent() {
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }
}

function setupPopstateEvent() {
  window.addEventListener('popstate', () => {
    const currentUrl = window.location.pathname;
    renderContent(currentUrl);
  });
}

function setupInitialPage() {
  const initialUrl = window.location.pathname;
  renderContent(initialUrl);
}

async function renderHomePage() {
  const mainContentDiv = document.querySelector('.main-content-component');
  mainContentDiv.innerHTML = getHomePageTemplate();

  console.log('function', fetchTicketEvents());
  fetchTicketEvents()
  .then((data)=>{
    setTimeout(()=> {
      removeLoader();
    },200);
    console.log('data', data);
  });

  const eventsData = await fetchTicketEvents();
  const eventsContainer = document.querySelector('.events');

  eventsData.forEach(eventData => {
    const eventCard = document.createElement('div');
    eventCard.classList.add('event-card');
    const contentMarkup = `
    <div class="card">
      <header>
        <h2 class="event-title text-2xl font-bold">${eventData.eventName}</h2>
        <hr>
      </header>
      <div class="content">
         <div class="descriptionBox>
            <p> Description:</p>
            <p class=" text-gray-700">Description: ${eventData.eventDescription}</p>
         </div>
        <div class="dropdowns absolute bottom-0 right-0 p-4 bg-white border rounded shadow-md">
          <p class="font-bold mb-2">Choose ticket category:</p>
           <select class='ticket-category-${eventData.eventID} mb-2'">
           <option value="${eventData.ticketCategory[0].ticketCategoryId}">${eventData.ticketCategory[0].description}</option>
           <option value="${eventData.ticketCategory[1].ticketCategoryId}">${eventData.ticketCategory[1].description}</option>
           </select>

          <div class="quantity">
           
            <button class="btn btn-quantity" data-action="decrement">-</button>
            <input type="number" class="ticket-quantity-input" value="0">
            <button class="btn btn-quantity" data-action="increment">+</button>
            
          </div>
          <button class="btn btn-primary mt-4 mx-auto block rounded-full font-bold py-2 px-6" id="buyTicketsBtn">Buy</button>
        </div>
      </div>
      </div>
    `;

    eventCard.innerHTML = contentMarkup;
    eventsContainer.appendChild(eventCard);

    const buyTicketsButton = eventCard.querySelector('#buyTicketsBtn');
    const ticketCategorySelect = eventCard.querySelector(`.ticket-category-${eventData.eventID}`);
    const quantityInput = eventCard.querySelector('.ticket-quantity-input');

    buyTicketsButton.addEventListener('click', async () => 
    {
     const ticketCategorySelect= document.querySelector(`.ticket-category-${eventData.eventID}`);
     const selectedTicketCategory=ticketCategorySelect.value;
     
      const eventID = eventData.eventID; 
      const ticketCategoryID = parseInt(ticketCategorySelect.value);
      const numberOfTickets = parseInt(quantityInput.value);

      const orderData = {
        eventID,
        ticketCategoryID:selectedTicketCategory,
        numberOfTickets
      };
        console.log(JSON.stringify(orderData));
      try {
        const response = await placeOrder(orderData);
        console.log('Order placed:', response);

      } catch (error) {
        console.error('Error placing order:', error);
      }
    });

    const dropdowns = eventCard.querySelector('.dropdowns');
   // const quantityInput = eventCard.querySelector('.ticket-quantity-input');
    const incrementButton = eventCard.querySelector('[data-action="increment"]');
    const decrementButton = eventCard.querySelector('[data-action="decrement"]');

    incrementButton.addEventListener('click', () => {
      let currentValue = parseInt(quantityInput.value);
      if (currentValue >= 0) {
        quantityInput.value = currentValue + 1;
      }
    });

    decrementButton.addEventListener('click', () => {
      let currentValue = parseInt(quantityInput.value);
      if (currentValue > 0) {
        quantityInput.value = currentValue - 1;
      }
    });
  });
}

//get tickets ----------
async function fetchTicketEvents(){
  const response = await fetch('https://localhost:7114/api/Event/GetAll');
  const data=await response.json();
  return data;
}

//place order --------
async function placeOrder(orderData) {
  const apiUrl = 'http://localhost:9090/create-order';
  
  addLoader();

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(orderData)
  })
  .finally(()=> {
    setTimeout(()=> {
      removeLoader();
    },200);
  });

  if (!response.ok) {
    throw new Error('Failed to place order');
  }

  const responseData = await response.json();
  return responseData;
}


//get orders ----------
async function fetchOrders() {
  const response = await fetch('https://localhost:7114/api/Order/GetAll');
  addLoader();
  const orders = await response.json().finally(()=> {
    setTimeout(()=> {
      removeLoader();
    },200);
  });
  return orders;
}


async function renderOrderCard(orderData) {
  const orderCard = document.createElement('tr');
  orderCard.classList.add('order-card');

  const contentMarkup = `
  <td class="order-details">${orderData.orderId}</td>
  <td class="order-details">${orderData.orderedAt}</td>
  <td class="order-details">${orderData.ticketCategory}</td>
  <td class="order-details">
      <span class="ticket-count">${orderData.numberOfTickets}</span>
      <input type="number" class="input-ticket-count" value="${orderData.numberOfTickets}" style="display: none;">
    </td>
  <td class="order-details">${orderData.totalPrice}</td>
  <td class="order-actions">
  <button class="btn btn-modify">
       <i class="fa-solid fa-angles-down fa-beat-fade" style="color: #f9a124;"></i>
   </button>
    <button class="btn btn-delete">
    <i class="fa-solid fa-trash-can"></i>
    </button>
    <button class="btn btn-save hide" hidden>
    <i class="fa-solid fa-check"></i>
    </button>
    <button class="btn btn-cancel hide" hidden>
    <i class="fa-solid fa-xmark"></i>
    </button>
  </td>
`;

  orderCard.innerHTML = contentMarkup;
  const modifyButton = orderCard.querySelector('.btn-modify');
  const deleteButton = orderCard.querySelector('.btn-delete');
  const saveButton = orderCard.querySelector('.btn-save');
  const cancelButton = orderCard.querySelector('.btn-cancel');
  const ticketCountDisplay = orderCard.querySelector('.ticket-count');
  const inputTicketCount = orderCard.querySelector('.input-ticket-count');

  modifyButton.addEventListener('click', () => {
    modifyButton.classList.add('hide');
    deleteButton.classList.add('hide');
    saveButton.classList.remove('hide'); // Show the Save button
    cancelButton.classList.remove('hide'); // Show the Cancel button
   
  });

  saveButton.addEventListener('click', () => {
    const newTicketCount = inputTicketCount.value;
    // Aici poți adăuga cod pentru a actualiza numărul de bilete în obiectul orderData sau în altă parte
    ticketCountDisplay.textContent = newTicketCount;
    saveButton.classList.add('hide'); // Hide the Save button again
    cancelButton.classList.add('hide'); // Hide the Cancel button again
    modifyButton.classList.remove('hide');
    deleteButton.classList.remove('hide');
    
  });

  cancelButton.addEventListener('click', () => {
    saveButton.classList.add('hide'); // Hide the Save button again
    cancelButton.classList.add('hide'); // Hide the Cancel button again
    modifyButton.classList.remove('hide');
    deleteButton.classList.remove('hide');
 
  });

  deleteButton.addEventListener('click', async () => {

    const deletionResult = await deleteOrder(orderData.orderId);
  
    if (deletionResult.success) {
  
       console.log('order.orderId');
       orderCard.remove();
      console.log('successful deletion')
  
    } else {
  
      console.error(deletionResult.message);
  
    }
  
  });

  return orderCard;
}

async function renderOrdersPage() {
  const mainContentDiv = document.querySelector('.main-content-component');
  mainContentDiv.innerHTML = getOrdersPageTemplate();

  const ordersData = await fetchOrders();

  const ordersTable = document.createElement('table');
  ordersTable.classList.add('orders-table');

  const tableHeaderMarkup = `
    <thead>
      <tr>
        <th>OrderID</th>
        <th>Date</th>
        <th>Ticket Category</th>
        <th>Number of Tickets</th>
        <th>Total Price</th>
        <th>Actions</th>
      </tr>
    </thead>
  `;
  ordersTable.innerHTML = tableHeaderMarkup;

  const tableBody = document.createElement('tbody');
  console.log("OrdersData", ordersData);

  for (const orderData of ordersData) {
    const orderCard = await renderOrderCard(orderData);
    tableBody.appendChild(orderCard);
  }

  ordersTable.appendChild(tableBody);
  mainContentDiv.appendChild(ordersTable);
}

// Render content based on URL
function renderContent(url) {
  const mainContentDiv = document.querySelector('.main-content-component');
  mainContentDiv.innerHTML = '';

  if (url === '/') {
    renderHomePage();
  } else if (url === '/orders') {
    renderOrdersPage()
  }
}

// Call the setup functions
setupNavigationEvents();
setupMobileMenuEvent();
setupPopstateEvent();
setupInitialPage();

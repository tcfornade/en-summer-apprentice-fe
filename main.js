// Navigate to a specific URL
function navigateTo(url) {
  history.pushState(null, null, url);
  renderContent(url);
}
// HTML templates
function getHomePageTemplate() {
  return `
   <div id="content" >
      
      <div class="events flex items-center justify-center flex-wrap">
      </div>
    </div>
  `;
}

function getOrdersPageTemplate() {
  return `
    <div id="content">
    <h1 class="text-2xl mb-4 mt-8 text-center">Purchased Tickets</h1>
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
  fetchTicketEvents().then((data)=>{
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
          <p class="font-bold mb-2">Choose the Ticket Category:</p>
           <select class='ticket-category-${eventData.eventID} mb-2'">
             <option value="1">Standard</option>
             <option value="2">VIP</option>
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
    const ticketCategorySelect = eventCard.querySelector(`.ticket-category-${eventData.eventId}`);
    const quantityInput = eventCard.querySelector('.ticket-quantity-input');

    buyTicketsButton.addEventListener('click', async () => 
    {
     const ticketCategorySelect= document.querySelector(`.ticket-category-${eventData.eventId}`);
     const selectedTicketCategory=ticketCategorySelect.value;
     console.log(selectedTicketCategory);
      const eventID = eventData.eventId; // ID-ul evenimentului
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

//backend
async function fetchTicketEvents(){
  const response = await fetch('https://localhost:7114/api/Event/GetAll');
  const data=await response.json();
  return data;
}

async function placeOrder(orderData) {
  const apiUrl = 'http://localhost:9090/create-order'; // Înlocuiți cu URL-ul real al API-ului
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(orderData)
  });

  if (!response.ok) {
    throw new Error('Failed to place order');
  }

  const responseData = await response.json();
  return responseData;
}



function renderOrdersPage(categories) {
  const mainContentDiv = document.querySelector('.main-content-component');
  mainContentDiv.innerHTML = getOrdersPageTemplate();
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

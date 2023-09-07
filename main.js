//Imports
import { removeLoader, addLoader } from './loader';
import { deleteOrder } from './deleteOrder';

import { renderOrdersPage } from './ordersPage';
import { addSearch } from './searchBar';
import { addListenerToRadioButtons } from './eventSort';

// Navigate to a specific URL
function navigateTo(url) {
  history.pushState(null, null, url);
  renderContent(url);
}


function getHomePageTemplate() {
  return `

  <button id="sortByEventType" class = "btn-sort">Sort by event type</button>
  <div class="radio-button-container hide">
    <label>
      <input type="radio" name="category" value="Music"> Music
    </label>
    <label>
       <input type="radio" name="category" value="Sports"> Sports
    </label>
    <label>
       <input type="radio" name="category" value="Drinks"> Drinks
    </label>
  </div>

  <div class="search-container">
        <i class="fa fa-search"></i>
        <input type="text" id="search-input" placeholder="Search..." autocomplete="off">
  </div>



   <div id="content" class="hidden">
     
   <ul id="results"></ul>
      <div class="events flex items-center justify-center flex-wrap">
         <div id="nothing-alert">Nothing Found</div>
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
  addListenerToRadioButtons();
  const search = document.getElementById('search-input');

  fetchTicketEvents().then((data) => {
    setTimeout(() => {
      removeLoader();
    }, 200);
  });

  const eventsData = await fetchTicketEvents();

  search.addEventListener('input', () => {
    addSearch(eventsData);
  });

  const eventsContainer = document.querySelector('.events');

  const eventImages = [
    'src/assets/untold.webp',
    'src/assets/electric.jpg',
    'src/assets/meci.jpg',
    'src/assets/wine.jpg',
  ];
  eventsData.forEach((eventData, index) => {
    const eventCard = document.createElement('div');
    eventCard.classList.add('event-card');
    const eventImage = eventImages[index];
    const contentMarkup = `
    <div class="card">
      <header>
        <h2 class="event-title text-2xl font-bold">${eventData.eventName}</h2>
        <hr>
      </header>
      <div class="content">
        <img src="${eventImage}" alt="${eventData.eventName}" class="event-image">
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
    const ticketCategorySelect = eventCard.querySelector(
      `.ticket-category-${eventData.eventID}`
    );
    const quantityInput = eventCard.querySelector('.ticket-quantity-input');

    buyTicketsButton.addEventListener('click', async () => {
      const ticketCategorySelect = document.querySelector(
        `.ticket-category-${eventData.eventID}`
      );
      const selectedTicketCategory = ticketCategorySelect.value;

      const eventID = eventData.eventID;
      const ticketCategoryID = parseInt(ticketCategorySelect.value);
      const numberOfTickets = parseInt(quantityInput.value);

      const orderData = {
        eventID,
        ticketCategoryID: selectedTicketCategory,
        numberOfTickets,
      };

      try {
        const response = await placeOrder(orderData);
      } catch (error) {}
    });

    const incrementButton = eventCard.querySelector(
      '[data-action="increment"]'
    );
    const decrementButton = eventCard.querySelector(
      '[data-action="decrement"]'
    );

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
async function fetchTicketEvents() {
  const response = await fetch('https://localhost:7114/api/Event/GetAll');
  const data = await response.json();
  return data;
}

//place order --------
async function placeOrder(orderData) {
  const apiUrl = 'http://localhost:9090/create-order';

  addLoader();

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(orderData),
  }).finally(() => {
    setTimeout(() => {
      removeLoader();
    }, 200);
  });

  if (!response.ok) {
    throw new Error('Failed to place order');
  }

  const responseData = await response.json();
  return responseData;
}

// Render content based on URL
function renderContent(url) {
  const mainContentDiv = document.querySelector('.main-content-component');
  mainContentDiv.innerHTML = '';

  if (url === '/') {
    renderHomePage();
  } else if (url === '/orders') {
    renderOrdersPage();
  }
}

// Call the setup functions
setupNavigationEvents();
setupMobileMenuEvent();
setupPopstateEvent();
setupInitialPage();

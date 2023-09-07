import { renderOrderCard } from './createOrderCard';
import { removeLoader, addLoader } from './loader';

export async function renderOrdersPage() {
  const mainContentDiv = document.querySelector('.main-content-component');
  mainContentDiv.innerHTML = getOrdersPageTemplate();

  const overlay = document.createElement('div');
  overlay.id = 'overlay';
  overlay.className = 'overlay';
  mainContentDiv.appendChild(overlay);

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

  for (const orderData of ordersData) {
    const orderCard = await renderOrderCard(orderData);
    tableBody.appendChild(orderCard);
  }

  ordersTable.appendChild(tableBody);
  mainContentDiv.appendChild(ordersTable);
 
  const sortAscendingBtn = document.getElementById('sortAscendingBtn');
  sortAscendingBtn.addEventListener('click', function() {
    sortOrders('asc');
  });

 
  const sortDescendingBtn = document.getElementById('sortDescendingBtn');
  sortDescendingBtn.addEventListener('click', function() {
    sortOrders('desc');
  });
  
  
}

function getOrdersPageTemplate() {
  return `
    <head>
        <link rel="stylesheet" href="style.css">
    </head>
    <div id="content">
        <h1 class="text-2xl mb-4 mt-8 text-center">Purchased Tickets</h1> 
        <div class="sort-buttons">
           <button class="btn-sort" id="sortAscendingBtn">Sort Ascending By Price</button>
           <button class="btn-sort" id="sortDescendingBtn">Sort Descending By Price</button>
      </div>
      </div>
  </div>
  `;
}

async function fetchOrders() {
  const response = await fetch('https://localhost:7114/api/Order/GetAll');
  addLoader();
  const orders = await response.json().finally(() => {
    setTimeout(() => {
      removeLoader();
    }, 200);
  });
  return orders;
}

function sortOrders(sortOrder) {
  const ordersTable = document.querySelector('.orders-table');
  const orderCards = Array.from(ordersTable.querySelectorAll('.order-card'));

  orderCards.sort((a, b) => {
    const priceA = parseFloat(a.querySelector('.order-details.totalPrice').textContent);
    const priceB = parseFloat(b.querySelector('.order-details.totalPrice').textContent);
    
    if (sortOrder === 'asc') {
      return priceA - priceB;
    } else if (sortOrder === 'desc') {
      return priceB - priceA;
    }
  });

  // Rearanjează cardurile în tabel
  orderCards.forEach(card => ordersTable.appendChild(card));
}



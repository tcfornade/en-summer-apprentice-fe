import { renderOrderCard } from "./createOrderCard";
import { removeLoader, addLoader } from "./loader";

export async function renderOrdersPage() {
  const mainContentDiv = document.querySelector('.main-content-component');
  mainContentDiv.innerHTML = getOrdersPageTemplate();

  const overlay = document.createElement('div');
  overlay.id = 'overlay';
  overlay.className='overlay';
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
  console.log("OrdersData", ordersData);

  for (const orderData of ordersData) {
    const orderCard = await renderOrderCard(orderData);
    tableBody.appendChild(orderCard);
  }

  ordersTable.appendChild(tableBody);
  mainContentDiv.appendChild(ordersTable);

// -----create a listener for sort label
  document.addEventListener("DOMContentLoaded", function() {
    const sortLabel = document.querySelector(".sort-label");
    const sortToggle = document.querySelector(".sort-toggle");
    const dropdownContent = document.querySelector(".dropdown-content-sorting-orders");
  
    sortLabel.addEventListener("click", function() {
      sortToggle.checked = !sortToggle.checked;
      dropdownContent.style.display = sortToggle.checked ? "block" : "none";
    });
  
    const dropdownOptions = document.querySelectorAll(".dropdown-option-orders");
    dropdownOptions.forEach(option => {
      option.addEventListener("click", function() {
        const selectedSort = option.getAttribute("data-sort");
        // Aici poți adăuga cod pentru a gestiona opțiunea selectată (sortare).
        console.log("Selected sort:", selectedSort);
        sortToggle.checked = false;
        dropdownContent.style.display = "none";
      });
    });
  
    window.addEventListener("click", function(e) {
      if (!sortLabel.contains(e.target) && !dropdownContent.contains(e.target)) {
        sortToggle.checked = false;
        dropdownContent.style.display = "none";
      }
    });
  });
 
  
  
}

function getOrdersPageTemplate() {
    return `
    <head>
        <link rel="stylesheet" href="style.css">
    </head>
    <div id="content">
        <h1 class="text-2xl mb-4 mt-8 text-center">Purchased Tickets</h1>
        
  
        <div class="dropdown-sorting-orders">
          <label for="sortToggle" class="sort-label">Sort by</label>
         <input type="checkbox" id="sortToggle" class="sort-toggle">
           <ul class="dropdown-content-sorting-orders">
              <li class="dropdown-option-orders" data-sort="price-asc">Price Ascending</li>
              <li class="dropdown-option-orders" data-sort="price-desc">Price Descending</li>
              <li class="dropdown-option-orders" data-sort="name">Name</li>
    </ul>
  </div>
  
  
      </div>
  </div>
  `;
  }
  

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
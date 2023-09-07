import { renderOrdersPage } from "./ordersPage";

export function updateOrder(data) {
    fetch('https://localhost:7114/api/Order/Patch', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      // actualizare tabel
      renderOrdersPage();
    })
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
    });
  }
  
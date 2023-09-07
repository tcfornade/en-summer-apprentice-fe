export function addSearch(eventsData) {
  const searchInput = document.getElementById('search-input');
  const eventCards = document.querySelectorAll('.event-card');
  const nothingFound = document.getElementById('nothing-alert');

  function performSearch() {
    const searchQuery = searchInput.value.trim().toLowerCase();

    eventCards.forEach((eventCard) => {
      const eventNameElement = eventCard.querySelector('.event-title');
      const eventName = eventNameElement.textContent.toLowerCase();

      if (eventName.includes(searchQuery)) {
        eventCard.style.display = 'block';
      } else {
        eventCard.style.display = 'none';
      }
    });

    const visibleEventCards = document.querySelectorAll(
      '.event-card:not([style*="display: none"])'
    );
    nothingFound.style.display =
      visibleEventCards.length === 0 ? 'block' : 'none';
  }

  searchInput.addEventListener('input', performSearch);

  searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      performSearch();
    }
  });

  // Rulăm căutarea inițială pe toate evenimentele
  performSearch();
}
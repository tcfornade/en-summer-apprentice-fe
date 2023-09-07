export function addListenerToRadioButtons(){
  const buttonSort = document.getElementById('sortByEventType');
  const radioButtonContainer = document.querySelector('.radio-button-container');

  buttonSort.addEventListener('click', function() {
    radioButtonContainer.classList.remove='hide';
  });
}
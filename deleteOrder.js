export async function deleteOrder(orderId) {
    const apiUrl = `https://localhost:7114/api/Order/Delete?id=${orderId}`;
  
    try {

      const response = await fetch(`https://localhost:7114/api/Order/Delete?id=${orderId}`, {
  
        method: 'DELETE',
  
      });
  
   
  
      if (response.ok) {
  
        return { success: true, message: 'Event deleted successfully.' };
  
      } else {
  
        const errorData = await response.json();
  
        return { success: false, message: errorData.message };
  
      }
  
    } catch (error) {
  
      return { success: false, message: 'An error occurred while deleting the event.' };
  
    }
  }
  
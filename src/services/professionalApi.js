import axios from 'axios';

export const getProfessional =async()=>
{
    try{
        const response=await axios.get('https://localhost:7111/api/Professional'); // מביא את כל אנשי המקצוע
        console.log("Fetched professionals:", response.data);
        return response.data;
    }
    catch (error) {
        console.error("Error fetching Professional:", error);
        throw error; 
   }
}
export const getProfessionalById = async (id) => {
    try {
      console.log("1: ",id);
      const response = await axios.get(`https://localhost:7111/api/Professional/${id}`); 
      console.log("2: ",id);
      return response.data;
    } catch (error) {
      console.error(`Error fetching professional with id ${id}:`, error);
      throw error;
    }
}
export const addProfessional = async (professionalData) => {
    try {
      console.log(professionalData);
      const response = await axios.post('https://localhost:7111/api/Professional',professionalData ) // מוסיף

      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Error adding professional:", error);
      throw error;
    }
  }
  export const updateProfessional = async (id, professionalData) => {
    try {
      console.log("id, professionalData",id, professionalData);
      const response = await axios.put(`https://localhost:7111/api/Professional/${id}`, professionalData) // מעדכן
      console.log("response",response);
      console.log("response.data",response.data);
      return response.data;
    } catch (error) {
      console.error(`Error updating professional with id ${id}:`, error);
      throw error;
    }
  }
  export const deleteProfessional = async (id) => {
    try {
      const response = await axios.delete(`https://localhost:7111/api/Professional/${id}`) // מוחק
      return response.data;
    } catch (error) {
      console.error(`Error deleting professional with id ${id}:`, error);
      throw error;
    }
  }
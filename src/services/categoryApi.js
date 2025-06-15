import axios from 'axios';

export const getCategory =async()=>
{
    try{
        const response=await axios.get('https://localhost:7111/api/Category'); // מביא את כל הקטגוריות
        console.log("Fetched category:", response.data);
        return response.data;
    }
    catch (error) {
        console.error("Error fetching category:", error);
        throw error; 
   }
}
export const getCategoryById = async (id) => {
    try {
      console.log("1: ",id);
      const response = await axios.get(`http://localhost:7111/api/Category/${id}`); 
      console.log("2: ",id);
      return response.data;
    } catch (error) {
      console.error(`Error fetching category with id ${id}:`, error);
      throw error;
    }
}
export const addCategory = async (categoryData) => {
    try {
      console.log(categoryData);
      const response = await axios.post('http://localhost:7111/api/Category',categoryData ) // מוסיף

      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Error adding category:", error);
      throw error;
    }
  }
  export const updateCategory = async (id, categorylData) => {
    try {
      console.log("id, categoryData",id, professionalData);
      const response = await axios.put(`http://localhost:7111/api/Category/${id}`, categoryData) // מעדכן
      console.log("response",response);
      console.log("response.data",response.data);
      return response.data;
    } catch (error) {
      console.error(`Error updating category with id ${id}:`, error);
      throw error;
    }
  }
  export const deleteCategory = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:7111/api/Category/${id}`) // מוחק
      return response.data;
    } catch (error) {
      console.error(`Error deleting category with id ${id}:`, error);
      throw error;
    }
  }
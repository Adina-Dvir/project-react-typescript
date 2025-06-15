import axios from 'axios';

export const getUser = async () => {
    try {
      const response = await axios.get('https://localhost:7111/api/UserController'); 
      return response.data;
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error; 
    }
  }
  
  export const getUserById = async (id) => {
    try {
      const response = await axios.get(`https://localhost:7111/api/UserController/${id}`); 
      return response.data;
    } catch (error) {
      console.error(`Error fetching user with id ${id}:`, error);
      throw error;
    }
  }
  
  export const addUser = async (userData) => {
    try {
      const response = await axios.post('https://localhost:7111/api/UserController', userData); 
      return response.data;
    } catch (error) {
      console.error("Error adding user:", error);
      throw error;
    }
  }
  
  export const deleteUser = async (id) => {
    try {
      const response = await axios.delete(`https://localhost:7111/api/UserController/${id}`); 
      return response.data;
    } catch (error) {
      console.error(`Error deleting user with id ${id}:`, error);
      throw error;
    }
  }
  
  export const updateUser = async (id, userData) => {
    try {
      const response = await axios.put(`https://localhost:7111/api/User/${id}`, userData);
      return response.data;
    } catch (error) {
      console.error(`Error updating user with id ${id}:`, error);
      throw error;
    }
  }
  

  export const userLogin = async (l) => {
    try {
      console.log("llkkll",l);
        const response = await axios.post('https://localhost:7111/api/User', l);
        console.log(" response.data", response.data);
        return response.data;
    } catch (error) {
        console.error("Error during login:", error);
        throw error;
    }
}

export const userSignup = async (userData) => {
    try {
        const response = await axios.post('https://localhost:7111/api/User', userData);
        console.log(" response.data", response.data);
        return response.data; 
    } catch (error) {
        console.error("Error during signup:", error);
        throw error;
    }
}



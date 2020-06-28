import axios from 'axios';


const instance = axios.create({
  baseURL: 'https://build-burger-of-your-dream.firebaseio.com/'
});

export default instance;
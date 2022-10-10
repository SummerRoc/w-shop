import axios from 'axios'
import {
  ElMessage
} from 'element-plus'
import router from "../router";

const myaxios = axios.create({

})

myaxios.interceptors.request.use((config) => {

  return config;
}, (error) => {

  return Promise.reject(error);
});

myaxios.interceptors.response.use((res) => {
  if (res.data.code == 3000) {
    ElMessage.error(res.data.msg)
    router.push('/')
    return Promise.reject()
  } 
  else {
    return res;
  }
}, (error) => {

  return Promise.reject(error);
});

export default myaxios
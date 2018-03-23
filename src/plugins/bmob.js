import Axios from 'axios'
var instance = Axios.create({
    baseURL:'/bmob/1',
    headers:{
        'X-Bmob-Application-Id':'d680a6ffca237c744a6d12aa80c73c14',
        'X-Bmob-REST-API-Key':'8f0d2739c9a5c143c6d12d0801e08ab4',
        'Content-Type':'application/json',
    }
})
var Msg = new Object();
Msg.getCode=(phone_number)=>{
    return instance.post('/requestSmsCode',{"mobilePhoneNumber":phone_number})
}
Msg.checkCode=(phone_number,code)=>{
    return instance.post(`/verifySmsCode/${code}`,{"mobilePhoneNumber":phone_number})
}
export default ({ Vue }) => {
    Vue.prototype.$Msg = Msg
  }
  
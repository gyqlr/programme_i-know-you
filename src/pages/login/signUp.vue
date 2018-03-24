<template>
  <q-card class="full-width" id="container">
          <q-card-title>
            <div class="row">
              <img src="../../statics/img/logo.svg" style="width:3em;height:3em;"/>
              <p class="q-ma-md vertical-middle" style="font-size:1.3em">创建您的账号</p>
            </div>
            <q-btn round flat icon="more_vert" slot="right">
              <q-popover :self="$q.platform.is.mobile?'bottom right':'top left'">
                <q-list link class="no-border">
                  <q-item >
                    <q-item-main label="已有账号登录"/>
                  </q-item>
                   <q-item>
                   <q-item-main label="忘记密码了?"/>
                  </q-item>
                </q-list>
              </q-popover>
            </q-btn>
          </q-card-title>
          <q-card-main class="q-mt-lg" id="main">
           <q-field :count="10" id="name-input" v-if="step===0" key="step-0" class="animate-pop" :error="name.length>10">
              <p class="caption q-mb-xl" style="text-align:center;font-size:1.5em;">您的昵称</p>
              <q-input maxlength="10" v-model="name" align="center" autofocus />
           </q-field>
            <q-field :count="13" id="name-input" v-if="step===1" key="step-1" class="animate-pop" helper="6~13位" :error="password.length<6||password.length>13">
              <p class="caption q-mb-xl" style="text-align:center;font-size:1.5em;">设置您的密码</p>
              <q-input type="password" maxlength="13" v-model="password" align="center" autofocus/>
           </q-field>
            <q-field 
            :count="11" 
            id="name-input" 
            v-if="step===2&&!sending" 
            key="step-2" class="animate-pop" 
            :warning="!phoneNumber||phoneNumber.toString().length!==11"
            :error="vaildPhoneNumber.length>0&&checkPhone&&!checkPhone.status"
            error-label="已注册">
              <p class="caption q-mb-xl" style="text-align:center;font-size:1.5em;">验证您的手机号</p>
              <q-input 
              :disable="sending"
              autofocus
              type="number" 
              v-model="phoneNumber" 
              align="center"
              :loading="loading>0"/>
           </q-field>
           <div class="row justify-center q-ma-md">
            <q-field 
            :error="codeError"
             error-label="验证码不正确"
             >
            <q-input float-label="请输入您收到的验证码" v-model="code" class="animate-pop" v-if="step===2&&sending" />
            </q-field>
            <q-btn  flat color="primary" class="q-ml-md animate-pop" @click="onSendClick" :loading="loading>0" :disable="this.time>0" :label="`${ time>0 ? time.toString()+'秒后':''}重发`" v-if="step===2&&sending"/>
            <q-btn flat color="primary" class="animate-pop" label="恭喜!您的号码未被注册,点击发送验证码" @click="onSendClick" v-if="!sending&&step==2&&phoneNumber&&phoneNumber.toString().length===11&&checkPhone&&checkPhone.status"/>
            </div>
            <div v-if="step===3" class="column items-center">
                <p style="text-align:center;font-size:3em;" >恭喜!注册成功</p>
                <q-btn round flat icon="chevron right" color="primary" style="font-size:3em" @click="refresh"/>
                {{getToken()}}
            </div>
          </q-card-main>
          <q-card-actions align="end" class="q-pa-lg" id="action" >
            <q-btn flat color="primary" @click="step--" v-if="step>0&&step!=3" label="返回"/>
            <q-btn  
            color="primary" 
            @click="step++" 
            v-if="step<2" 
            :disable="(step===0&&(!name||name.length>10))||(step===1&&(password.length<6||password.length>13))" 
            label="下一步"
            />
            <q-btn color="primary" label="提交" @click="onSubmitClick" v-if="step===2&&sending" :disable="!code"/>
          </q-card-actions>
        </q-card>
</template>
<script>
import gql from "graphql-tag";
import { setInterval, clearInterval } from "timers";
import { Cookies, Platform } from "quasar";
import crypto from "crypto";
export default {
  name: "signUp",
  data() {
    return {
      name: "",
      password: "",
      phoneNumber: null,
      vaildPhoneNumber: "", //有效手机号码
      step: 0, //当前步骤
      checkPhone: null, // 号码是否重复
      loading: 0,
      sending: false, // 验证码发送状态
      code: null,
      time: 0, // 当前倒计时
      codeError: false // 验证码是否正确
    };
  },

  methods: {
      refresh(){
          location.href=location.pathname
      },
    getToken() {
      return Cookies.get("authToken");
    },
    onSendClick() {
      this.loading++;
      this.$Msg
        .getCode(this.vaildPhoneNumber)
        .then(data => {
          this.time = 30;
          let t = setInterval(() => {
            this.time > 0 ? this.time-- : clearInterval(t);
          }, 1000);
          this.loading--;
          this.sending = true;
        })
        .catch(error => {
          this.loading--;
          console.error(error);
        });
    },
    onSubmitClick() {
      this.loading++;
      this.$Msg
        .checkCode(this.vaildPhoneNumber, this.code)
        .then(data => {
          this.codeError = false;
          const cipher = crypto.createCipher("aes192", this.password);
          let encrypted = cipher.update(this.vaildPhoneNumber, "utf8", "hex");
          encrypted += cipher.final("hex");
          let s = gql`
              mutation {
                signUp(
                  name: "${this.name}"
                  password: "${encrypted}"
                  phoneNumber: "${this.vaildPhoneNumber}"
                ) {
                  user {
                    authToken
                  }
                }
              }
            `;
          this.loading++;
          this.$apollo
            .mutate({
              mutation: s
            })
            .then(data => {
              Cookies.set("authToken", data.data.signUp.user.authToken, {
                expires:30,
              });
              this.step++;
              this.loading--;
            })
            .catch(error => {
              console.error(error);
              this.loading--;
            });
          this.loading--;
        })
        .catch(error => {
          this.codeError = true;
          console.error(error);
          this.loading--;
        });
    }
  },
  watch: {
    phoneNumber(newNumber) {
      if (newNumber && newNumber.toString().length === 11) {
        this.vaildPhoneNumber = newNumber.toString();
      }
    }
  },
  apollo: {
    checkPhone: {
      query() {
        return gql`{
              checkPhone(phoneNumber:"${this.vaildPhoneNumber}"){
                  status
              }
              }
              `;
      },
      loadingKey: "loading"
    }
  }
};
</script>
<style scoped>
#container{
    background-color:#fff;
}
 @media screen and (max-width: 575px) {
    #container{
        height: 100vh;
        position: relative;
    }
    #action{
        position: absolute;
        bottom: 0;
        right: 0;
    }
    #main{
        position: absolute;
        top: 50vh;
        left: 50vw;
        transform: translate(-50%,-50%);
        width: 100vw;
    }
    
    
}
#name-input {
  max-width: 12em;
  margin: 0 auto;
}
</style>

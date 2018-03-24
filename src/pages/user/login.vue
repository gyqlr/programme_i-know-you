<template>
  <q-card class="full-width" id="container">
          <q-card-title>
            <div class="row">
              <img src="../../statics/img/logo.svg" style="width:3em;height:3em;"/>
              <p class="q-ma-md vertical-middle" style="font-size:1.3em">未命名 - 智能化问卷系统</p>
            </div>
            <q-btn round flat icon="more_vert" slot="right">
              <q-popover :self="$q.platform.is.mobile?'bottom right':'top left'">
                <q-list link class="no-border">
                  <q-item to="/user/signup">
                   <q-item-main label="创建新账号" />
                  </q-item>
                   <q-item>
                   <q-item-main label="忘记密码了?"/>
                  </q-item>
                </q-list>
              </q-popover>
            </q-btn>
          </q-card-title>
          <q-card-main class="q-mt-lg q-pa-lg" id="main">
           <q-field class="animate-pop q-mb-md" :error="error.phoneNumber ? true:false " :error-label="error.phoneNumber">
              <q-input type="number" v-model="phoneNumber" autofocus float-label="手机号" />
           </q-field>
           <q-field :count="13" class="animate-pop" :error="error.password ? true:false " :error-label="error.password">
              <q-input type="password" maxlength="13" v-model="password" float-label="密码" @keyup.enter="isOk?submit():null"/>
           </q-field>
          </q-card-main>
          <q-card-actions align="end" class="q-pa-lg" id="action" >
            <q-btn color="primary" :disable="!isOk" :loading="validPassword.length>0&&loading>0" @click="submit" label="登录"/>
          </q-card-actions>
        </q-card>
</template>
<script>
import gql from "graphql-tag";
import crypto from "crypto";
import { Cookies } from "quasar";
export default {
  data() {
    return {
      phoneNumber: null,
      password: "",
      validPassword: "",
      error: {
        phoneNumber: null,
        password: null
      },
      loading: 0,
      login: null
    };
  },
  computed: {
    isOk() {
      return (
        !this.error.phoneNumber &&
        !this.error.password &&
        this.phoneNumber &&
        this.password.length >= 6
      );
    }
  },
  methods: {
    getHex(password) {
      const cipher = crypto.createCipher("aes192", password);
      let encrypted = cipher.update(this.phoneNumber.toString(), "utf8", "hex");
      encrypted += cipher.final("hex");
      return encrypted;
    },
    submit() {
      this.validPassword = this.getHex(this.password);
    }
  },
  apollo: {
    login: {
      query: gql`
        query($n: String!, $p: String!) {
          login(phoneNumber: $n, password: $p) {
            user {
              authToken
            }
            error
          }
        }
      `,
      variables() {
        return {
          n: this.phoneNumber.toString(),
          p: this.validPassword
        };
      },
      loadingKey: "loading",
      skip() {
        return !this.phoneNumber || this.phoneNumber.toString().length < 11;
      }
    }
  },
  watch: {
    login(newlogin) {
      newlogin.error === "phone_number"
        ? (this.error.phoneNumber = "手机号码未注册")
        : (this.error.phoneNumber = null);
      this.validPassword.length > 0 && newlogin.error === "password"
        ? (this.error.password = "密码不正确")
        : (this.error.password = null);
      if (newlogin.user && newlogin.user.authToken) {
        Cookies.set("authToken", newlogin.user.authToken, { expires: 30 });
        this.$router.push("/");
      }
    },
    password(newValue) {
      this.login = null;
      if (this.error.password) {
        this.validPassword = "";
      }
    },
    // 电话号码删除到小于11位以后清除错误状态
    phoneNumber(newValue) {
      this.error.phoneNumber && newValue.toString().length < 11
        ? (this.error.phoneNumber = null)
        : null;
    }
  }
};
</script>
<style scoped>
#container {
  background-color: #fff;
}
@media screen and (max-width: 575px) {
  #container {
    height: 100vh;
    position: relative;
  }
  #action {
    position: absolute;
    bottom: 0;
    right: 0;
  }
  #main {
    position: absolute;
    top: 50vh;
    left: 50vw;
    transform: translate(-50%, -50%);
    width: 100vw;
  }
}
</style>


<template>
  <q-card class="q-mx-sm" id="container">
          <q-card-title>
            <div class="row">
              <img src="../../statics/img/logo.svg" style="width:3em;height:3em;"/>
              <p class="q-ma-md vertical-middle" style="font-size:1em">未命名 - 登录</p>
            </div>
            <q-btn round flat icon="more_vert" slot="right">
              <q-popover self='top right'>
                <q-list link class="no-border">
                  <q-item to="/user/signup">
                   <q-item-main label="创建新账号" />
                  </q-item>
                   <q-item to="/user/reset">
                   <q-item-main label="忘记密码了?"/>
                  </q-item>
                </q-list>
              </q-popover>
            </q-btn>
          </q-card-title>
          <q-card-main class="q-mt-lg q-pa-lg" id="main">
           <q-field class="animate-pop q-mb-md" :error="phoneNumberError ? true:false " :error-label="phoneNumberError">
              <q-input type="number" v-model="phoneNumber" autofocus float-label="手机号" />
           </q-field>
           <q-field :count="13" class="animate-pop" :error="passwordError? true:false " :error-label="passwordError">
              <q-input type="password" maxlength="13" v-model="password" float-label="密码" @keyup.enter="isOk?submit():null"/>
           </q-field>
          </q-card-main>
          <q-card-actions align="end" class="q-pa-lg" id="action" >
            <q-btn color="primary" class="full-width" :disable="!isOk" :loading="validPassword.length>0&&loading>0" @click="submit" label="登录"/>
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
      passwordError: null,
      phoneNumberError: null,
      loading: 0
    };
  },
  computed: {
    isOk() {
      return (
        !this.passwordError &&
        !this.phoneNumberError &&
        this.phoneNumber &&
        this.password
      );
    }
  },
  methods: {
    submit() {
      this.$apollo.queries.login.skip = false;
    }
  },
  apollo: {
    login: {
      query() {
        return gql`
          {
            login(
              phoneNumber: "${this.phoneNumber}"
              password: "${this.$Msg.getHex(
                this.phoneNumber || "",
                this.password
              )}"
            ) {
              authToken
            }
          }
        `;
      },
      loadingKey: "loading",
      skip() {
        return true;
      },
      manual: true,
      result({ data }) {
        Cookies.set("authToken", data.login.authToken, { expires: 30 });
        this.$router.push("/");
      },
      error() {
        this.passwordError = "密码错误"
      }
    },
    check: {
      query() {
        return gql`{checkPhone(phoneNumber:"${this.phoneNumber}")}`;
      },
      skip() {
        return !this.$Msg.phoneCheck(this.phoneNumber);
      },
      manual: true,
      loadingKey: "loading",
      result({ data }) {
        data.checkPhone ? (this.phoneNumberError = "号码未注册") : null;
      }
    }
  },
  watch: {
    password(newValue) {
      this.$apollo.queries.login.skip = true;
      this.passwordError = null;
    },
    phoneNumber(newValue) {
      this.$apollo.queries.check.skip = true;
      this.$apollo.queries.login.skip = true;
      this.$Msg.phoneCheck(newValue) ? (this.phoneNumberError = null) : null;
    }
  }
};
</script>
<style scoped>
#container {
  background-color: #fff;
}
@media screen and (max-width: 575px) {
  /* #container {
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
  } */
}
</style>


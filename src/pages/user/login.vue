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
      passwordError: null,
      phoneNumberError: null,
      loading: 0
    };
  },
  computed: {
    isOk() {
      return !this.error && this.phoneNumber && this.password
    }
  },
  methods: {
    submit() {
      this.$apollo.queries.login.skip = false;
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
          p: this.$Msg.getHex(this.phoneNumber,this.password)
        };
      },
      loadingKey: "loading",
      skip() {
        return true;
      },
      manual: true,
      result({ data }) {
          console.log(data)
        if (data.login.error === "password") {
          this.passwordError = "密码错误";
        } else if (data.login.error === "phone_number") {
          this.phoneNumberError = "号码未注册";
        } else if (data.login.user.authToken) {
          Cookies.set("authToken", data.login.user.authToken, { expires: 30 });
          this.$router.push("/");
        }
      }
    }
  },
  watch: {
    password(newValue) {
      this.$apollo.queries.login.skip = true;
      this.passwordError = null;
    },
    phoneNumber(newValue) {
      this.$apollo.queries.login.skip = true;
      this.phoneNumberError = null;
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


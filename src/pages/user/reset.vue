<template>
  <q-card class="q-mx-sm" id="container">
          <q-card-title>
            <div class="row">
              <img src="../../statics/img/logo.svg" style="width:3em;height:3em;"/>
              <p class="q-ma-md vertical-middle" style="font-size:1em">重置您的密码</p>
            </div>
            <q-btn round flat icon="more_vert" slot="right">
              <q-popover :self="$q.platform.is.mobile?'bottom right':'top left'">
                <q-list link class="no-border">
                  <q-item to="/user/signup">
                   <q-item-main label="创建新账号" />
                  </q-item>
                   <q-item to="/user/login">
                   <q-item-main label="已有账号登录"/>
                  </q-item>
                </q-list>
              </q-popover>
            </q-btn>
          </q-card-title>
          <q-card-main class="q-mt-lg q-pa-lg" id="main">
           <q-field v-if="step==0" style="max-width:12em;margin:0 auto;" class="animate-pop q-mb-md" :error="error.number?true:false" :error-label="error.number">
              <p class="caption q-mb-xl" style="font-size:1.5em;text-align:center;">输入您的手机号码</p>
              <q-input type="text" v-model="phoneNumber" :loading="loading>0" @keyup.enter="numberOk? submit():null" align="center" autofocus />
           </q-field>
           <div class="row justify-center" v-if="step==1" >
               <q-input :error="this.error.code" type="text" maxlength="6" v-model="code" :disable="loading>0" :loading="loading>0" float-label="输入您收到的验证码" autofocus/>
                <q-btn flat color="primary" :disable="this.time>0" :label="`${ time>0 ? time.toString()+'秒后':''}重发`" @click="send"/>
           </div>
           <q-field v-if="step==2" :count="13" class="animate-pop" :error="error.password ? true:false " :error-label="error.password">
              <q-input :error="!passwordOk" type="password" maxlength="13" v-model="password" float-label="设置您的新密码" autofocus @keyup.enter="passwordOk?submit():null"/>
           </q-field>
          </q-card-main>
          <q-card-actions align="end" class="q-pa-lg" id="action" >
            <q-btn color="primary" v-if="step === 0" :disable="!numberOk" @click="submit" label="下一步"/>
            <q-btn color="primary" v-if="step === 2" :disable="!passwordOk" @click="submit" label="提交" :loading="loading>0"/>
          </q-card-actions>
        </q-card>
</template>
<script>
import gql from "graphql-tag";
import { setInterval, clearInterval } from "timers";
export default {
  data() {
    return {
      phoneNumber: "",
      password: "",
      code: "",
      checkPhone: null,
      error: {
        number: null,
        password: null,
        code: null
      },
      step: 0,
      loading: 0,
      time: 0
    };
  },
  methods: {
    send() {
      this.loading++;
      this.$Msg
        .getCode(this.phoneNumber)
        .then(data => {
          this.time = 30;
          let t = setInterval(() => {
            this.time > 0 ? this.time-- : clearInterval(t);
          }, 1000);
          this.loading--;
        })
        .catch(error => {
          this.error.number = error.toString();
          this.loading--;
        });
    },
    submit() {
      if (this.step === 0) {
        this.send();
        this.step++;
      } else if (this.step === 1) {
        this.loading++;
        this.$Msg
          .checkCode(this.phoneNumber, this.code)
          .then(data => {
            this.error.code = null;
            this.loading--;
            this.step++;
          })
          .catch(error => {
            this.error.code = error.toString();
            this.loading--;
          });
      } else if (this.step === 2) {
        this.loading++;
        let g = gql`
          mutation {
            reset(phoneNumber: "${
              this.phoneNumber
            }", password: "${this.$Msg.getHex(
          this.phoneNumber || "",
          this.password
        )}") {
          name
        }
          }
        `;
        this.$apollo
          .mutate({
            mutation: g
          })
          .then(data => {
            this.loading--;
            this.$q.notify({
              message: "修改成功",
              color: "primary",
              timeout: 1500,
              icon: "done"
            });
            this.$router.push("/user/login");
          })
          .catch(error => {
            this.loading--;
            this.error.password = error.toString();
          });
      }
    }
  },
  computed: {
    numberOk() {
      return !this.error.number && this.$Msg.phoneCheck(this.phoneNumber);
    },
    passwordOk() {
      return (
        !this.error.password &&
        this.password &&
        this.password.length >= 6 &&
        this.password.length <= 13
      );
    }
  },
  watch: {
    phoneNumber(newValue, oldValue) {
      if (!newValue) {
        this.error.number = null;
      } else if (this.$Msg.phoneCheck(newValue)) {
        this.error.number = null;
        this.$apollo.queries.checkPhone.skip = false;
      } else {
        this.$apollo.queries.checkPhone.skip = true;
        this.error.number = "手机号码不合法";
      }
    },
    code(newValue) {
      if (newValue.length === 6) {
        this.submit();
      }
    },
    password() {
      this.error.password = null;
    }
  },
  apollo: {
    checkPhone: {
      query: gql`
        query($n: String!) {
          checkPhone(phoneNumber: $n)
        }
      `,
      variables() {
        return { n: this.phoneNumber };
      },
      loadingKey: "loading",
      skip() {
        return true;
      },
      manual: true,
      result({ data }) {
        if (data.checkPhone) {
          this.error.number = "未注册";
        }
      }
    }
  }
};
</script>
<style scoped>
#container {
  background-color: #fff;
}
</style>

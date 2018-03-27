<template>
  <q-layout view="lHh Lpr lFf">
    <q-layout-header>
     <q-toolbar>
        <q-btn flat round dense icon="menu">
          <q-popover self="top right" v-if="user">
                <q-list class="q-mr-md">
                  <q-list-header>@{{user.authToken}}</q-list-header>
                  <q-item>
                   您好, <strong>{{user.name}}</strong>
                  </q-item>
                   <q-item class="row justify-end">
                   <q-btn  flat color="secondary" label="登出" @click="logout"/>
                  </q-item>
                </q-list>
              </q-popover>
        </q-btn>
        <q-toolbar-title>
         {{title}}
        </q-toolbar-title>
      </q-toolbar>
      <q-tabs color="primary">
        <q-route-tab
          icon="person pin"
          to="/"
          slot="title"
          style="border-color:#555"
        ></q-route-tab>
        <q-route-tab
          icon="person pin"
          to="/"
          exact
          slot="title"
        ></q-route-tab>
        <q-route-tab
          icon="person pin"
          to="/"
          exact
          slot="title"
        ></q-route-tab>
        <q-route-tab
          icon="equalizer"
          to="/analyse"
          exact
          slot="title"
        ></q-route-tab>
      </q-tabs>
    </q-layout-header>

    <q-page-container>
      <router-view v-if="loading==0" :user="user"/>
    </q-page-container>
  </q-layout>
</template>

<script>
import { openURL, Cookies } from "quasar";
import gql from "graphql-tag";

export default {
  name: "LayoutDefault",
  data() {
    return {
      user: { name: null, authToken: null },
      loading: 0
    };
  },
  computed: {
    title() {
      let re = { "/": "我的问卷", "/analyse": "结果分析" };
      return re[this.$route.path];
    },
    authToken() {
      return Cookies.get("authToken");
    }
  },
  methods: {
    openURL,
    logout() {
      Cookies.remove("authToken");
      this.$router.push("/user");
    }
  },
  beforeCreate() {
    if (!Cookies.has("authToken")) {
      this.$router.push("/user/login");
    }
  },
  apollo: {
    login: {
      query() {
        return gql`
          {
            login(authToken: "${this.authToken}") {
                name
                authToken
            }
          }
        `;
      },
      manual: true,
      skip() {
        return this.authToken ? false : true;
      },
      result({ data }) {
        console.log(data);
        this.user.name = data.login.name;
        this.user.authToken = data.login.authToken;
        this.$router.push("/home");
      }
    }
  }
};
</script>

<style>

</style>

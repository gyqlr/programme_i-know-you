<template>
  <q-layout view="lHh Lpr lFf">
    <q-layout-header>
      <q-tabs>
        <q-route-tab
          icon="person pin"
          to="/"
          exact
          slot="title"
        ></q-route-tab>
        <q-route-tab
          icon="library add"
          to="/add"
          exact
          slot="title"
        ></q-route-tab>
      </q-tabs>
    </q-layout-header>

    <q-page-container>
      <router-view/>
    </q-page-container>
  </q-layout>
</template>

<script>
  import {openURL} from 'quasar'

  export default {
    name: 'LayoutDefault',
    data() {
      return {
        leftDrawerOpen: this.$q.platform.desktop,
      }
    },
    methods: {
      openURL,
    },
  }
</script>

<style>
</style>

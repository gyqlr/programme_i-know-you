<template>
    <q-dialog v-model="visable">
        <div slot="title">您问卷的链接</div>
        <div slot="message">
            <q-input ref="acc" :value="realURL" readonly autofocus @focus="onfocus" />
        </div>
    </q-dialog>
</template>

<script>
export default {
  name: "share-dialog",
  props: ["value", "id"],
  computed: {
    visable: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      }
    },
    realURL() {
      return location.protocol + "//" + location.host + "/buptQuestionnaire/#/submit/" + this.id;
    }
  },
  methods: {
    onfocus() {
      this.$refs.acc.select();
    }
  }
};
</script>

<style scoped>

</style>
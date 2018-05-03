<template>
    <q-dialog v-model="visable">
        <div slot="title">您问卷的二维码</div>
        <div slot="body">
            <qr-code :text="realURL"></qr-code>
        </div>
    </q-dialog>
</template>

<script>
import VueQRCodeComponent from "vue-qrcode-component";
export default {
  name: "share-vrcode",
  props: ["value", "id"],
  components: { "qr-code": VueQRCodeComponent },
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
      return location.protocol + "//" + location.host + "/#/submit/" + this.id;
    }
  }
};
</script>

<style>
.modal-scroll {
  max-height: none;
}
</style>
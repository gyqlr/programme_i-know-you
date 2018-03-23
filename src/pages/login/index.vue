<template>
  <div class="row justify-center window-height container">
    <div class="col-lg-4 col-md-6 col-sm-12 self-center">
        <sign-up/>
    </div>
  </div>
</template>
<script>
import SignUp from "./signUp";
export default {
  data() {
    return {
      name: null,
      password: null,
      phone_number: null,
      step: 0
    };
  },
  components: { SignUp }
};
</script>
<style scoped>

.container {
  background-image: url("../../statics/img/background.svg");
  background-size: cover;
}
</style>

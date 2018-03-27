<template>
  <div class="row justify-center window-height container">
    <div class="full-width self-center">
        <router-view/>
    </div>
  </div>
</template>
<script>
import {Cookies , AppFullscreen} from 'quasar'
export default {
  data() {
    return {
      
    };
  },
  mounted(){
    if(Cookies.has('authToken')){
      this.$router.push('/')
    }
    else if(this.$route.path==='/user'){
      this.$router.push('/user/login')
    }
  }
};
</script>
<style scoped>
.container {
  background-image: url("../../statics/img/background.svg");
  background-size: cover;
}
</style>


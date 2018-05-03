// 滑动删除块
<template>
  <div class="relative-position" style="z-index:0">
      <div style="z-index:2" v-touch-pan.horizontal="handeler" :style="`transition-duration: ${touch?0:0.5}s;transform: translateX(${mX}px);`"><slot/></div>
      <div class="back"><slot name="menu"/></div>
  </div>
</template>
<script>
export default {
  name: "swipe",
  props: ["distance"],
  data() {
    return {
      mX: 0,
      touch: false,
      editing: false
    };
  },
  computed: {
    mDis() {
      return this.distance ? this.distance : 30;
    }
  },
  methods: {
    handeler({ distance, direction, isFirst, isFinal }) {
      if (direction === "right") {
        if (isFirst) {
          this.touch = true;
        } else if (isFinal) {
          if ((this.mX = distance.x >= this.mDis)) {
            this.mX = this.mDis;
            this.editing = true;
          } else {
            this.mX = 0;
          }
          this.touch = false;
        } else {
          this.mX = distance.x;
        }
      } else if (this.editing) {
        if (isFirst) {
          this.touch = true;
        } else if (isFinal) {
          if (this.mX = -distance.x <= -this.mDis) {
            this.mX = 0;
            this.editing = false;
          } else {
            this.mX = this.mDis;
          }
          this.touch = false;
        } else {
          this.mX = -distance.x+this.mDis;
        }
      }
    }
  }
};
</script>
<style scoped>
.back{
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: -1;
}
</style>

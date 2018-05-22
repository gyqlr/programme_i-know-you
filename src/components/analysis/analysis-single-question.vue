<template>
    <div class="container">
        <span>{{question.title}}</span>
        <div v-if="error" style="color:#bcbcbc">
            暂无分析数据
        </div>
        <div v-else>
            <div  v-if="question.type==='单项选择题'||question.type==='多项选择题'">
                <div class="q-my-md" v-for="(v,k) in result" :key="k">
                    <div class="row justify-between q-mb-sm">
                        <span>{{k}}</span>
                        <span style="width=2em">{{v.toFixed(4)*100}}%</span>
                    </div>
                    <q-progress style="width=calc(100% - 2em)" :percentage="v*100" stripe animate :buffer="(1-v)*100" />
                </div>
            </div>
            <div v-else>
                
            </div>
        </div>
    </div>
</template>
<style lang="stylus" scoped>
.container {
    span {
        color: #555;
        font-weight: 500;
        font-size: 1.2em;
    }
}

.result {
    div[0] {
        display: flex;
        flex-direction: row;
    }
}
</style>
<script>
import axios from "axios";
export default {
  name: "analysis-single-question",
  props: ["question"],
  data() {
    return {
      loading: 0,
      result: {},
      error: false
    };
  },
  methods: {
    getResult() {
      this.loading++;
      axios
        .get(`http://localhost:8081/api/${this.question.id}`)
        .then(val => {
          this.result = val.data;
          this.loading--;
        })
        .catch(error => {
          {
            this.error = true;
            this.loading--;
          }
        });
    }
  },
  beforeMount() {
    this.getResult();
  }
};
</script>

<template>
    <div class="container">
        <span>{{question.title}}</span>
        <div v-if="error" style="color:#bcbcbc" class="q-my-md">
            暂无分析数据
        </div>
        <div v-else>
            <div v-if="question.type==='单项选择题'||question.type==='多项选择题'">
                <div class="q-my-md" v-for="(v,k) in result" :key="k">
                    <div class="row justify-between q-mb-sm">
                        <span>{{k}}</span>
                        <span style="width=2em">{{(v*100).toFixed(2)}}%</span>
                    </div>
                    <q-progress :percentage="v*100" stripe animate :buffer="(1-v)*100" color="info" />
                </div>
            </div>
            <div v-else class="colunm">
                <analysis-single-sentiment :question="question"></analysis-single-sentiment>
                <analysis-single-keywords :question="question"></analysis-single-keywords>
                <analysis-single-comments :question="question"></analysis-single-comments>
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
import analysisSingleSentiment from '../analysis/analysis-single-sentiment'
import analysisSingleKeywords from '../analysis/analysis-single-keywords'
import analysisSingleComments from '../analysis/analysis-single-comments'
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
      if (this.question.type !== '填空题'){
      axios
        .get(`http://111.231.68.175:8081/api/${this.question.id}`)
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
    }
  },
  components:{analysisSingleSentiment,analysisSingleKeywords,analysisSingleComments},
  beforeMount() {
    this.getResult();
  }
};
</script>

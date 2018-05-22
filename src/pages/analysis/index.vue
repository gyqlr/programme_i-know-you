<template>
  <div>
    <q-spinner v-if="!surveys" color="secondary" size="2em" style="width:100%;margin-top:1em" />
    <q-list v-else no-border separator sparse>
      <q-list-header>
        选择您要分析的问卷
      </q-list-header>
      <q-item v-for="item in surveys" :key="item.id">
        <div v-ripple  @click="itemClick(item.id)" style="width:100%" class="row">
          <q-item-main :label="item.title" :lable-lines="2" :sublabel="item.description" :sublabel-lines="2" />
          <q-item-side :stamp="$Msg.getTime(item.createDatetime)" right>
            <apollo-query :query="getGql(item.id)">
              <template slot-scope="{ result: { loading, error, data } }">
                <!-- Loading -->
                <div v-if="loading">加载中...</div>

                <!-- Error -->
                <div v-else-if="error">获取失败</div>

                <!-- Result -->
                <div v-else-if="data">收到回答数:
                  <strong style="color:#51b882">{{data.answerNum}}</strong>
                </div>

                <!-- No result -->
                <div v-else>获取失败</div>
              </template>
            </apollo-query>
          </q-item-side>
        </div>
      </q-item>

    </q-list>
    <analysis-single-survey v-if="curId"  :surveyId="curId" v-model="modalShow"></analysis-single-survey>
  </div>
</template>
<script>
import gql from "graphql-tag";
import AnalysisSingleSurvey from "../../components/analysis/analysis-single-survey";
export default {
  data() {
    return {
      loading: 0,
      curId: "",
      modalShow: false,
      surveys: []
    };
  },
  components: { AnalysisSingleSurvey },
  methods: {
    getGql(surveyId) {
      let g = gql`
        {
          answerNum(surveyId: "${surveyId}")
        }
      `;
      return g;
    },
    itemClick(surveyId) {
      this.curId = surveyId;
      this.modalShow = true;
    }
  },
  props: ["user"],
  apollo: {
    surveys: {
      query() {
        return gql`
          {
            surveys(authToken: "${this.user.authToken}") {
              id
              title
              description
              createDatetime
            }
          }
        `;
      }
    },
    loadingKey: "loading"
  }
};
</script>
<style lang="stylus" scoped>
</style>

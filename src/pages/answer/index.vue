<template>
<div>
  <q-toolbar>
      <q-toolbar-title>
          问卷填写
      </q-toolbar-title>
  </q-toolbar>
  <div  v-if="survey&&question" class="colunm q-ma-lg">
      <span class="q-title">{{curSurvey.title}} <span class="q-subheading" style="font-size:0.8em;color:#bcbcbc">{{curSurvey.subTitle}}</span></span>
      <br/>
      <br/>
      <span class="q-mt-lg">{{curSurvey.information}}</span>
      <hr/>
      <div v-if="question.edges&&!question.edges.length">一个问题都没有哇</div>
      <translate v-for="item in question.edges" :key="item.oid" :question="item" />
  </div>
</div>
</template>
<script>
import Translate from "../../components/translate";
import gql from "graphql-tag";
export default {
  computed: {
    curOid() {
      return this.$route.params.oid;
    },
    resultList() {
      let tmp = [];
    },
    curSurvey(){
        return this.survey ? this.survey.edges[0].node : null
    }
  },
  mounted() {},
  data() {
    return { question: null, survey: null };
  },
  components: { Translate },
  apollo: {
    question: {
      query() {
        return gql`{
            question(surveyOid: "${this.curOid}") {
              edges {
                node {
                  oid
                  title
                  type
                  optionList
                  required
                }
              }
            }
          }`;
      }
    },
    survey: {
      query() {
        return gql`
          {
            survey(oid: "${this.curOid}") {
              edges {
                node {
                  oid
                  title
                  subTitle
                  information
                  startDate
                  endDate
                }
              }
            }
          }
        `;
      }
    }
  }
};
</script>
<style>

</style>

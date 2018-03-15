<template>
<div>
  <q-toolbar>
      <q-toolbar-title>
          问卷填写
      </q-toolbar-title>
  </q-toolbar>
  <div  v-if="survey&&question" class="colunm q-ma-lg relative-position">
      <span class="q-title">{{curSurvey.title}} <span v-if="curSurvey.subTitle!='null'" class="q-subheading" style="font-size:0.8em;color:#bcbcbc">{{curSurvey.subTitle}}</span></span>
      <br/>
      <br/>
      <span class="q-mt-lg">{{curSurvey.information}}</span>
      <hr/>
      <div v-if="question.edges&&!question.edges.length">一个问题都没有哇</div>
      <translate v-for="item in question.edges" :key="item.oid" :question="item" />
      <q-inner-loading :visible="loading>0">
          <q-spinner-gears size="50px" color="primary"/>
        </q-inner-loading>
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
    curSurvey() {
      return this.survey ? this.survey.edges[0].node : null;
    }
  },
  mounted() {},
  data() {
    return { question: null, survey: null, loading: 0 };
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
      },
      loadingKey: "loading"
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
      },
      loadingKey: "loading"
    }
  }
};
</script>
<style>

</style>

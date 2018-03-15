<template>
  <div v-if="curSurvey">
    <q-modal v-model="opened" position="top">
   <add-question :survey-oid="oid" @refetch="refetch"/>
    </q-modal>
      <span class="q-title">{{curSurvey.title}} <span class="q-subheading" style="font-size:0.8em;color:#bcbcbc">{{curSurvey.subTitle}}</span></span>
      <br/>
      <br/>
      <span class="q-mt-lg">{{curSurvey.information}}</span>
      <hr/>
      <div v-if="question.edges&&!question.edges.length">一个问题都没有哇</div>
      <translate 
      v-for="item in question.edges" 
      :key="item.node.oid"  
      :surveyOid="oid" 
      :question="item"
      @del="del(item.node.oid)"
      is-del="true"
      />
      <q-btn icon="add" color="primary" round @click="opened=true" class="fixed-bottom-right q-ma-md"/>
  </div>
</template>
<script>
import Translate from "../components/translate.vue";
import gql from "graphql-tag";
import AddQuestion from "../components/addQuestion.vue";
export default {
  name: "questionList",
  data() {
    return {
      question: [],
      survey: null,
      opened: false
    };
  },
  props: ["oid"],
  components: { Translate, AddQuestion },
  computed: {
    curSurvey() {
      return this.survey ? this.survey.edges[0].node : null;
    }
  },
  methods: {
    refetch(){
      this.$apollo.queries.question.refetch()
       this.$q.notify({
            message: "创建成功",
            color: "primary",
            timeout: 3000,
          });
    },
    del(oid) {
      this.$apollo
        .mutate({
          mutation: gql`
            mutation($oid: ID!) {
              deleteQuestion(oid: $oid) {
                status
              }
            }
          `,
          variables: {
            oid: oid
          }
        })
        .then(res => {
          this.$apollo.queries.question.refetch()
          this.$q.notify({
                message: "删除成功",
                color: "primary",
                timeout: 1500,
                icon: "bubble chart"
              })
        }).catch(error=>{
          this.$q.notify(error)
        });
    }
  },
  apollo: {
    question: {
      query() {
        return gql`{
            question(surveyOid: "${this.oid}") {
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
            survey(oid: "${this.oid}") {
              edges {
                node {
                  id
                  oid
                  title
                  subTitle
                  startDate
                  endDate
                  information
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
<style scoped>

</style>

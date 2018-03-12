<template>
<div class="q-mx-md">
    <q-toolbar shrink inverted >
    <q-toolbar-title>新增</q-toolbar-title>
        <q-btn flat round icon="save" @click="submit" color="info" >保存</q-btn>
   </q-toolbar>
  <q-input v-model="questionInput.title" float-label="标题" class="q-my-lg" :loading="loading>0"/>
  <q-toggle v-model="questionInput.required" label="是否必填"/>
  <q-select
      v-model="questionInput.type"
      class="q-my-lg"
      float-label="题目类型"
      radio
     :options="[
         {label:'单项选择题',value:'单项选择题'},
         {label:'多项选择题',value:'多项选择题'},
         {label:'填空题',value:'填空题'},
     ]"
    />
  <q-chips-input class="q-my-lg" float-label="选项" v-model="questionInput.optionList" v-if="questionInput.type!='填空题'"/>
</div>
</template>

<script>
import gql from "graphql-tag";
export default {
  name: "addQuestion",
  data() {
    return {
      questionInput: {
        title: null,
        type: '单项选择题',
        required: true,
        optionList: []
      },
      loading: 0
    };
  },
  props:['surveyOid'],
  computed: {
    submitSql() {
      return gql`
        mutation {
          createQuestion(
            questionInput: {
              title: "${this.questionInput.title}"
              type: "${this.questionInput.type}"
              required: ${this.questionInput.required}
              optionList: "${this.questionInput.optionList.join('|')}"
              surveyOid: "${this.surveyOid}"
            }
          ) {
            question {
              oid
            }
          }
        }
      `;
    }
  },
  methods: {
    submit() {
        console.log(this.submitSql)
      this.loading++
      this.$apollo
        .mutate({
          mutation: this.submitSql,
        })
        .then((res) => {
          this.$emit('refetch')
          this.loading--
        }).catch((error) => {
          this.$q.notify(error)
          this.loading--
        });
    }
  }
};
</script>

<style scoped>

</style>

<template>
<div class="q-ma-md q-mt-xl">
  <q-input v-model="surveyInput.title" float-label="标题" class="q-my-lg"/>
  <q-input v-model="surveyInput.subTitle" float-label="副标题(非必填)" class="q-my-lg"/>
  <q-input v-model="surveyInput.information" float-label="介绍" class="q-my-lg"/>
  <q-datetime v-model="surveyInput.startDate" type="date" float-label="开始时间" class="q-my-lg" format-model='number'/>
  <q-datetime v-model="surveyInput.endDate" type="date" float-label="结束时间(非必填)" class="q-my-lg" format-model='number'/>
  <div class="row justify-end">
    <q-btn label="提交" color="primary" @click="submit" :loading="loading>0"/>
  </div>
</div>
</template>

<script>
import gql from "graphql-tag";
import { date } from "quasar";
export default {
  name: "addSurvey",
  data() {
    return {
      surveyInput: {
        title: null,
        subTitle: null,
        information: null,
        startDate: null,
        endDate: null
      },
      loading: 0
    };
  },
  computed: {
    submitSql() {
      return gql`
        mutation {
          createSurvey(
            surveyInput: {
              userId: "wsq"
              title: "${this.surveyInput.title}"
              subTitle: "${this.surveyInput.subTitle}"
              startDate: "${date.formatDate(
                this.surveyInput.startDate,
                "YYYY-MM-DD"
              )}"
              endDate: "${date.formatDate(
                this.surveyInput.endDate,
                "YYYY-MM-DD"
              )}"
              information: "${this.surveyInput.information}"
            }
          ) {
            survey {
              oid
            }
          }
        }
      `;
    },
    test() {
      return date.formatDate(this.surveyInput.startDate, "YYYY-MM-DD");
    }
  },
  methods: {
    submit() {
      this.loading++
      this.$apollo
        .mutate({
          mutation: this.submitSql,
        })
        .then((res) => {
          this.$emit('save')
          this.$q.notify({
            message: "创建成功",
            color: "primary",
            timeout: 3000,
          });
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

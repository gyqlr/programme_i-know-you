<template>
  <div class="q-mx-md q-mt-xl animate-fade">
        <q-field :count="20">
            <q-input clearable maxlength="20" float-label="问卷的标题" :disable="loading>0" v-model="title" color="secondary" />
        </q-field>
        <q-field :count="50">
            <q-input  clearable maxlength="50" :disable="loading>0" v-model="description" placeholder="添加问卷的描述吧" color="secondary"/>
        </q-field>
        <div class="row justify-end">
        <q-btn round :flat="!isok" :disable="!isok" :loading="loading>0" icon="done"  class="q-mt-md" @click="submit" color="primary"/>
        </div>
  </div>
</template>
<script>
import gql from 'graphql-tag'
export default {
  data() {
    return {
      title: "",
      description: "",
      loading: 0,
    };
  },
  props: ["user"],
  computed: {
    isok() {
      return this.title.length > 0 && this.description.length > 0;
    }
  },
  methods: {
    submit() {
      let g = gql`
        mutation {
          createSurvey(
            surveyInput: { title: "${this.title}", description: "${
        this.description
      }", authToken: "${this.user.authToken}" }
          ) {
            id
          }
        }
      `;
      this.loading++;
      this.$apollo
        .mutate({
          mutation: g
        })
        .then(data => {
          this.loading--;
          this.$router.push(`/edit/${data.data.createSurvey.id}`)
        })
        .catch(error => {
          this.loading--;
        });
    }
  },
}
</script>
<style scoped>

</style>

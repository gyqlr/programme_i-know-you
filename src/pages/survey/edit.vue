<template>
  <div class="q-mx-md q-mt-md colunm animate-fade">
      <span style="color:#bcbcbc" class="animate-fade"><strong style="font-size:1.3em;color:#555">问卷信息</strong></span> 
      <div class="row no-wrap justify-between animate-fade q-mt-md" v-if="survey&&!editing">
          <div class="colunm">
            <p style="font-size:1.2em">{{survey.title}}</p>
            <p class="caption" style="color:#555">{{survey.description}}</p>
          </div>
          <div class="column items-end">
            <q-btn round flat :color="survey.release?'info':'grey'" icon="edit" @click="editing=true" :loading="loading>0"/>
          </div>
      </div>
      <div v-if="editing" class="animate-pop">
        <q-field :count="20">
            <q-input clearable maxlength="20" float-label="问卷的标题" v-model="title" color="secondary" @keyup.enter="isok&&submit()" />
        </q-field>
        <q-field :count="50">
            <q-input  clearable maxlength="50" v-model="description" placeholder="添加问卷的描述吧" color="secondary"/>
        </q-field>
        <div class="row justify-between items-center">
        <q-toggle color="info" v-model="release" label="发布" />
        <div class="row">
            <q-btn round flat color="secondary" icon="clear" @click="editing=false"/>            
            <q-btn round flat v-if="isok" icon="done" @click="submit" color="primary"/>
        </div>
      </div>
      </div>
      <question-list :survey-id="this.id" num/>
  </div>
</template>

<script>
import gql from "graphql-tag";
import QuestionList from "./questionList";
export default {
  data() {
    return {
      survey: null,
      editing: false,
      title: "",
      description: "",
      release: false,
      loading: 0
    };
  },
  components: { QuestionList },
  watch: {
    editing(newValue) {
      if (newValue && this.survey) {
        this.title = this.survey.title;
        this.description = this.survey.description;
        this.release = this.survey.release;
      }
    }
  },
  props: ["user"],
  computed: {
    id() {
      return this.$route.params.id;
    },
    isok() {
      return this.title.length > 0 && this.description.length > 0;
    }
  },
  methods: {
    submit() {
      this.editing = false;
      let g = gql`
        mutation {
          updateSurvey(
            id: "${this.id}"
            surveyInput: {title: "${this.title}", description: "${
        this.description
      }", release: ${this.release} authToken:"${this.user.authToken}"}
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
          this.$apollo.queries.survey.refetch();
        })
        .catch(error => {
          console.error(error);
          this.loading--;
        });
    }
  },
  apollo: {
    survey: {
      query() {
        return gql`
          {
            survey(id: "${this.id}") {
              title
              description
              release
            }
          }
        `;
      },
      skip() {
        return !this.id;
      }
    }
  }
};
</script>


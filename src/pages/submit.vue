<template>
  <q-layout view="lHh Lpr lFf">
    <q-layout-header class="shadow-1" reveal>
      <q-toolbar>
        <q-toolbar-title style="color:#fff">
          问卷填写
        </q-toolbar-title>
      </q-toolbar>
    </q-layout-header>
    <q-page-container>
      <div class="no-release" v-if="survey && !survey.release">
        <img src="../assets/sad.svg">
        <span>问卷未发布哦</span>
      </div>
      <div v-else>
        <div class="survey-info">
          <h1>{{survey.title}}</h1>
          <span>{{survey.description}}</span>
          <div>
            <span>来自:
              <a target="__blank" href="#">{{survey.creator.name}}</a>
            </span>
            <span>创建时间: {{realTime(survey.createDatetime)}}</span>
          </div>
          <hr>
        </div>
        <question-list v-if="questions" :list="questions"></question-list>
      </div>
    </q-page-container>
  </q-layout>
</template>
<style lang="stylus" scoped>
@import '../css/themes/common.variables';

.no-release {
  height: calc(100vh - 4em);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  img {
    width: 6em;
    height: 6em;
  }

  span {
    font-size: 1.5em;
    font-weight: 500;
    color: #bcbcbc;
  }
}

.survey-info {
  padding: 1em;

  h1 {
    font-size: 1.3em;
    font-weight: 500;
  }

  span {
    color: #555;
    line-height: 2em;
  }

  div {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    width: 100%;

    span {
      a {
        text-decoration-line: none;
        color: #51b882;
        font-weight: 500;
        line-height: 2em;

        &:visited {
          color: #51b882;
        }
      }

      color: #bcbcbc;
    }
  }
}
</style>
<script>
import questionList from "../components/submit/question-list";
import gql from "graphql-tag";
export default {
  data() {
    return {
      survey: null,
      questions: null,
      loading: 0
    };
  },
  components: { questionList },
  watch: {
    loading(val) {
      val === 0 ? this.$q.loading.hide() : this.$q.loading.show();
    }
  },
  computed: {
    id() {
      return this.$route.params.id;
    }
  },
  methods: {
    realTime(timestamp) {
      let date = new Date(timestamp * 1000);
      return date.toLocaleDateString() + " " + date.toLocaleTimeString();
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
              createDatetime
              release
              creator {
                name
              }
            }
          }
        `;
      },
      loadingKey: "loading",
      skip() {
        return !this.id;
      },
      error() {
        this.$router.push("/404");
      }
    },
    questions: {
      query() {
        return gql`
          {
            questions(surveyId: "${this.id}") {
              id
              title
              type
              option
              required
            }
          }
        `;
      },
      loadingKey: "loading",
      skip() {
        return !this.id;
      }
    }
  }
};
</script>

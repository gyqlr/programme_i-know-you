<template>
  <div>
    <q-modal maximized v-model="show" no-backdrop-dismiss position="right" :content-css="{minWidth: '100vw', minHeight: '100vh'}">
      <q-modal-layout>
        <q-toolbar slot="header">
          <q-btn flat round dense icon="keyboard_arrow_left" @click="show=false" />
          <q-toolbar-title>
            问题分析
          </q-toolbar-title>
        </q-toolbar>
        <div class="q-pa-md">
          <apollo-query :query="curGql">
            <template slot-scope="{ result: { loading, error, data } }">
              <!-- Loading -->
              <div v-if="loading">数据获取中...</div>

              <!-- Error -->
              <div v-else-if="error">数据请求失败</div>

              <!-- Result -->
              <div v-else-if="data">
                <q-list separator no-border>
                  <q-list-header>分析结果</q-list-header>
                  <q-item v-for="item in data.questions" :key="item.id">
                    <q-item-main>
                      <analysis-single-question :question="item" />
                    </q-item-main>
                  </q-item>
                </q-list>
              </div>

              <!-- No result -->
              <div v-else class="no-result apollo">暂无结果</div>
            </template>
          </apollo-query>
        </div>
      </q-modal-layout>
    </q-modal>
  </div>
</template>

<script>
import gql from "graphql-tag";
import AnalysisSingleQuestion from "./analysis-single-question";
export default {
  data() {
    return {
      questions: []
    };
  },
  components: { AnalysisSingleQuestion },
  props: ["surveyId", "value"],
  computed: {
    show: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
        return val;
      }
    },
    curGql() {
      return gql`
        {
          questions(surveyId: "${this.surveyId}") {
            id
            title
            type
          }
        }
      `;
    }
  }
};
</script>

<style scoped>

</style>
<template>
  <div class="relative-position">
      <div class="colunm">
          <h3 style="text-align:center">此问题的综合评价</h3>
        <div class="row justify-center" v-if="questionAnalyseItem">
            <q-knob
        :value="questionAnalyseItem.rating"
        readonly
            :min="0"
            :max="5"
        style="font-size: 3em"
        color="primary"
            />
        </div>
        <q-list no-border separator class="q-ma-md" v-if="questionAnalyseItem" >
            <q-list-header style="font-size:1.3em">详情</q-list-header>
            <q-item v-for="item in questionAnalyseItem.answer" :key="item.content">
              <q-item-main :label="item.content" label-lines="1" style="font-size:.8em"/>
              <q-item-side right>
                <q-rating :value="item.rating" :max="5" />
              </q-item-side>
            </q-item>
          </q-list>
      </div>
      <q-inner-loading :visible="loading>0">
          <q-spinner-gears size="3em" color="primary"></q-spinner-gears>
      </q-inner-loading>
  </div>
</template>

<script>
import gql from "graphql-tag";
export default {
  name: "answerAnalyse",
  props: ["oid"],
  data() {
    return {
      questionAnalyseItem: null,
      loading:0
    };
  },
  apollo: {
    questionAnalyseItem: {
      query() {
        return gql`
          {
            questionAnalyseItem(oid: "${this.oid}") {
                rating
              answer {
                content
                rating
              }
            }
          }
        `;
      },
      loadingKey:'loading'
    }
  }
};
</script>

<style scoped>

</style>

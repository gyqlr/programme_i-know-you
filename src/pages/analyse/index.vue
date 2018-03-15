<template>
  <div>
    <q-modal v-model="opened" v-if="curOid">
      <q-toolbar color="white">
      <q-btn color="primary" flat round dense icon="clear" @click="opened = false" />
      <q-toolbar-title style="color:#51b882">
        预览
      </q-toolbar-title>
      </q-toolbar>
      <answer-analyse :oid="curOid"/>
    </q-modal>
    <div class="column">
      <transition
      appear
      enter-active-class="animated fadeInDown" 
      >
      <div class="row justify-center q-mt-xl">
        <img src="../../../src/assets/logo.png" style="width:8em;height:8em;border:3px solid #bcbcbc;border-radius:50%">
      </div>
      </transition>
      <transition
      appear
      enter-active-class="animated fadeInUp"
      >
      <div class="row q-mx-md q-ml-lg justify-center">
        <h3>你好, buptQuestionnaire</h3>
      </div>
      </transition>
      <div class="q-mx-md relative-position">
        <div>
          <transition-group
              appear
              enter-active-class="animated fadeInUp"
              >
          <q-list no-border separator key="list">
            <q-item v-for="item in questionAnalyseItems" :key="item.oid">
              <q-item-main :label="item.title" label-lines="1" style="font-size:.8em"/>
              <q-item-side right>
                <q-rating :value="item.rating" :max="5" />
                <q-btn flat @click="show(item.oid)" ><b style="color:#51b882">{{item.count}} </b>份回答</q-btn>
              </q-item-side>
            </q-item>
          </q-list>
          </transition-group>
        </div>
      <q-inner-loading :visible="loading>0">
          <q-spinner-gears size="3em" color="primary"></q-spinner-gears>
      </q-inner-loading>
    </div>
    </div>
  </div>
</template>
<script>
import gql from "graphql-tag";
import AnswerAnalyse from "../../components/answerAnalyse";
export default {
  data() {
    return {
      loading: 0,
      questionAnalyseItems: [],
      opened: false,
      curOid: null
    };
  },
  methods: {
    show(oid) {
      this.curOid = oid;
      this.opened = true;
    }
  },
  components: { AnswerAnalyse },
  apollo: {
    questionAnalyseItems: {
      query() {
        return gql`
          {
            questionAnalyseItems {
              oid
              title
              count
              rating
            }
          }
        `;
      },
      loadingKey: "loading"
    }
  }
};
</script>
<style scoped>

</style>


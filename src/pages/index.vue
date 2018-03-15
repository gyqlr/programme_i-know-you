<template>
  <q-page class="column" v-if="survey">
    <q-modal v-model="opened" v-if="curOid">
      <q-toolbar color="primary">
  <!--
    For Toolbar title, we use
    QToolbarTitle component
  -->
  <q-btn flat round dense icon="clear" @click="opened = false" />
  <q-toolbar-title>
    预览
  </q-toolbar-title>

  <!--
    In a Toolbar, buttons are best
    configured as "flat, round, dense" and with an icon,
    but any button will do
  -->
      </q-toolbar>
    <question-list :oid="curOid" class="q-pa-lg"/>
    </q-modal>
    <q-modal v-model="addOpened" position="top">
      <add-survey @save="refetch"/>
    </q-modal>
    <q-btn icon="add" color="primary" round @click="addOpened=true" class="fixed-bottom-right q-ma-md"/>
    <q-card class="q-ma-md" v-for="item in survey.edges" :key="item.id" square>
      <q-card-title>
        {{item.node.title}}
        <span slot="subtitle">{{item.node.dateTime}}</span>
      </q-card-title>
      <q-card-actions align="around">
          <q-btn flat round color="info" icon="visibility" @click="curOid=item.node.oid;opened=true"/>
          <q-btn flat round color="primary" icon="share">
            <q-popover class="full-width q-pa-xl" style="background-color:rgba(0,0,0,0.2);">
              <div class="row justify-center">
              <qr-code :text="resultUrl(item.node.oid)"/>
              </div>
            </q-popover>
          </q-btn>
          <q-btn flat round color="red" icon="delete" @click="del(item.node.oid)"/>
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<style>

</style>

<script>
import gql from "graphql-tag";
import Loading from "quasar";
import questionList from "../components/questionList.vue";
import addSurvey from "../components/addSurvey";
import VueQRCodeComponent from 'vue-qrcode-component'
export default {
  name: "PageIndex",
  data() {
    return {
      survey: null,
      curOid: null,
      opened: false,
      addOpened: false
    };
  },
  computed: {
    
  },
  components: { questionList, addSurvey,'qr-code':VueQRCodeComponent},
  methods: {
    refetch() {
      this.$apollo.queries.survey.refetch();
    },
    resultUrl(oid) {
      let host = location.hostname
      return `http://${host === 'localhost'? '127.0.0.1':host}:${location.port}/answer/${oid}/'`
    },
    del(oid) {
      this.$q
        .dialog({
          title: "确定删除吗",
          message: "删除后将无法恢复",
          ok: "确定",
          cancel: "取消"
        })
        .then(() => {
          this.$q.loading.show();
          this.$apollo
            .mutate({
              mutation: gql`
                mutation($oid: ID!) {
                  deleteSurvey(oid: $oid) {
                    oid
                  }
                }
              `,
              variables: {
                oid: oid
              }
            })
            .then(res => {
              this.$q.notify({
                message: "删除成功",
                color: "primary",
                timeout: 1500,
                icon: "bubble chart"
              });
              this.$apollo.queries.survey.refetch();
            });
          this.$q.loading.hide();
        });
    }
  },
  apollo: {
    survey: {
      query: gql`
        {
          survey(userId: "wsq") {
            edges {
              node {
                oid
                title
                datetime
                subTitle
              }
            }
          }
        }
      `
    }
  }
};
</script>

<template>
  <div>
    <q-spinner color="secondary" size="30px" style="display:block;margin: 1em auto;" v-if="loading>0" />
    <q-pull-to-refresh :handler="refresher" color="white">
      <!-- Content, whatever you like -->
      <p class="caption q-ma-md" style="font-size:1.3em">已发布</p>
      <q-list class="q-mx-md" separator>
        <q-item v-for="item in surveys" :key="item.id" v-if="item.release" style="overflow-x:hidden">
          <swipe :distance="130" class="full-width">
            <div style="background-color:#fff;" class="full-width row" @click="edit(item.id)" v-ripple>
              <q-item-main class="q-my-md" :label="item.title" label-lines="1" :sublabel="item.description" />
              <q-item-side right>
                <q-item-tile stamp>{{$Msg.getTime(item.createDatetime)}}</q-item-tile>
              </q-item-side>
            </div>
            <div slot="menu" class="row q-pa-sm" style="height:100%">
              <q-btn color="red" icon="delete" style="height:100%;display:block;width:40px" @click="del(item.id)" :loading="loading>0"></q-btn>
              <q-btn color="info" icon="share" style="height:100%;display:block;width:60px" @click="shareID=item.id;actionSheet=true"></q-btn>
            </div>
          </swipe>
        </q-item>
      </q-list>
      <p class="caption q-ma-md" style="font-size:1.3em">未发布</p>
      <q-list class="q-mx-md" separator>
        <q-item v-for="item in surveys" :key="item.id" v-if="!item.release" style="overflow-x:hidden">
          <swipe :distance="130" class="full-width">
            <div style="background-color:#fff;" class="full-width row" @click="edit(item.id)" v-ripple>
              <q-item-main class="q-my-md" :label="item.title" label-lines="1" :sublabel="item.description" />
              <q-item-side right>
                <q-item-tile stamp>{{$Msg.getTime(item.createDatetime)}}</q-item-tile>
              </q-item-side>
            </div>
            <div slot="menu" class="row q-pa-sm" style="height:100%">
              <q-btn color="red" icon="delete" style="height:100%;display:block;width:40px" @click="del(item.id)" :loading="loading>0"></q-btn>
              <q-btn color="info" icon="share" style="height:100%;display:block;width:60px" @click="shareID=item.id;actionSheet=true"></q-btn>
            </div>
          </swipe>
        </q-item>
      </q-list>
      <div style="padding-top:1em;padding-bottom:20vh;text-align:center;color:#bcbcbc;width:100%">/*---共有{{surveys.length}}个问卷---*/</div>
    </q-pull-to-refresh>
    <q-btn v-back-to-top.animate="{offset: 500, duration: 200}" round flat class="animate-pop animate-bounce" style="position:fixed;bottom:1em;left:calc(50% - 2.5em);width:5em;height:5em">
      <q-icon name="keyboard_arrow_up" />
    </q-btn>
    <q-action-sheet v-model="actionSheet" title="分享到" grid :actions="[
          {
            label: '微信',
            avatar: 'statics/img/wechat.svg',
          },
          {
            label: 'QQ',
            avatar: 'statics/img/qq.svg',

          },
          {
            label: '新浪微博',
            avatar: 'statics/img/weibo.svg',
          },
          {},
          {
            label: '复制链接',
            icon: 'link',
            color: 'tertiary',
            handler(){
              shareURLDialog = true
            }
          },
          {
            label: '二维码',
            icon: 'border outer',
            color: 'tertiary',
            handler(){
              shareVrcodeDialog = true
            }
          },
        ]" />
    <share-dialog v-model="shareURLDialog" :id="shareID"></share-dialog>
    <share-vrcode v-model="shareVrcodeDialog" :id="shareID"></share-vrcode>
  </div>
</template>
<script>
import gql from "graphql-tag";
import Swipe from "../components/swipe";
import { QActionSheet } from "quasar";
import shareDialog from "../components/index/share-dialog";
import shareVrcode from "../components/index/share-vrcode";
export default {
  data() {
    return {
      surveys: [],
      loading: 0,
      once: true,
      actionSheet: false,
      shareURLDialog: false,
      shareVrcodeDialog: false,
      shareID: null
    };
  },
  components: { Swipe, QActionSheet, shareDialog, shareVrcode },
  methods: {
    refresher(done) {
      done();
      this.$apollo.queries.surveys.refetch();
    },
    edit(id) {
      this.$router.push(`/edit/${id}`);
    },
    del(id) {
      this.$q
        .dialog({
          title: "确定删除吗?",
          message: "删除后数据将无法恢复",
          ok: {
            color: "primary",
            label: "确定"
          },
          cancel: "取消"
        })
        .then(() => {
          this.loading++;
          let g = gql`mutation{
          deleteSurvey(id:"${id}")
        }`;
          this.$apollo
            .mutate({
              mutation: g
            })
            .then(data => {
              this.$apollo.queries.surveys.refetch();
              this.loading--;
            })
            .catch(error => {
              console.error(error);
              this.$q.notify(error.toString());
              this.loading--;
            });
        })
        .catch(() => {});
    }
  },
  props: ["user"],
  apollo: {
    surveys: {
      query() {
        return gql`
          {
            surveys(authToken: "${this.user.authToken}") {
              id
              title
              description
              release
              createDatetime
            }
          }
        `;
      },
      loadingKey: "loading",
      skip() {
        return !this.user.authToken;
      },
      result({ data }) {
        this.once = false;
      }
    }
  }
};
</script>
<style scoped>

</style>

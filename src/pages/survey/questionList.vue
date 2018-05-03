<template>
  <div>
      <div class="fixed-bottom-right relative-position q-ma-lg" style="z-index:1">
          <q-btn round icon="add" :loading="this.loading>0" color="primary" :class="{'rotate-45':btnOpen}" :outline="btnOpen" style="z-index:1" @click="btnOpen = !btnOpen"/>
            <q-btn @click="type='单项选择题';btnOpen = false" :style="`z-index:0;position:absolute;left:-${btnx(rotate)}em;top:${btny(rotate)}em;opacity:${btnOpen?1:0}; `" round dense size="1em" icon="radio button checked" color="secondary"/>
            <q-btn @click="type='多项选择题';btnOpen = false" :style="`z-index:0;position:absolute;left:-${btnx(rotate+105)}em;top:${btny(rotate+105)}em;;opacity:${btnOpen?1:0};`" round dense size="1em" icon="check box" color="negative"/>
            <q-btn @click="type='填空题';btnOpen = false" :style="`z-index:0;position:absolute;left:-${btnx(rotate+220)}em;top:${btny(rotate+220)}em;;opacity:${btnOpen?1:0};`" round dense size="1em" icon="short text" color="info"/>
      </div>
      <q-btn
      v-back-to-top.animate="{offset: 500, duration: 200}"
      round
      flat
      class="animate-pop animate-bounce"
      style="position:fixed;bottom:1em;left:calc(50% - 1.5em);width:3em;height:3em"
      >
      <q-icon name="keyboard_arrow_up" />
    </q-btn>
      <span style="color:#bcbcbc" class="animate-fade"><strong style="font-size:1.3em;color:#555">问题列表</strong></span> 
          
          <q-list link no-border>
            <div v-for="item in questions" :key="item.id">
            <div v-if="editingId===item.id" class="animate-pop" >
                <span style="color:#bcbcbc"><strong style="font-size:1.3em;color:#555">编辑问题</strong>{{type}}</span> 
                <q-field :count="15" class="q-mt-sm">   
                    <q-input maxlength="15" v-model="title" autofocus float-label="请输入题目标题" color="secondary" />
                </q-field>
                <q-chips-input v-model="option" v-if="type!='填空题'" placeholder="请添加选项" color="secondary"  />
                <div class="row justify-between">
                <q-toggle label="是否必答" class="q-my-md" v-model="required" color="red"/>
                <div class="row">
                    <q-btn round flat color="secondary" icon="clear" @click="editingId='';clear()"/>            
                    <q-btn round flat v-if="title&&(type==='填空题'||option.length>0)" icon="done" @click="editSubmit" color="primary"/>
                </div>
                </div>
            </div>
            <swipe :distance="50" v-else>
            <q-list-header style="background-color:#fff;">
              <span>{{item.title}}<q-icon name="fiber manual record" class="q-pb-sm" style="font-size:0.5em" color="red" dense  v-if="item.required"/></span>
              <q-item v-if="item.type==='填空题'"><q-input placeholder="请输入您的回答" :value="optionList[item.id]" @input="val=>{optionList[item.id]=val;optionList=Object.assign({},optionList)}"/></q-item>
              <q-item v-else tag="label" v-for="foo in item.option.split('|')" :key="foo" v-ripple>
                <q-item-side>
                  <q-checkbox v-if="item.type==='多项选择题'" :value="optionList[item.id]" @input="val=>{optionList[item.id]=val;optionList=Object.assign({},optionList)}"  :val="foo" :label="foo"/>
                  <q-radio v-if="item.type==='单项选择题'" :value="optionList[item.id]" @input="val=>{optionList[item.id]=val;optionList=Object.assign({},optionList)}"  :val="foo" :label="foo"></q-radio>
                </q-item-side>
              </q-item>
            </q-list-header>
            <div slot="menu" class="colunm q-pa-sm" style="height:100%">
               <q-btn color="secondary" icon="edit" style="height:50%;display:block" @click="edit(item)"></q-btn>
              <q-btn color="red" icon="delete" style="height:50%;display:block" @click="delQuestion(item.id)" :loading="loading>0"></q-btn>
            </div>
            </swipe>
            <hr style="border:none;border-top:1px solid #bcbcbc">
            </div>
          </q-list>
       <div>
          <div v-if="type&&!editingId" class="animate-pop" >
            <span style="color:#bcbcbc"><strong style="font-size:1.3em;color:#555">添加问题</strong> {{type}}</span> 
            <q-field :count="15" class="q-mt-sm">   
                <q-input maxlength="15" v-model="title" autofocus float-label="请输入题目标题" color="secondary" />
            </q-field>
            <q-chips-input v-model="option" v-if="type!='填空题'" placeholder="请添加选项" color="secondary"  />
            <div class="row justify-between">
            <q-toggle label="是否必答" class="q-my-md" v-model="required" color="red"/>
            <div class="row">
                <q-btn round flat color="secondary" icon="clear" @click="type=''"/>            
                <q-btn round flat v-if="title&&(type==='填空题'||option.length>0)" icon="done" @click="submit" color="primary"/>
            </div>
            </div>
          </div>
      </div>
      <div style="padding-top:1em;padding-bottom:20vh;text-align:center;color:#bcbcbc;width:100%">/*---共有{{questions.length}}个问题---*/</div>
  </div>
</template>
<script>
import gql from "graphql-tag";
import Swipe from "../../components/swipe";
export default {
  name: "questionList",
  props: ["surveyId", "refreshToggle"],
  components: { Swipe },
  data() {
    return {
      questions: [],
      loading: 0,
      // 旋转按钮控制
      rotate: 140,
      r: 4,
      btnOpen: false,
      // 问题添加
      id: "",
      title: "",
      type: "",
      option: [],
      required: true,
      optionList: {},
      // 编辑中问题
      editingId: ""
    };
  },
  methods: {
    // 计算底部弹出按钮位置
    btnx(r) {
      return this.btnOpen * this.r * Math.sin(r * Math.PI / 360);
    },
    btny(r) {
      return this.btnOpen * this.r * Math.cos(r * Math.PI / 360);
    },
    // 提交信息触发
    submit() {
      this.loading++;
      let g = gql`mutation{
        createQuestion(questionInput:{
            title:"${this.title}"
            type:"${this.type}"
            required:${this.required}
            option:"${this.option.join("|")}"
            surveyId:"${this.surveyId}"
        }){
                type
          }
        }`;
      this.$apollo
        .mutate({
          mutation: g
        })
        .then(data => {
          this.$apollo.queries.questions.refetch();
          this.loading--;
          this.clear();
        })
        .catch(error => {
          console.error(error);
          this.$q.notify(error.toString());
          this.loading--;
        });
    },
    // 清除问题缓存信息
    clear() {
      this.title = "";
      this.option = [];
      this.type = "";
      this.required = true;
    },
    // 删除问题
    delQuestion(id) {
      this.loading++;
      let g = gql`
        mutation {
          deleteQuestion(id: "${id}")
        }
      `;
      this.$apollo
        .mutate({
          mutation: g
        })
        .then(data => {
          this.$apollo.queries.questions.refetch();
          this.loading--;
        })
        .catch(error => {
          console.error(error);
          this.$q.notify(error.toString());
          this.loading--;
        });
    },
    // 编辑问题
    edit(item) {
      this.title = item.title;
      this.option = item.option.split("|");
      this.type = item.type;
      this.required = item.required;
      this.editingId = item.id;
    },
    // 提交正在编辑的问题
    editSubmit() {
      this.loading++;
      let g = gql`
        mutation {
          updateQuestion(
            id: "${this.editingId}"
            questionInput: { 
              type: "${this.type}", 
              title: "${this.title}", 
              option: "${this.option.join("|")}" 
              required:${this.required}
              surveyId:"${this.surveyId}"}
          ) {
            id
          }
        }
      `;
      this.$apollo
        .mutate({
          mutation: g
        })
        .then(data => {
          this.$apollo.queries.questions.refetch();
          this.clear();
          this.editingId = "";
          this.loading--;
        })
        .catch(error => {
          console.error(error);
          this.$q.notify(error.toString());
          this.loading--;
        });
    }
  },
  apollo: {
    questions: {
      query() {
        return gql`
          {
            questions(surveyId: "${this.surveyId}") {
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
        return !this.surveyId;
      },
      result({ data }) {
        data.questions.forEach(element => {
          this.optionList[element.id] = element.type === "单项选择题" ? "" : [];
        });
      }
    }
  }
};
</script>
<style scoped>

</style>


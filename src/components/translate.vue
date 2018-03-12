<template>
<div>
    <div class="row justify-between">
      <p class="caption"><q-icon v-if="question.node.required" name="priority high" color="red"/>{{question.node.title}}:</p>
      <q-btn v-if="isDel"  flat color="red" dense icon="delete" label="删除"  @click="delSubmit"/>
      <q-btn v-else flat color="primary" dense icon="add" label="提交" @click="ansSubmit"/>
    </div>
      <div v-if="question.node.type==='单项选择题'" class="colunm">
        <q-option-group
          class="q-mb-xl q-ml-sm"
          type="radio"
          v-model="result"
          @input="$emit('input',result)" 
          :options="optionFormat(question.node.optionList)"
        />
      </div>
      <div v-if="question.node.type==='多项选择题'">
        <q-option-group
          class="q-mb-xl q-ml-sm"
          type="checkbox"
          v-model="list"
          @input="$emit('input',list.join('|'))"
          :options="optionFormat(question.node.optionList)"
        />
      </div>
      <div v-if="question.node.type==='填空题'">
        <q-input class="q-mb-xl q-ml-sm" @input="$emit('input',result)" v-model="result" float-label="请输入答案"/>
      </div>
</div>
</template>
<script>
import gql from "graphql-tag";
export default {
  name: "translate",
  props: ["surveyOid", "question", "isDel"],
  data() {
    return {
      result: "",
      list: []
    };
  },
  computed: {
    final() {
      return this.result ? this.result : this.list.join("|");
    }
  },
  methods: {
    optionFormat(options) {
      return options.split("|").map((val, index, arr) => {
        return { label: val, value: val };
      });
    },
    delSubmit() {
      this.$q
        .dialog({
          title: "确定删除吗",
          message: "删除后将无法恢复",
          ok: "确定",
          cancel: "取消"
        })
        .then(() => {
          // this.$q.loading.show();
          this.$emit("del");
        });
    },
    ansSubmit() {
      if(this.question.node.required&&!this.final){
        this.$q.notify('必答题')
        return
      }
      let submitGql = gql`
        mutation {
          createAnswer(
            answerInput: { userId: "wsq", questionOid: "${
              this.question.node.oid
            }", content: "${this.final}" }
          ) {
            answer {
              oid
            }
          }
        }
      `;
      this.$apollo
        .mutate({
          mutation: submitGql
        })
        .then(res => {
          this.$q.notify({
            message: "提交成功",
            color: "primary",
            timeout: 1500,
            icon: "bubble chart"
          });
        }).catch((error)=>{
          this.$q.notify(error)
        })
    }
  },
  mounted() {
    // this.question.forquestion(element => {
    //   console.log(element)
    // });
  }
};
</script>
<style scoped>
#option {
  margin-right: 1em;
}
#option:last-child {
  margin-right: 0;
}
</style>

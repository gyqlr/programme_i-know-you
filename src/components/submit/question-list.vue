<template>
    <div>
        <q-list link no-border class="list">
            <div class="item" v-for="item in list" :key="item.id">
                <q-list-header>
                    <span :class="{'error-title':hasError(item.id)}">{{item.title}}
                        <q-icon name="fiber manual record" class="q-pb-sm" dense v-if="item.required" />
                    </span>
                    <q-item v-if="item.type==='填空题'">
                        <q-input placeholder="请输入您的回答" v-model="optionList[item.id]" @input="modelFresh" /></q-item>
                    <q-item v-else tag="label" v-for="foo in item.option.split('|')" :key="foo" v-ripple>
                        <q-item-side>
                            <q-checkbox v-if="item.type==='多项选择题'" v-model="optionList[item.id]" @input="modelFresh" :val="foo" :label="foo" />
                            <q-radio v-if="item.type==='单项选择题'" v-model="optionList[item.id]" @input="modelFresh" :val="foo" :label="foo"></q-radio>
                        </q-item-side>
                    </q-item>
                </q-list-header>
                <hr class="split">
            </div>
        </q-list>
        <q-btn class="submit-btn" color="primary" label="提交" @click="submit" :disable="this.$v.optionList.$error" :loading="loading>0" />
        <div style="padding-top:1em;padding-bottom:20vh;text-align:center;color:#bcbcbc;width:100%">/*--{{questionNum}}--*/</div>
        <q-btn v-back-to-top.animate="{offset: 500, duration: 200}" round flat class="animate-pop animate-bounce" style="position:fixed;bottom:1em;left:calc(50% - 1.5em);width:3em;height:3em">
            <q-icon name="keyboard_arrow_up" />
        </q-btn>
    </div>
</template>
<style lang="stylus" scoped>
.error-title {
    color: red;
}

.list {
    .q-list-header {
        background-color: #fff;

        span {
            .q-icon {
                font-size: 0.5em;
                color: red;
            }
        }
    }

    .split {
        border: none;
        border-top: 1px solid #bcbcbc;
    }

    .item:last-child {
        .split {
            display: none;
        }
    }
}

.submit-btn {
    margin: 1em;
    width: calc(100% - 2em);
}
</style>

<script>
import { required } from "vuelidate/lib/validators";
import { isArray } from "util";
import gql from "graphql-tag";
export default {
  name: "question-list",
  props: ["list"],
  data() {
    return {
      optionList: {},
      valid: {},
      loading: 0
    };
  },
  validations() {
    return {
      optionList: this.valid
    };
  },
  computed: {
    questionNum() {
      let num = this.list.length;
      return num === 0 ? "暂时还没有问题" : `共有${num}个问题`;
    }
  },
  methods: {
    modelFresh() {
      this.optionList = { ...this.optionList };
    },
    submit() {
      this.$v.optionList.$touch();
      if (this.$v.optionList.$error) {
        this.$q.notify({
          message: "还有未填写的问题哦",
          icon: "warning",
          color: "secondary"
        });
      } else {
        let acc = "[";
        for (let item in this.optionList) {
          let content = this.optionList[item];
          acc += `{
            questionId: "${item}",
            content: "${Array.isArray(content) ? content.join("|") : content}"
          },`;
        }
        acc += "]";
        let g = gql`
          mutation {
            createAnswer(
              answersInput: ${acc}
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
          .then(val => {
            this.loading--;
            this.$router.push("/success");
          })
          .catch(error => {
            this.$q.notify(error.toString());
            this.loading--;
          });
      }
    },
    hasError(id) {
      return this.$v.optionList[id] ? this.$v.optionList[id].$error : false;
    }
  },
  mounted() {
    this.list.forEach(item => {
      this.optionList[item.id] = item.type === "多项选择题" ? [] : "";
      this.valid[item.id] = item.required ? { required } : {};
    });
    this.modelFresh();
    this.valid = { ...this.valid };
  }
};
</script>


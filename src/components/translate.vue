<template>
<div>
    <p class="caption"><q-icon v-if="question.node.required" name="priority high" color="red"/>{{question.node.title}}:</p>
      <div v-if="question.node.type==='单项选择题'" class="colunm">
        <!-- <q-radio 
        @input="$emit('input',result)" 
        v-model="result" v-for="item in question.node.optionList.split('|')" 
        :key="item" :val="item" 
        :label="item"
        class="q-ma-md"
        /> -->
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
export default {
  name:'translate',
  props:['surveyOid','question'],
  data(){
    return {
      result:'',
      list:[]
    }
  },
  computed:{
  },
  methods:{
    optionFormat(options){
      return options.split('|').map((val,index,arr)=>{
            return {'label':val,'value':val}
          })
    }
  },
  mounted(){
    // this.question.forquestion(element => {
    //   console.log(element)
    // });
  }
}
</script>
<style scoped>
#option{
  margin-right: 1em;
}
#option:last-child{
  margin-right: 0
}
</style>

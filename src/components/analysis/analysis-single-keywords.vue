<template>
    <div>
        <q-spinner v-if="loading>0" color="secondary" size="2em" style="width:100%;margin-top:1em" />
        <div v-else-if="!error">
            <div class="q-list-header" style="padding-left:0">关键词提取</div>
            <wordcloud :margin="{top: 0, right: 0, bottom: 0, left: 0 }" :data="data" nameKey="name" valueKey="value" />
        </div>
        <span v-else>获取数据失败</span>
    </div>
</template>

<script>
import wordcloud from 'vue-wordcloud'
export default {
    name:'analysis-single-keywords',
    data() {
        return {
            loading: 0,
            data:null,
            error:false
        }
    },
    components:{
        wordcloud
    },
    methods: {
        getResult() {
            this.loading++
            this.$axios.get(`/api/keywords/${this.question.id}`).then(res=>{
                this.data = res.data.map(item=>{
                    return {name:item[1],value:item[0]}
                })
                this.loading--
            }).catch(error=>{
                this.error = true
                this.loading--
            })
        }
    },
    props: {
        question: {
            type: Object,
            required:true 
        },
    },
    beforeMount(){
        this.getResult()
    }
}
</script>

<style scoped>

</style>
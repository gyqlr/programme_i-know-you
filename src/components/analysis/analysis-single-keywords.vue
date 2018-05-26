<template>
    <div>
        <q-spinner v-if="loading>0" color="secondary" size="2em" style="width:100%;margin-top:1em" />
        <div v-else-if="!error">
            <div class="q-list-header" style="padding-left:0">关键词提取</div>
            <wordcloud v-if="show" :margin="{top: 0, right: 0, bottom: 0, left: 0 }" :data="data" nameKey="name" valueKey="value" />
            <span v-else style="color:#F5A623">关键词数量太少</span>
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
            this.$axios.get(`http://111.231.68.175:8081/api/keywords/${this.question.id}`).then(res=>{
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
    computed:{
        show(){
            return this.data.length>=20
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
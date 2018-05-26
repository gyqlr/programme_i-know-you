<template>
    <div>
        <q-spinner v-if="loading>0" color="secondary" size="2em" style="width:100%;margin-top:1em" />
        <div v-else-if="!error">
            <div class="q-list-header" style="padding-left:0">关键意见抽取</div>
            <q-list no-border dense>
                <q-collapsible indent dense multiline v-for="item in data" :key="item._id" >
                    <template slot="header" class="header">
                        <q-item-main style="font-weight:500">{{item.opinion}}</q-item-main>
                        <q-chip  small color="secondary" style="font-weight:500">{{item.num}}</q-chip>                        
                    </template>
                    <span v-for="(each,index) in item.list" :key="index" style="color:#bcbcbc">
                            {{index+1}}. {{each[0]}}<br>
                    </span>
                </q-collapsible>
                
            </q-list>
        </div>
        <span v-else>获取数据失败</span>
    </div>
</template>
<style lang="stylus" scoped>

</style>

<script>
export default {
    name:'analysis-single-keywords',
    data() {
        return {
            loading: 0,
            data:null,
            error:false
        }
    },
    methods: {
        getResult() {
            this.loading++
            this.$axios.get(`/api/comments/${this.question.id}`).then(res=>{
                this.data = res.data
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

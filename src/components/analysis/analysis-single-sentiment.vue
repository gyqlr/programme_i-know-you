<template>
    <div>
        <q-spinner v-if="loading>0" color="seconday" style="width:100vw" />
        <div v-else-if="!error">
            <div class="q-list-header" style="padding-left:0">情感偏向</div>
            <div class="row content justify-between">
                <img src="../../statics/img/sad.svg" style="width:40px;height:40px" />
                <q-progress v-if="data !== null" :percentage="data*100" stripe animate :buffer="(1-data)*100" height="40px" />
                <img src="../../statics/img/happy.svg" style="width:40px;height:40px" />
                <span>{{(data*100).toFixed(2)}}%</span>
            </div>
        </div>
        <span v-else class="error">暂无分析数据</span>
    </div>
</template>
<style lang="stylus" scoped>
.content {
    position: relative;

    .q-progress {
        width: calc(100% - 90px);
    }

    img {
        width: 40px;
        height: 40px;
    }

    span {
        position: absolute;
        color: #555;
        font-weight: 500;
        font-size: 20px;
        padding: 10px;
        top: -40px;
        right: 0;
    }
}

.error {
    color: #bcbcbc;
}
</style>


<script>

export default {
        name:'analysis-single-sentiment',
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
                this.$axios.get(`/api/sentiment/${this.question.id}`).then(res=>{
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

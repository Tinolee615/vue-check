<template>
    <div class="pageFullScreen" id="FullScreen">
        <goods-manage></goods-manage>
    </div>
</template>
<script>
import goodsManage from '../area/components/goodsmanage.vue'
export default {
    data() {
        return {
            
        }
    },
    mounted() {

    },
    created() {
        
    },
    methods: {
        
    },
    watch: {
        
    },
    computed: {

    },
    components: {
        goodsManage
    },
}
</script>
<style lang="scss" scoped>
/*清除浮动代码*/ 
.clearfloat:after{display:block;clear:both;content:"";visibility:hidden;height:0} 
.clearfloat{zoom:1} 
#FullScreen {
    padding: 16px 20px;
} 

</style>

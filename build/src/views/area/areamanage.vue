<template>
    <div class="pageFullScreen" id="FullScreen">
        <region></region>
    </div>
</template>
<script>
import region from '../area/components/region.vue'
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
        region
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

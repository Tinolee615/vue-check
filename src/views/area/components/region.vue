<template>
    <div class="pageFullScreen" id="FullScreen">
        <div class="all-region-list" v-for="(item,region_index) in region" :key="item.code">
            <!-- 大区 -->
            <div class="region">
                <el-checkbox :indeterminate="item.isIndeterminate" v-model="item.checkAll" :checked="item.checkAll" @change="checked=>handleCheckedProvinceAllChange(checked,item)">
                    {{item.name}}{{'('+item.allCheckboxCode.length+')'}}
                </el-checkbox>
            </div>
            <div class="province">
                <el-checkbox-group class="clearfloat" v-model="item.allCheckboxCode" @change="checked=>handleCheckedProvinceChange(checked,item)">
                    <div class="mouseover-event-list" v-for="(list,index_pro) in item.children" :key="list.code" @mouseenter.stop="showProvinceCheckbox(list,region_index,index_pro,$event)" @mouseleave.stop="hideProvinceCheckbox(list,region_index,index_pro,$event)">
                        <!-- 省级 -->
                        <el-checkbox class="child-box" :indeterminate="list.isIndeterminate" :label="list.code" @change="checked=>handleCheckedAreaAllChange(checked,list)">{{list.name}}{{'('+list.allCheckboxCode.length+')'}}
                            <i class="el-icon-arrow-down"></i>
                        </el-checkbox>
                    </div>
                </el-checkbox-group>
            </div>
        </div>
        <div class="area" ref="area" @mouseenter.stop="showAreaCheckbox" @mouseleave.stop="hideAreaCheckbox">
            <div class="area-box">
                <el-checkbox-group v-model="citys[0].allCheckboxCode" @change="checked=>handleCheckedAreaChange(checked)">
                    <div class="mouseover-event-child" v-for="(list) in citys[0].children" :key="list.code">
                        <div class="area-child-checkbox" @mouseenter.stop="showCountiesCheckbox">
                            <el-checkbox class="area-child-box" :indeterminate="list.isIndeterminate" :label="list.code" v-model="list.checkAll" @change="checked=>handleCheckedChildAllChange(checked,list)">{{list.name}}{{'('+list.allCheckboxCode.length+')'}}
                                <i class="el-icon-arrow-right"></i>
                            </el-checkbox>
                        </div>
                        <div class="area-child" :ref="'areachild'+list.code">
                            <div class="area-child-child-box">
                                <el-checkbox-group v-model="list.allCheckboxCode">
                                    <!-- 县级 -->
                                    <el-checkbox class="area-child-child-checkbox" v-for="(listchild) in list.children" :label="listchild.code" :key="listchild.code" @change="checked=>handleCheckedChildChange(checked,list,listchild)">{{listchild.name}}
                                        <!-- <i class="el-icon-arrow-right"></i> -->
                                    </el-checkbox>
                                </el-checkbox-group>
                            </div>
                        </div>
                    </div>
                </el-checkbox-group>
            </div>
        </div>
        <el-button type="primary" @click="showThisData">所有数据</el-button>
    </div>
</template>
<script>
import region from '../js/area.js'

export default {
    data() {
        return {
            checkAll: false,
            checkedRegion: [],
            checkedProvince: [],
            checkedCity: [],
            checkedArea: [],
            isIndeterminate: false,
            region:[],
            province:{},
            citys:[{
                children:[]
            }],
            allCheckboxCode:[],
            offsetLeft:0,
            offsetTop:0,
            showArea:null,
            hideArea:null,
            hideProvince:null,
            this_state:true,
            alias:'',
            region_index:'',//大区索引
            index_pro:'',//省索引
            allChooseCode:[{
                name:'',
                code:'',
                children:[]
            }]
        }
    },
    mounted() {

    },
    created() {
        // console.log(JSON.stringify(getProvince()))
        this.region = region.getProvince();
        this.addRegion(this.region)
    },
    methods: {
        showThisData(){
            console.log('this.region',this.region)
            console.log(JSON.stringify(this.region))
        },
        addRegion(arr){
            arr.forEach((item,index)=>{
                this.$set(item,'isIndeterminate',false);
                this.$set(item,'checkAll',false);
                this.$set(item,'allCheckboxCode',[]);
                if(item.children&&item.children.length>0){
                    this.addRegion(item.children)
                }
            })
        },
        addIsShow(arr){
            arr.forEach((item,index)=>{
                if(!item.allCheckboxCode){
                    this.$set(item,'allCheckboxCode',[]);
                }
                if(item.children&&item.children.length>0){
                    this.addIsShow(item.children)
                }
            })
        },
        showProvinceCheckbox(province,region_index,index_pro,$event){
            this.region_index = region_index;
            this.index_pro = index_pro;
            this.alias = province.alias;
            this.province = province;
            clearTimeout(this.showArea);
            this.showArea = setTimeout(()=>{
                if(province!=undefined){
                    this.citys.splice(0,1,province);
                    this.addIsShow(this.citys[0].children);
                    this.offsetLeft = $($event.target).offset().left;
                    this.offsetTop = $($event.target).offset().top+25;
                    this.$nextTick(()=>{
                        $(this.$refs.area).show();
                        $(this.$refs.area).offset({left:this.offsetLeft,top:this.offsetTop});
                    })
                }
            },200)
        },
        hideProvinceCheckbox(alias,$event){
            clearTimeout(this.showArea);
            this.hideProvince = setTimeout(()=>{
                this.$nextTick(()=>{
                    $(this.$refs.area).hide();
                    this.offsetLeft = 0;
                    this.offsetTop = 0;
                    $(this.$refs.area).offset({left:this.offsetLeft,top:this.offsetTop})
                })
            },100)
        },
        showAreaCheckbox(){
            clearTimeout(this.hideProvince)
        },
        hideAreaCheckbox(){
            this.hideArea = setTimeout(()=>{
                this.$nextTick(()=>{
                    $(this.$refs.area).hide();
                    this.offsetLeft = 0;
                    this.offsetTop = 0;
                    $(this.$refs.area).offset({left:this.offsetLeft,top:this.offsetTop})
                })
            },100)
        },
        showCountiesCheckbox($event){
            if(!($($event.target).parents('.area-child-checkbox').length>0)){
                if($($event.target).hasClass('el-icon-arrow-right')){
                    $($event.target).siblings('.area-child').css({'top':$($event.target).position().top-2})
                }else{
                    $($event.target).siblings('.area-child').css({'top':$($event.target).position().top})
                }
            }else{
                $($event.target).parents('.area-child-checkbox').siblings('.area-child').css({'top':$($event.target).parents('.area-child-checkbox').position().top})
            }
        },
        attrOnly(array, attr){
            var first;
            if(array.length>0){
                return array.every(function(item){
                    return item.province == attr;
                });
            }
            return true;
        },
        //省级、市级、县级
        handleChange(value,item,listchild){
            this.$set(this.region[this.region_index],'isIndeterminate',true)

            if(item.allCheckboxCode.length>0&&item.allCheckboxCode.length<item.children.length){
                this.$set(item,'checkAll',false);
                if(listchild){
                    this.$set(item,'isIndeterminate',true)
                    if(this.citys[0].allCheckboxCode.indexOf(item.code)!=-1){
                        this.citys[0].allCheckboxCode.splice(this.citys[0].allCheckboxCode.indexOf(item.code),1)
                    }
                    this.$set(this.region[this.region_index].children[this.index_pro],'isIndeterminate',true)
                }else if(!listchild&&item&&item.code.toString().length===1){
                    
                }else if(!listchild&&item&&item.code.toString().length>1){
                    this.$set(this.region[this.region_index].children[this.index_pro],'isIndeterminate',true)
                }
            }else if(item.allCheckboxCode.length===0){
                this.$set(item,'checkAll',false);
                if(listchild){
                    this.$set(item,'isIndeterminate',false)
                    if(this.citys[0].allCheckboxCode.indexOf(item.code)!=-1){
                        this.citys[0].allCheckboxCode.splice(this.citys[0].allCheckboxCode.indexOf(item.code),1)
                    }
                    //当前省份的已选市区为0时
                    if(this.region[this.region_index].children[this.index_pro].allCheckboxCode.length===0){
                        this.$set(this.region[this.region_index].children[this.index_pro],'isIndeterminate',false)
                    }
                    //当前大区的已选省份为0时
                    if(this.region[this.region_index].allCheckboxCode.length===0){
                        this.$set(this.region[this.region_index],'isIndeterminate',false)
                    }
                }else if(!listchild&&item&&item.code.toString().length===1){
                    this.$set(this.region[this.region_index].children[this.index_pro],'isIndeterminate',false)
                    if(this.region[this.region_index].allCheckboxCode.length===0){
                        this.$set(this.region[this.region_index],'isIndeterminate',false)
                    }
                }else if(!listchild&&item&&item.code.toString().length>1){
                    this.$set(this.region[this.region_index].children[this.index_pro],'isIndeterminate',false)
                    //当前省份的已选市区为0时
                    if(this.region[this.region_index].children[this.index_pro].allCheckboxCode.length===0){
                        if(this.region[this.region_index].allCheckboxCode.indexOf(item.code)!=-1){
                            this.region[this.region_index].allCheckboxCode.splice(this.region[this.region_index].allCheckboxCode.indexOf(item.code),1)
                        }
                        if(this.region[this.region_index].allCheckboxCode.length===0){
                            this.$set(this.region[this.region_index],'isIndeterminate',false)
                        }
                    }
                }
            }else if(item.allCheckboxCode.length==item.children.length){
                this.$set(item,'checkAll',true);
                if(listchild){
                    this.$set(item,'isIndeterminate',false)
                    if(this.citys[0].allCheckboxCode.indexOf(item.code)==-1){
                        this.citys[0].allCheckboxCode.push(item.code)
                    }
                    if(this.region[this.region_index].allCheckboxCode.length===0&&item.allCheckboxCode.length===0){
                        this.$set(this.region[this.region_index],'isIndeterminate',false)
                    }
                    if(this.region[this.region_index].allCheckboxCode.length===this.region[this.region_index].children.length){
                        this.$set(this.region[this.region_index],'isIndeterminate',false)
                    }
                    if(this.region[this.region_index].children[this.index_pro].allCheckboxCode.length===this.region[this.region_index].children[this.index_pro].children.length){
                        this.$set(this.region[this.region_index].children[this.index_pro],'isIndeterminate',false)
                    }
                }else if(!listchild&&item&&item.code.toString().length===1){
                    this.$set(item,'isIndeterminate',false)
                    // this.$set(this.region[this.region_index],'isIndeterminate',true)
                    this.$set(this.region[this.region_index].children[this.index_pro],'isIndeterminate',false)
                    if(this.region[this.region_index].allCheckboxCode.indexOf(this.region[this.region_index].children[this.index_pro].code)==-1){
                        this.region[this.region_index].allCheckboxCode.push(this.region[this.region_index].children[this.index_pro].code)
                    }
                    if(this.region[this.region_index].allCheckboxCode.length===0){
                        this.$set(this.region[this.region_index],'isIndeterminate',false)
                    }
                }else if(!listchild&&item&&item.code.toString().length>1){
                    this.$set(item,'isIndeterminate',false)
                    this.$set(this.region[this.region_index],'isIndeterminate',true)
                    if(this.region[this.region_index].allCheckboxCode.indexOf(item.code)==-1){
                        this.region[this.region_index].allCheckboxCode.push(item.code)
                    }
                    if(this.region[this.region_index].allCheckboxCode.length===0&&item.allCheckboxCode.length===0){
                        this.$set(this.region[this.region_index],'isIndeterminate',false)
                    }
                    if(this.region[this.region_index].allCheckboxCode.length===this.region[this.region_index].children.length){
                        this.$set(this.region[this.region_index],'isIndeterminate',false)
                    }
                }
            }
        },
        //省级
        handleCheckedProvinceChange(value,item) {
            console.log('handleCheckedProvinceChange')
            this.handleChange(value,item)
        },
        //市级
        handleCheckedAreaChange(value) {
            console.log('handleCheckedAreaChange')
            this.handleChange(value,this.citys[0])
        },
        //县级
        handleCheckedChildChange(value,item,listchild) {
            console.log('handleCheckedChildChange')
            this.handleChange(value,item,listchild)
        },

        addcheckedBox(val,arr){
            if(!arr){
                this.$set(this.allCheckboxCode,this.region.children)
                return;
            }
            var myList = [];
            this.citys[0].children.forEach((mylist,index)=>{
                myList.push(mylist.code);
                this.$set(mylist,'checkAll',val);
                this.$set(mylist,'isIndeterminate',false);
                val?this.$set(this.citys[0],'allCheckboxCode',myList):this.$set(this.citys[0],'allCheckboxCode',[])
                val?this.$set(arr,'allCheckboxCode',myList):this.$set(arr,'allCheckboxCode',[])
            })
        },
        addAreaCheckedBox(val,arr){
            if(!arr){
                this.$set(this.allCheckboxCode,this.region.children)
                return;
            }
            var myList = [];
            arr.children.forEach((mylist,index)=>{
                if(mylist.children&&mylist.children.length>0){
                    this.addAreaCheckedBox(val,mylist)
                }
                myList.push(mylist.code);
                this.$set(arr,'checkAll',val);
                this.$set(arr,'isIndeterminate',false);
                val?this.$set(arr,'allCheckboxCode',myList):this.$set(arr,'allCheckboxCode',[])
            })
        },
        //县区
        handleCheckedChildAllChange(val,item){
            console.log('handleCheckedChildAllChange')
            this.addAreaCheckedBox(val,item)
        },
        //市区
        handleCheckedAreaAllChange(val,item){
            console.log('handleCheckedAreaAllChange')
            this.addAreaCheckedBox(val,item)
        },
        //省级
        handleCheckedProvinceAllChange(val,item){
            console.log('handleCheckedProvinceAllChange')
            this.addAreaCheckedBox(val,item)
        },
    },
    watch: {
        // region: {
        //     handler(newVal, oldVal){
        //         console.log(newVal)
        //     },
        //     deep: true
        // }
    },
    computed: {

    },
    components: {

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
.all-region-list{
    margin: 0 auto;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: start;
    -ms-flex-align: start;
    -webkit-align-items: flex-start;
    align-items: flex-start;
    width: 730px;
    background-color: #eee;
    padding-left: 40px;
    padding-bottom: 20px;
}
.region{
    min-width: 120px;
    margin-right: 20px;
    margin-top: 6px;
}
.province{

}

.mouseover-event-list{
    width: 130px;
    float: left;
    position: relative;
    margin-top: 6px;
    .child-box{
        width: 100px;
        margin-left: 10px;
        &:hover + .area{
            visibility: visible!important;;
        }
    }

}
.area{
    display: none;
    padding: 10px 12px;
    position: absolute;
    left: 0;
    top: 24px;
    background-color: #fff;
    border-radius: 3px;
    box-shadow: 0 1px 6px rgba(0,0,0,.2);
    font-size: 12px;
    z-index: 9;
    padding-bottom: 6px;
    .area-box{
        max-height: 300px;
        background-color: #fff;
        overflow-y: auto;
        overflow-x: hidden;
    }
    &:before{
        content:"";
        width:0;
        height:0;
        position:absolute;
        left:30px;
        top:-16px;
        border-width:8px;
        border-style:solid;
        border-color:transparent transparent #e4e4e4 transparent; /* transparent 设置边框颜色透明 */
    }
    &:after{
        content:"";
        width:0;
        height:0;
        position:absolute;
        left:30px;
        top:-14px;
        border-width:8px;
        border-style:solid;
        border-color:transparent transparent #fff transparent; /* transparent 设置边框颜色透明 */
    }
}
.area-child-checkbox{
    text-align: left;
}
.mouseover-event-child{
    display: block;
    margin-left: 10px;
    margin-top: 6px;
    background-color: #fff;
    .area-child{
        display: none;
        padding: 10px 12px;
        position: absolute;
        left: 80%;
        top: -10px;
        background-color: #fff;
        opacity: .8;
        border-radius: 3px;
        box-shadow: 0 1px 6px rgba(0,0,0,.2);
        font-size: 12px;
        z-index: 9999;
        padding-bottom: 6px;
        .area-child-child-box{
            max-height: 300px;
            background-color: #fff;
            overflow-y: auto;
            overflow-x: hidden;
            padding: 0 10px 0 0;  
        }
    }
    &:hover{
        .area-child{
            display: block!important;;
        }
    }
}
.child-box:nth-child(4n+1){
    margin-left: 0;
}
.area-child-child-checkbox{
    background-color: #fff;
    display: block;
    text-align: left;
    margin-left: 10px;
    margin-top: 6px;
}
.mouseover-event-child{
    .area-child{
        opacity:0
    }
}
.mouseover-event-child:hover .area-child{
    animation:show 0.3s 1 forwards; /*这里的3s表示总动画长3秒，其它属性感兴趣自己去查，反正主要就是那个3s*/
}
@keyframes show {
    0%{
        opacity:0;
    }
    66%{ /*这里表示3s的66%也就是大约2秒的时候*/
        opacity:0;
    }
    100%{
        opacity:1;
    }
}
</style>

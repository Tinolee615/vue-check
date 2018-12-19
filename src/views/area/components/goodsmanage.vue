<template>
    <div class="pageFullScreen" id="FullScreen">
        <el-form :model="dynamicValidateForm" ref="dynamicValidateForm" label-width="100px" class="demo-dynamic">
            <el-form-item label="商品规格：">
                <div class="specification">
                    <div v-for="(item,index) in specifications" :key="index" class="specification-one" @mouseover="showRemoveSpe(index)" @mouseout="hideRemoveSpe(index)">
                        <i class="el-icon-circle-close-outline removeSpecification" @click="removeSpecification(index)" v-if="item.showRemoveSpecification"></i>
                        <el-form-item label="规格名：" label-width="70px" label-position="left" class="interior-item interior-item-name">
                            <el-select v-model="formInline[index].region" placeholder="请选择" style="width:150px;">
                                <el-option label="颜色" value="颜色"></el-option>
                                <el-option label="尺寸" value="尺寸"></el-option>
                                <el-option label="尺码" value="尺码"></el-option>
                                <el-option label="规格" value="规格"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="规格值：" class="interior-item">
                            <el-autocomplete
                                popper-class="my-autocomplete"
                                placeholder="请输入内容"
                                :fetch-suggestions="querySearch"
                                @blur="handleChange($event,index,domain.key)"
                                v-for="(domain) in dynamicValidateForm['domains'+index]"
                                :key="domain.key"
                                v-model="domain.value"
                                style="width:112px;margin-right:6px;">
                                <i class="el-icon-delete" slot="suffix" @click="removeDomain(index,domain.key)"></i>
                                <template slot-scope="{ item }">
                                    <div class="name" @click="handleChange($event,index,domain.key,item.value)">{{ item.value }}</div>
                                </template>
                            </el-autocomplete>
                            <el-button @click="addDomain(index)">新增规格值</el-button>
                        </el-form-item>
                    </div>
                    <el-row class="add-btn">
                        <el-button size="medium" @click="addSpecifications" :class="{noAddSpecifications:noAddSpecifications}">添加规格项目</el-button>
                    </el-row>
                </div>
            </el-form-item>
            <el-form-item label="规格明细：" v-if="specifications.length>0">
                <div class="specification specification-table">
                    <el-table
                        :data="tableData"
                        :span-method="objectSpanMethod"
                        :row-class-name="delStatu"
                        border
                        style="width: 100%; margin-top: 20px">
                        <el-table-column
                            prop="level[0].value"
                            fixed
                            :label="formInline[0].region"
                            width="100" v-if="level1.length>0">
                        </el-table-column>
                        <el-table-column
                            prop="level[1].value"
                            fixed
                            :label="formInline[1].region"
                            width="100" v-if="level2.length>0">
                        </el-table-column>
                        <el-table-column
                            prop="level[2].value"
                            :label="formInline[2].region"
                            fixed
                            width="100" v-if="level3.length>0">
                        </el-table-column>
                        <el-table-column
                            prop="amount1"
                            label="价格（元）"
                            width="150">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.amount1"></el-input>
                                <span v-show="0">
                                    <i class="price">{{'请填写信息'}}</i>
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="amount2"
                            label="库存"
                            width="150">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.amount2"></el-input>
                                <span v-show="0">
                                    <i class="price">{{'请填写信息'}}</i>
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="amount3"
                            label="规格编码"
                            width="150">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.amount3"></el-input>
                                <span v-show="0">
                                    <i class="price">{{'请填写信息'}}</i>
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="amount4"
                            label="成本价"
                            width="150">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.amount4"></el-input>
                                <span v-show="0">
                                    <i class="price">{{'请填写信息'}}</i>
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="amount5"
                            label="销量"
                            width="120">
                        </el-table-column>
                    </el-table>
                </div>
            </el-form-item>
            <!-- <el-form-item>
                <el-button type="primary" @click="submitForm('dynamicValidateForm')">提交</el-button>
                <el-button @click="resetForm('dynamicValidateForm')">重置</el-button>
            </el-form-item> -->

            <el-button @click="showTableData()">show tableData</el-button>
        </el-form>
   </div>
</template>
<script>
import { Message } from 'element-ui'
export default {
    data() {
        return {
            dynamicValidateForm: {
                domains0:[{
                    value:'',
                    key: Date.now()
                }],
                domains1:[
                    // {
                    //     value:'',
                    //     key: Date.now()
                    // }
                ],
                domains2:[
                    // {
                    //     value:'',
                    //     key: Date.now()
                    // }
                ]
            },
            formInline: [{
                user: '',
                region: ''
            },{
                user: '',
                region: ''
            },{
                user: '',
                region: ''
            }],
            state:'',
            restaurants: [],
            specifications:[],
            specificationslen:0,
            noAddSpecifications:false,
            noAddDomain:false,
            level1:[],
            level2:[],
            level3:[],
            tableData: []
        }
    },
    mounted() {
        this.restaurants = this.loadAll();
    },
    created() {
    },
    methods: {
        showTableData(){
            var ajaxData = this.tableData;
            var ajaxData_new = [];
            // var str = '';
            for(let i = 0;i<ajaxData.length;i++){
                // var strArr = [];
                var obj = {
                    productSpecs:{},
                    productPrice: 0,
                    productStock: 0,
                    formatNumber: 0,
                    costPrice: 0,
                }
                for(let j = 0;j<ajaxData[i].level.length;j++){
                    // str = '"'+ajaxData[i].level[j].table+'":"'+ajaxData[i].level[j].value+'"'
                    // strArr.push(str)
                    var this_table = ajaxData[i].level[j].table
                    obj.productSpecs[this_table] = ajaxData[i].level[j].value;
                }
                // obj.productSpecs = '{'+strArr.join(',')+'}';
                obj.productPrice = ajaxData[i].amount1;
                obj.productStock = ajaxData[i].amount2;
                obj.formatNumber = ajaxData[i].amount3;
                obj.costPrice = ajaxData[i].amount4;
                ajaxData_new.push(obj)
            }
            console.log(ajaxData_new)
            console.log(JSON.stringify(ajaxData_new))
        },
        //给table tr设置className
        delStatu({row,rowIndex}){
            // if(row.remove == '1'){
                return 'delstatu';
            // }else{
            //     return '';
            // }
        },
        //表格行合并
        objectSpanMethod({ row, column, rowIndex, columnIndex }) {//前行row、当前列column、当前行号rowIndex、当前列号columnIndex四个属性
            // console.log(row, column, rowIndex, columnIndex)
            if(this.tableData.length<=0){
                return false;
            }
            var level1len = this.level1.length;
            var level2len = this.level2.length;
            var level3len = this.level3.length;
            if (columnIndex === 0&&level3len>0) {
                if (rowIndex % (level3len*level2len) === 0) {
                    return {
                        rowspan: level3len*level2len,
                        colspan: 1
                    };
                } else {
                    return {
                        rowspan: 0,
                        colspan: 0
                    };
                }
            }else if(columnIndex === 0&&level3len === 0&&level2len>0){
                if (rowIndex % level2len === 0) {
                    return {
                        rowspan: level2len,
                        colspan: 1
                    };
                } else {
                    return {
                        rowspan: 0,
                        colspan: 0
                    };
                }
            }else if(columnIndex === 0&&level3len === 0&&level2len===0){
                return {
                    rowspan: 1,
                    colspan: 1
                };
            };
            if (level2len>0&&columnIndex === 1&&level3len>0) {
                if (rowIndex % level3len === 0) {
                    return {
                        rowspan: level3len,
                        colspan: 1
                    };
                } else {
                    return {
                        rowspan: 0,
                        colspan: 0
                    };
                }
            }else if (level2len>0&&columnIndex === 1&&level3len === 0) {
                return {
                    rowspan: 1,
                    colspan: 1
                };
            }
        },
        //显示、隐藏删除单个规格
        showRemoveSpe(index){
            this.$set(this.specifications[index],'showRemoveSpecification',true)
        },
        hideRemoveSpe(index){
            if(this.specifications[index]){
                this.$set(this.specifications[index],'showRemoveSpecification',false)
            }
        },
        //删除大类规格
        removeSpecification(index){
            this.noAddSpecifications = false;
            for(let i = index;i<this.specifications.length;i++){
                this.dynamicValidateForm['domains'+i].splice(0);
                this['level'+(i+1)] = [];
            }
            this.specifications.splice(index);
            this.formInline[index].region = '';
            this.changeTableData();
        },
        addSpecifications(){
            if(this.specifications.length>1){
                this.noAddSpecifications = true;
                if(this.specifications.length>2){
                    Message({
                        showClose: true,
                        message: '规格只能添加三个',
                        type: 'error',
                        duration: 1000
                    })
                    return ;
                }
            }

            if(this.specificationslen===0){
                this.specificationslen = 1;
            }else{
                this.specificationslen = this.specificationslen+1;
            }
            this.specifications.push({
                value:this.specificationslen,
                showRemoveSpecification:false
            })
        },
        handleChange(event,index,domain_key,item_value) {
            var this_value = '';
            if(item_value){
                this_value = item_value
                this.$set(this.dynamicValidateForm['domains'+index],'value',item_value)
            }
            if(event.target.value!=''||this_value){
                var this_level = this['level'+(index+1)]
                for(let i = 0;i<this_level.length;i++){
                    if(this_level[i].key==domain_key){
                        this.$set(this_level[i],'value',this_value?this_value:event.target.value)
                        this.changeTableData();
                        return;
                    }
                }
                switch(index){
                    case 0:
                        this.level1.push({value:this_value?this_value:event.target.value,key:domain_key});
                        break;
                    case 1:
                        this.level2.push({value:this_value?this_value:event.target.value,key:domain_key});
                        break;
                    case 2:
                        this.level3.push({value:this_value?this_value:event.target.value,key:domain_key});
                        break;
                }
                this.changeTableData();
            }
        },
        changeTableData(){
            var copy_tableData = this.tableData;
            this.tableData = [];
            if(this.level1.length>0){
                for(let i = 0;i<this.level1.length;i++){
                    var obj = {
                        level:[],
                        amount1: 0,
                        amount2: 0,
                        amount3: 0,
                        amount4: 0,
                        amount5: 0,
                    }
                    obj.level.push({
                        table:this.formInline[0].region,
                        value:this.level1[i].value,
                        key:this.level1[i].key
                    });
                    if(this.level2.length>0){
                        for(let j = 0;j<this.level2.length;j++){
                            var obj = {
                                level:[],
                                amount1: 0,
                                amount2: 0,
                                amount3: 0,
                                amount4: 0,
                                amount5: 0,
                            }
                            obj.level.push({
                                table:this.formInline[0].region,
                                value:this.level1[i].value,
                                key:this.level1[i].key
                            });
                            obj.level.push({
                                table:this.formInline[1].region,
                                value:this.level2[j].value,
                                key:this.level2[j].key
                            });
                            if(this.level3.length>0){
                                for(let n = 0;n<this.level3.length;n++){
                                    var obj = {
                                        level:[],
                                        amount1: 0,
                                        amount2: 0,
                                        amount3: 0,
                                        amount4: 0,
                                        amount5: 0,
                                    }
                                    obj.level.push({
                                        table:this.formInline[0].region,
                                        value:this.level1[i].value,
                                        key:this.level1[i].key
                                    });
                                    obj.level.push({
                                        table:this.formInline[1].region,
                                        value:this.level2[j].value,
                                        key:this.level2[j].key
                                    });
                                    obj.level.push({
                                        table:this.formInline[2].region,
                                        value:this.level3[n].value,
                                        key:this.level3[n].key
                                    });
                                    this.tableData.push(obj);
                                }
                            }else{
                                this.tableData.push(obj);
                            }
                        }
                    }else{
                        this.tableData.push(obj);
                    }
                }
            }
        },
        querySearch(queryString, cb) {
            var restaurants = this.restaurants;
            var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
            // 调用 callback 返回建议列表的数据
            cb(results);
        },
        createFilter(queryString) {
            return (restaurant) => {
                return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
            };
        },
        loadAll() {
            return [
                { "value": "aa", "address": "11" },
                { "value": "bb", "address": "22" },
                { "value": "cc", "address": "33" },
                { "value": "dd", "address": "44" },
                { "value": "ee", "address": "55" },
                { "value": "ff", "address": "66" },
                { "value": "gg", "address": "77" }
            ];
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    alert('submit!');
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
        //删除单个规格值
        removeDomain(index,domain_key) {
            if (index !== -1) {
                var this_level = this['level'+(index+1)]
                var this_dynam = this.dynamicValidateForm['domains'+index]
                for(let i = 0;i<this_level.length;i++){
                    if(this_level[i].key==domain_key){
                        this['level'+(index+1)].splice(i)
                        // this.changeTableData();
                    }
                }
                for(let i = 0;i<this_dynam.length;i++){
                    if(this_dynam[i].key==domain_key){
                        this.dynamicValidateForm['domains'+index].splice(i)
                        // this.changeTableData();
                    }
                }
                if(this.dynamicValidateForm['domains'+index].length<1){
                    this.specifications.splice(index)
                    this.formInline[index].region = ''
                }
                this.changeTableData();
            }
        },
        addDomain(index) {
            if(this.dynamicValidateForm['domains'+index].length>2){
                Message({
                    showClose: true,
                    message: '规格值只能添加三个',
                    type: 'error',
                    duration: 1000
                })
                return ;
            }
            this.dynamicValidateForm['domains'+index].push({
                value: '',
                key: Date.now()
            });
        }
    },
    watch: {
        formInline:{
            handler:function(val,oldVal){
                console.log(val)
                this.changeTableData();
            },
            deep:true
        }
    },
    computed: {
    },
    components: {
    },
}
</script>
<style lang="scss" scoped>
#FullScreen {
    padding: 20px 0px;
//    background-color: #eee;
}
.el-form-item{
    margin: 10px 12px;
}
.interior-item{
    margin-left: 0;
}
.interior-item-name{
    padding: 7px 10px;
    background-color: #f8f8f8;
    margin-left: 20px;
}
.specification{
    border: 1px solid #e5e5e5;
}
.my-autocomplete {
  li {
    line-height: normal;
    padding: 7px;

    .name {
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .addr {
      font-size: 12px;
      color: #b4b4b4;
    }

    .highlighted .addr {
      color: #ddd;
    }
  }
}
.add-btn{
    margin-left: 20px;
    margin-right: 20px;
    padding: 7px 10px;
    background-color: #f8f8f8;
}
.specification{
    padding: 10px 0;
}
.specification-table{
    padding: 10px 20px;
}
.specification-one{
    position: relative;
}
.removeSpecification{
    position: absolute;
    right: 30px;
    top: 20px;
    z-index: 9;
    cursor: pointer;
}
.noAddSpecifications{
    cursor: no-drop;
}
.specification .el-table{
    box-sizing: border-box;
    .cell{
        text-align: center;
    }
}
.secondLevel{
    padding: 6px 0;
}
.el-table .delstatu{
    background: #fff;
}
.el-table .el-table__body .delstatu:hover>td{
    background-color: #fff !important;
}
.price{
    color: #f56c6c;
}
</style>

const regions = require('../../../assets/json/region-area/region.json')
const provinces =  require('../js/mydata.js')
function getProvince(){
    regions.forEach((list,index)=>{
        list.children = [];
        for(var item in provinces.default.obj){
            if(provinces.default.obj[item].code.toString().substring(0,1) == list.code){
                list.children.push(provinces.default.obj[item])
            }
        }
    })
    return regions
}
export default { 
    getProvince,
};
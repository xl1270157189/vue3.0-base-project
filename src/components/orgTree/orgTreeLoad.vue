<template>
  <el-select :value='valueTitle' :clearable='clearable' @clear='clearHandle' filterable  :filter-method="remoteMethod" placeholder="全部" >
    <el-option :value='valueTitle' :label='valueTitle'>
      <el-tree
        ref='selectTree'
        :accordion='accordion'
        :props='props'
        :node-key='props.value'
        :default-expanded-keys='defaultExpandedKey'
        @node-click='handleNodeClick'
        :filter-node-method="filterNode"
        :load="loadNode"
        lazy>
      </el-tree>
    </el-option>
  </el-select>
</template>
<script>
    import { mapState } from 'vuex'
export default {
  name: 'orgTree',
  props:{
    props:{
      type: Object,
      default:()=>{
        return {
          value:'id',             // ID字段名
          label: 'name',         // 显示名称
          children: 'children',    // 子级字段名
          isLeaf: 'isLeaf',
          parentId: 'parentId',
        }
      }
    },
      /* 可清空选项 */
      clearable:{
          type:Boolean,
          default:()=>{ return true }
      },
      /* 自动收起 */
      accordion:{
        type:Boolean,
        default:()=>{ return true }
      },
      // 所属机构
      isOrg:{
          type:Boolean,
          default:()=>{ return false }
      },
      // 台区设备
      isTq:{
         type:Boolean,
        default:()=>{ return false }
      },
      // 是否加载第二级数据
      isNodeChild:{
          type:Boolean,
          default:()=>{ return true }
      },
      // 是否加载设备数据
      isNodeDevice:{
          type:Boolean,
          default:()=>{ return true }
      },
      // 是否是首页加载数据
      isHome:{
          type:Boolean,
          default:()=>{ return false }
      },
      // 是否是加载采集器这一级数据
      isCollector:{
          type:Boolean,
          default:()=>{ return true }
      },


      // 气象城市
      isWeatherCity:{
          type:Boolean,
          default:()=>{ return false }
      },

      // 是否是topo页面
      isToPo:{
          type:Boolean,
          default:()=>{ return false }
      }

  },

  data() {
    return {
        valueId:this.value,    // 初始值
        valueTitle:'',
        defaultExpandedKey:[] ,
        node:null,
        treeNode:null,
        treeResolve:null,

    }
  },
  mounted(){

  },
  watch:{
      $route: {
          immediate:true, // 立刻执行
          handler: function(val, oldVal){
              if (this.treeNode !== null) {
                  this.treeNode.childNodes = [];
                  this.loadNode(this.treeNode,this.treeResolve)
              }
          },
      }
  },
    computed: {
        ...mapState({
//            orgInFor: state => state.common.orgInFor,
//            tqDeviceInFor: state => state.common.tqDeviceInFor,
//            weatherCityInFor: state => state.common.weatherCityInFor,
        }),

    },
  methods: {
      // 搜索框变化触发
      remoteMethod(val){
        this.$refs.selectTree.filter(val);
      },
      filterNode(value, data) {
          if (!value) return true;
          return data.name.indexOf(value) !== -1;
      },

      // 初始化值
      initHandle(){

      },

      // 切换选项
      handleNodeClick(node){
          if (this.isToPo){
              if(this.$filters.KeyNotNull(node.id)){
                  this.valueTitle = node[this.props.label];
                  this.valueId = node[this.props.value];
                  this.$emit('getNode',node);
                  this.defaultExpandedKey = []
              }else {
                  this.valueTitle = '';
                  this.valueId = '';
                  this.$emit('getNode',node);
                  this.defaultExpandedKey = []
              }
          }else{
              this.valueTitle = node[this.props.label];
              this.valueId = node[this.props.value];
              this.$emit('getNode',node);
              this.defaultExpandedKey = []
          }
      },
      // 清除选中
      clearHandle(){
        this.valueTitle = '';
        this.valueId = null;
        this.defaultExpandedKey = [];
        this.clearSelected();
        this.remoteMethod('');
        this.$emit('getNode',null);
      },
      /* 清空选中样式 */
      clearSelected(){
        let allNode = document.querySelectorAll('#tree-option .el-tree-node')
        allNode.forEach((element)=>element.classList.remove('is-current'))
      },

      // 加载 树数据
      loadNode(node, resolve) {
        let that = this;
        that.node=node;
        if (node.level === 0) {
            that.treeNode = node;
            that.treeResolve = resolve;
            that.loadtreeData(resolve);
        }
        if (this.isNodeChild){
            if (node.level >= 1) {
                this.getChildByList(node.data, resolve);
                return resolve([]); // 加上这个，防止在该节点没有子节点时一直转圈的问题发生。
            }
        }else{
            return resolve([]);
        }
      },

      // 获取第一级
      loadtreeData(resolve) {      // 获取loadtreeData 就是父节点数据，getChildByList就是异步获取子节点数据
          let data = null;
          if (this.isOrg) {
            this.getOrgInFor(resolve);
          } else if (this.isTq) {

          } else if (this.isWeatherCity) {

          }
      },
      // 获取下一级
      getChildByList( nodeData,resolve) {     // 获取子节点请求
      let _this = this;
      let body = {};
      this.isNodeChild = true;
      if (this.isOrg) {
          body.parentId = nodeData.id;
          _this.$api.common.getOrgInfor(body).then(function (res) {
              if (res.code === '00000') {
                  let data = res.data;
                  data.forEach(item => {
                      item.label = item.name;
                      item.parentId = item.parentId;
                      item.value = item.id;
                      item.isLeaf = false;
                  });
                  resolve(data);
              }else {
                  return false;
              }
          });
      } else if (this.isTq){
          let isLeaf = false;
          if (!this.$filters.KeyNotNull(nodeData.id)){
              body.orgNo = nodeData.parentId;
          }else {
              body.parentId = nodeData.id;
          }
          if (nodeData.type === 'DISTRICT_OFFICE'){
              if (!this.isCollector) {
                  body = {};
                  body.type = 'GROUP';
                  body.monitorId = nodeData.id;
              }
          }
          if (this.isNodeDevice) {
              isLeaf = true
          }
          _this.$api.common.getTqDeviceData(body).then(function (res) {
              if (res.code === '00000') {
                  let data = res.data;
                  data.forEach(item => {
                      item.label = item.name;
                      item.parentId = item.parentId;
                      item.value = item.id;
                      item.isLeaf = isLeaf;
                  });
                  resolve(data);
              }else {
                  return false;
              }
          });
      } else if (this.isWeatherCity){
          body.type = 2;
          body.parentName = nodeData.name;
          _this.$api.common.getAreaData(body).then(function (res) {
              if (res.code === '00000') {
                  let data = res.data;
                  data.forEach(item => {
                      item.label = item.chinsesname;
                      item.name = item.chinsesname;
                      item.parentId = item.chinsesname;
                      item.id = item.chinsesname;
                      item.value = item.citycode;
                      item.isLeaf = true;
                  });
                  resolve(data);
              }else {
                  return false;
              }
          });
      }

    },

      // 设置默认值 (nodeInFor 需要设置的默认值信息  type (equipmentFiles 设备档案管理页面 初始化设置默认值 并加载列表数据))
      setNodeVaule(nodeInFor,type){
          this.valueId = nodeInFor[1];
          this.valueTitle = nodeInFor[0];
          this.$nextTick(()=>{
              let scrollWrap = document.querySelectorAll('.el-scrollbar .el-select-dropdown__wrap')[0]
              let scrollBar = document.querySelectorAll('.el-scrollbar .el-scrollbar__bar')
              if(scrollWrap){
                  scrollWrap.style.cssText = 'margin: 0px; max-height: none; overflow: hidden;'
              }
              scrollBar.forEach(ele => ele.style.width = 0)
          });
          if (type === 'equipmentFiles'){
              this.$parent.$options.parent.getData();
          } else if (type === 'home'){
              this.$parent.getData();
          } else if (type === 'topo'){
              if (nodeInFor[1] !== ''){
                  this.$parent.$options.parent.refreshTopoInfo();
              }
          }
      },

      // 获取电站数据
      getOrgInFor(){
        let _this = this;
        let body = {

        };
        _this.$api.common.getOrgInfor(body).then(function (res) {
          if (res.code === '00000') {
            let list = res.data;

            let isLeaf = false;
            if (!this.isNodeChild) {
              isLeaf = true
            }

            //        // 前者item.参数名称为 prop中的规定的属性名称
            list.forEach(item => {
              item.label = item.name;
              item.parentId = item.parentId;
              item.value = item.id?item.id:item.orgNo;
              item.isLeaf = isLeaf;
            });
            resolve(data)
          }
        });









      },
  },
};
</script>
<style scoped type='text/css'>
@import './index.css';
</style>

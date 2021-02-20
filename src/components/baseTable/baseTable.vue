<!--公用表格-->
<template>
  <div>
    <el-table
      v-if="showTable"
      :data='tableData'
      border
      :ref="tableRef"
      :style='tableStyle'
      @header-dragend="changeColWidth"
      :header-cell-style="{background:'url(/static/images/device/jj_biaoti@2x.png)',color:'rgba(19,247,255,1)'}"
      :row-class-name='tabRowClassName'
      :height="height">
      <template v-if="tableCol.length > 0" v-for="(col) in tableCol">
        <el-table-column v-if="col.type === 'selection' " type='selection' :min-width="col.width"  :selectable="selectTable"></el-table-column>
        <el-table-column v-if="col.type === '序号' " :label="col.label" :min-width="col.width"  :show-overflow-tooltip="true">
          <template slot-scope="scope">
            {{(page.currentPage - 1) * page.pageSize + scope.$index + 1}}
          </template>
        </el-table-column>
        <el-table-column v-if="col.type === undefined && col.Vif " :prop="col.value" :label="col.label" :min-width="col.width" :show-overflow-tooltip="true" :formatter="col.formatter"></el-table-column>
        <el-table-column v-if="col.type === '操作' " :label="col.label" :min-width="col.width" fixed="right">
          <template slot-scope='scope'>
            <el-button v-if="col.tButton.length > 0" v-for="(tButton) in col.tButton" v-bind:key="tButton.tName"
              :class="tButton.tClass"
              :size="tButton.tSize"
              v-show="tButton.showTableButton(scope.$index, scope.row)"
              @click="tButton.tClick(scope.$index, scope.row)">{{tButton.tName}}
            </el-button>
          </template>
        </el-table-column>
      </template>
    </el-table>
    <div class="table-page" v-if="showPage">
      <el-pagination
        small
        @size-change=page.handleSizeChange
        @current-change=page.handleCurrentChange
        :current-page.sync="page.currentPage"
        :page-size="page.pageSize"
        :pager-count="page.pagerCount"
        :page-sizes="[10, 20, 40, 60 , 80 , 100 , 200 , 1000]"
        layout='total, sizes,prev, pager, next,jumper'
        :total="page.total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  // value 对于的字段名  label 显示表头 Vif 是否显示  formatter 方法名
//  {value: 'updateTime', label: '执行时间',Vif:'true',formatter:this.updateTimeData},
//  {value: '', label: '操作',type:'操作',
//    tButton:[
  // tClass 按钮class tClick 按钮点击事件对应方法 tName 按钮显示名称 showTableButton 是否显示按钮
//    {tClass:'table-button-blue table-button-blue-small',tSize:"small",tClick:this.copyThrough,tName:'查看详情',showTableButton:this.showTableButton}
//  ]
//  },
  export default {
    name: 'baseTable',
    props:{
      // 表格数据
      tableData:{
        type: Array,
        default: ()=>{ return null }
      },
      // 是否显示表格
      showTable:{
        type: Boolean,
        default: ()=>{ return null }
      },
      // 是否显示分页
      showPage:{
        type: Boolean,
        default: ()=>{ return null }
      },
      // 分页
      page:{
        page: {
          // 当前页
          currentPage: 1,
          pageSize: 20,
          // 分页大于3页是折叠分页
          pagerCount: 5,
          // 总条数
          total: 0,
          // 有多少页
          pageCount: 0
        },
      },
      // 表头
      tableCol:{
        type: Array,
        default: ()=>{ return null }
      },
      // 表格高度
      tableHeight:{
        type: String,
        default: ()=>{ return null }
      },
      // 表格样式
      tableStyle:{
        type: String,
        default: ()=>{ return null }
      },
      // 表格ref
      tableRef:{
        type:String,
        default: ()=>{ return null }
      },
      // 表头
      tabRowClassName:{
        type: Function,
        default: ()=>{ return null }
      },
    },

    data() {
      return {

      }
    },
    mounted(){
      this.initHandle();
      window.onresize = () => {
        this.setDoLayout()
      }
    },
    watch:{

    },
    computed: {
      height() {
        return this.$baseTableHeight()
      },
    },
    methods: {
      // 初始化值
      initHandle () {

      },

      //获取表格多选
      getTableSelect(){
        return this.$refs[`${this.tableRef}`].selection
      },
      //表格对应列是否多选
      selectTable(row){
        return true
      },
      // 重新加载表格 防止表格错位
      setDoLayout(){
        this.$nextTick(()=>{
          this.$refs[`${this.tableRef}`].doLayout()
        })
      },
      // 改变表格宽度时触发事件
      changeColWidth(newWidth, oldWidth, column, event){
          this.setDoLayout();
      }
    }
  };
</script>

<style scoped type='text/css'>
  @import './baseTable.css';
</style>

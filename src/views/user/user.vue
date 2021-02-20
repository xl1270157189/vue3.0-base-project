<template>
  <div class="table-container">
    <vab-query-form>
      <vab-query-form-top-panel>
        <el-form
          ref="form"
          :model="queryForm"
          :inline="true"
          @submit.native.prevent
        >
          <el-form-item>
            <el-input v-model="queryForm.no" placeholder="编号" />
          </el-form-item>
          <el-form-item>
            <el-input v-model="queryForm.name" placeholder="名称" />
          </el-form-item>
          <el-form-item>
            <el-button
              icon="el-icon-search"
              type="primary"
              native-type="submit"
              @click="search"
            >
              查询
            </el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-top-panel>
      <vab-query-form-top-panel>
        <el-button icon="el-icon-plus" type="primary" @click="addUser()">
          添加
        </el-button>
      </vab-query-form-top-panel>
    </vab-query-form>
    <base-table
      ref="baseTable"
      :tableData="tableData"
      :tableCol="tableCol"
      :showTable="true"
      :showPage="true"
      :page="page"
      :tableRef="'multipleTable'">
    </base-table>
    <add-user ref="addUser"></add-user>
  </div>
</template>

<script>
  import baseTable from '@/components/baseTable/baseTable'
  import orgTreeLoad from '@/components/orgTree/orgTreeLoad'
  import addUser from './addUser'
  import {returnTrue} from '@/utils/validate'
  export default {
    name: 'user',
    components: {baseTable,orgTreeLoad,addUser},
    data() {
      return {
        queryForm:{
          no:'', // 编号
          name:'', // 名称
          type:'', // 类型
        },
        deviceTypeOptions:[],
        tableData:[],
        tableCol:[
          {value: '', label: '',type:'selection',Vif:'true',width:'60'},
          {value: '', label: '序号',Vif:'true',type:'序号',width:'60'},
          {value: 'id', label: '编号',Vif:'true',width:'120'},
          {value: 'name', label: '名称',Vif:'true',width:'150'},
          {value: 'sex', label: '性别',Vif:'true',width:'150',formatter:this.sexData},
          {value: 'phoneNumber', label: '手机号码',Vif:'true',width:'120'},
          {value: '', label: '操作',type:'操作',width:'200',
            tButton:[
              {tClass:'table-button-yellow',tSize:"mini",tClick:this.updateUser,tName:'编辑',showTableButton:returnTrue},
              {tClass:'table-button-red',tSize:"mini",tClick:this.deleteUser,tName:'删除',showTableButton:returnTrue},
            ]
          },
        ],
        page: {
          // 当前页
          currentPage: 1,
          pageSize: 20,
          // 分页大于3页是折叠分页
          pagerCount: 5,
          // 总条数
          total: 0,
          // 有多少页
          pageCount: 0,
          handleSizeChange:this.handleSizeChange,
          handleCurrentChange:this.handleCurrentChange
        },
      }
    },
    computed: {

    },
    created() {

    },
    mounted() {
      this.getData()
    },
    methods: {
      // 获取数据
      getData(){
        let _this = this;
        let body = {

        };
        _this.$api.user.getUserData(body).then(function (res) {
          if (res.code === '00000') {
            console.log(res);
            // TODO 这里加查询的逻辑代码
            let list = [
              {"id":'1',"name":'1111','sex':'0',"phoneNumber":"18896019750"},
              {"id":'2',"name":'2222','sex':'1',"phoneNumber":"18896019750"},
              {"id":'3',"name":'3333','sex':'1',"phoneNumber":"18896019750"},
            ];
            _this.page.total = list.length;
            _this.tableData = list
          }else {
            _this.$message.error('数据查询错误')
          }
        });
      },
      // 搜索
      search(){
        this.page.currentPage = 1;
        this.getData()
      },
      // 分页
      handleSizeChange (val) {
        this.page.pageSize = val;
        this.getData()
      },
      handleCurrentChange (val) {
        this.page.currentPage = val;
        this.getData()
      },
      // 添加
      addUser(){
        this.$nextTick(function(){ // 防止子组件为加载完成
          let _this=this;
          _this.$refs.addUser.initialize(); // 调用子组件查询接口
        })
      },
      // 修改
      updateUser(index,row){
        this.$nextTick(function(){ // 防止子组件为加载完成
          let _this=this;
          _this.$refs.addUser.initialize(row); // 调用子组件查询接口
        })
      },
      // 删除
      deleteUser(){

      },
      // 性别转换
      sexData(row, column, cellValue){
        let content = '';
        if (cellValue === '0'){
          content = '男'
        } else if(cellValue === '1'){
          content = '女'
        }else{
          content = '未知'
        }
        return content
      },
    },
  }
</script>

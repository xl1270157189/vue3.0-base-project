<!--新增用户-->
<template>
  <div>
    <el-dialog
      :title="title"
      top="5%"
      width="40%"
      custom-class="dialog-class"
      :modal-append-to-body="true"
      :visible.sync="showAddUser"
      :before-close="beforeClose"
      center>
      <el-form :inline="true" ref="user" :model="user" :rules="rules" label-width="100px" class="popup-form">
        <el-form-item label="姓名" prop="name">
          <el-input v-model.trim="user.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select v-model="user.sex" autocomplete="off">
            <el-option
              v-for="item in sexOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="手机号码" prop="phoneNumber">
          <el-input v-model.trim="user.phoneNumber" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="beforeClose">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>
  import {isPhone} from '@/utils/validate'
  export default {
    name: 'addUser',
    data() {
      const validatePhone = (rule, value, callback) => {
        if (!isPhone(value)) {
          callback(new Error('请输入正确的手机号'))
        } else {
          callback()
        }
      };
      return {
        title:'', // 标题
        showAddUser:false, // 是否显示
        user:{
          id:'',
          name:'', // 姓名
          sex:'', // 性别
          phoneNumber:'', // 电话号码
        },
        sexOptions:[
          {value: "0", label: '男'},
          {value: "1", label: '女'},
        ],
        rules: {
          name: [{ required: true, trigger: 'blur', message: '请输入姓名' }],
          sex: [{ required: true, trigger: 'change', message: '请选择性别' }],
          phoneNumber: [
            { required: true, trigger: 'blur', message: '请输入手机号码' },
            { validator: validatePhone, trigger: 'blur' },
          ],
        },
      }
    },
    mounted(){

    },
    watch:{

    },
    components: {},
    methods: {
      // 初始化值
      initialize(row) {
        this.showAddUser = true;
        if (row === undefined){
          this.title = '新增用户';
        }else{
          this.title = '修改用户';
          this.user = Object.assign({}, row)
        }
      },
      // 关闭
      beforeClose(){
        this.$refs.user.resetFields(); // 对整个表单进行重置，将所有字段值重置为初始值并移除校验结果
        this.showAddUser = false
      },
      //确认
      save(){
        let _this = this;
        _this.$refs['user'].validate(async (valid) => {
          if (valid) {
            // TODO 这里加确认添加修改代码


            _this.beforeClose()
          } else {
            return false
          }
        })
      }

    }
  };
</script>
<style scoped lang="scss">

</style>

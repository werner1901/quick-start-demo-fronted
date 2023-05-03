<template>
  <el-dialog :visible.sync="isVisible" width="80%">
    <el-form :model="userDTO" ref="userForm" :rules="rules">
      <el-form-item label="身份证" prop="citizenId">
        <el-input v-model="userDTO.citizenId" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input v-model="userDTO.name" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="生日">
        <div class="block">
          <el-date-picker
            v-model="userDTO.birthday"
            type="date"
            placeholder="选择日期"
          >
          </el-date-picker>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleCancelEvent">取消</el-button>
        <el-button type="primary" @click="handleOkEvent('userForm')"
          >确定</el-button
        >
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { add, update, findById } from "@/api/user";
export default {
  name: "UserDialog",
  /*
   *定义对话框扩展属性
   */
  props: {
    dialogType: String,
  },
  data() {
    return {
      /**
       * 控制显示
       */
      isVisible: false,

      /**
       *  增删改接口向后端传送需要的对象，后端某一些接口也返回该类型的对象
       */
      userDTO: { id: null, name: "", citizenId: "", birthday: null },
      rules: {
        name: [
          { required: true, message: "请输入名字", trigger: "blur" },
          {
            min: 3,
            max: 32,
            message: "长度在 3 到 32 个字符",
            trigger: "blur",
          },
        ],
        citizenId: [
          { required: true, message: "输入身份证id", trigger: "blur" },
          {
            len:18, message:"请输入正确身份证", trigger:"blur"
          }
        ],
      },
    };
  },
  /**
   * 发起后端数据请求传送id返回UserVO
   */
  created() {
    this.userDTO = {};
  },
  /**
   * 做一些和界面相关的初始化的工作
   */
  mounted() {
    this.initUi();
  },
  methods: {
    refreshPage(){
      this.$emit('handleUserSearch');;
    },
    /**********************************************/
    //        以下开始界面处理方法
    /**********************************************/

    /**
     * 处理 ok 事件需要特别对话框的属性判断是增加还是更新
     */
    handleOkEvent(form) {
      // 校验没通过不允许提交
      debugger;
      if (
        this.$refs[form].validate((valid) => {
          if (valid) {
            // 如果是增加这提交界面元素，其他后台补充， 修改者则依据界面更新否则
            if (this.dialogType === "ADD") {
              this.insertUser(this.userDTO);
            } else if (this.dialogType === "EDIT") {
              this.updateUser(this.userDTO);
            }
          } else {
            return false;
          }
        })
      );
    },
    /**
     *  关闭对话框
     */
    handleCancelEvent() {
      this.isVisible = false;
    },

    /**********************************************/
    //        以下方法为业务处理方法
    /**********************************************/

    /**
     * 通过方法传递对象到该对话框
     * @param id 增加或者修改的时候传递到当前行的数据
     */
    loadRowDataById(id) {
      if (id == null || id == "" || id == undefined) {
        throw new Error("传递参数异常");
      }
      // 从后端加载数据现在在界面上 主要包含id和version
      debugger;
      this.findUserById(id);
      this.$refs.userForm.resetFields();
    },
    /**
     * 显示
     */
    onShow() {
      this.initUi();
      this.isVisible = true;
      this.$refs.userForm.resetFields();
    },

    /**
     * 数据初始化
     */
    initUi() {
      this.userDTO = {};
    },
    /**
     * 隐藏
     */
    // onHide() {
    //   this.isVisible = false;
    // },

    /**
     * 处于添加模式下的更新
     */
    insertUser(userDTO) {
      /**
       * 调用api接口更新
       */
      add({...userDTO,created_by:1,updated_by:0})
        .then((commonResposne) => {
          this.$message.success(commonResposne.head.$message);
          if (commonResposne.head.code === "0") {
            this.isVisible = false;
          } else {
            this.$message.warning(commonResposne.head.$message);
            this.isVisible = true;
          }
          // 调用父组件方法刷新纪录
        })
        .catch((err) => {
          this.$$message.warning("增加用户发生异常,err:" + err);
        });
    },

    /**
     * 更新后端的用户信息，用于修改业务
     */
    updateUser(userDTO) {
      /**
       * 调用api接口更新
       */
      update({...userDTO,created_by:0})
        .then((commonResposne) => {
          if (commonResposne.head.code === "0") {
            // this.$message.success(commonResposne.head.$message);
            this.$message({
              message: '编辑成功',
              type: 'success'
            });
            this.isVisible = false;
            this.refreshPage();
          } else {
            this.$message({
              message: commonResposne.head.message,
              type: 'warning'
            });
            this.isVisible = true
            // this.$message.warning(commonResposne.head.$message);
          }
          // 调用父组件方法刷新纪录
        })
        .catch((err) => {
          this.$message.warning("增加用户发生异常,err:" + err);
        });
    },
    /**
     * 在页面created的时候加载根据id加载后端的用户信息
     */
    findUserById(id) {
      findById(id).then((commonResponse) => {
        this.userDTO = commonResponse.body;
        this.isVisible = true;
      });
    },
  },
};
</script>

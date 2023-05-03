<template>
  <el-container>
    <el-header>
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="姓名:">
          <el-input
            v-model="userQuery.name"
            placeholder="输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item label="身份证:">
          <el-input
            v-model="userQuery.citizenId"
            placeholder="输入身份证"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleUserSearch">查询</el-button>
        </el-form-item>
      </el-form>
    </el-header>
    <el-main>
      <!--顶部操作栏-->
      <div>
        <el-button type="primary" @click="handleAddUser">增加</el-button>
        <el-button type="warning" @click="handleBatchDelete">删除</el-button>
      </div>
      <el-table
        id="userTable"
        ref="userTable"
        :data="userDTOList"
        :empty-text="nothing"
        @row-dblclick="handleRowDoubleClick"
      >
        <el-table-column align="center" width="40" type="selection" />
        <el-table-column
          prop="id"
          label="序号"
          width="60"
          stripe="true"
          highlight-current-row="true"
        >
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column prop="citizenId" label="身份证号" width="180">
        </el-table-column>
        <el-table-column prop="name" label="姓名"> </el-table-column>
        <el-table-column prop="birthday" label="生日" :formatter="dateFormat">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <div>
              <el-button
                id="btnEdit"
                icon="icon-label-edit"
                size="mini"
                @click="handleRowEdit(scope.row)"
                >编辑</el-button
              >
              <el-button
                id="btnDelete"
                size="mini"
                icon="icon-label-delete"
                type="danger"
                @click="handleRowDelete(scope.row)"
                >删除</el-button
              >
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage1"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pagination.pageSize"
        layout="total, prev, pager, next"
        :total="pagination.total"
      >
      </el-pagination>

      <UserDialog ref="AddUserDialog" dialogType="ADD" @handleUserSearch="handleUserSearch"/>
      <UserDialog ref="EditUserDialog" dialogType="EDIT" @handleUserSearch="handleUserSearch"/>
    </el-main>

    <el-footer> 这里是网站的页脚 </el-footer>
  </el-container>
</template>

<style>
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
</style>

<script>
import moment from "moment";
import { search, batchRemove } from "@/api/user";
import UserDialog from "./user-dialog";

export default {
  name: "UserManage",
  components: { UserDialog },
  data() {
    return {
      currentPage1: 1,
      /**
       * 展示表格数据
       */
      userDTOList: [{ name: "", citizenId: "", birthday: "", version: "" }],
      /**
       * 查询条件
       */
      userQuery: {},
      /**
       * 接收后端的请求接口返回的用户信息
       */
      userVO: {},
      /**
       *  增删改接口向后端传送需要的对象，后端某一些接口也返回该类型的对象
       */
      userDTO: {},
      /**
       * 分页数据
       */
      pagination: { pageSize: 0, pageIndex: 0, total: 0 },

      dialogVisible: false,
      nothing:'暂无数据'
    };
  },
  /**
   * 发起后端数据请求
   */
  created() {
    this.userDTOList = [];
  },
  /**
   * 做一些和界面相关的初始化的工作
   */
  mounted() {
    this.handleUserSearch()
  },
  methods: {

    dateFormat(row, column) {
    let date = row[column.property];
    console.log(moment(date).format("YYYY-MM-DD"));
    // debugger;
    return moment(date).utcOffset(480).format("YYYY-MM-DD");
  },
    /**
     * 页记录数改变
     */
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.userQuery.pageIndex = this.pagination.pageIndex;
      this.userQuery.pageSize = val;
      this.searchUserList(this.userQuery);
    },
    /**
     * 当前页改变
     */
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.userQuery.pageIndex = val;
      this.userQuery.pageSize = 20;
      this.searchUserList(this.userQuery);
    },

    /**
     * 处理查询按钮点击
     */
    handleUserSearch() {
      this.userQuery.pageIndex = this.currentPage1;
      this.userQuery.pageSize = 20;
      this.searchUserList(this.userQuery);
    },

    /**
     * 增加按钮点击的处理
     */
    handleAddUser() {
      //loadRowDataById
      this.$nextTick(() => {
        //debugger
        this.$refs.AddUserDialog.onShow();
      });
    },

    /**
     * 批量删除按钮点击
     */
    handleBatchDelete() {
      let selectedRows = this.$refs.userTable.selection;
      console.log(selectedRows);
      if (selectedRows == null || selectedRows.length === 0) {
        this.$message.error("至少选择一行数据进行操作");
        return;
      }
      this.$confirm("确定删除记录吗?").then((result) => {
        const idVersions = [];
        if (result) {
          for (let i = 0; i < selectedRows.length; i++) {
            idVersions.push({
              id: selectedRows[i].id,
              version: selectedRows[i].version,
            });
          }
          console.log(idVersions);
          // debugger;
          batchRemove(idVersions)
            .then((commonResponse) => {
              if (commonResponse.body == true) {
                this.$message({
                  message: '已删除',
                  type: 'success'
                });
              } else {
                this.$message.error(commonResponse.head.message);
              }

              // 刷新界面
              this.handleUserSearch();
            })
            .catch((err) => {
              this.$message.error("发生错误:" + err);
              this.handleUserSearch();
            });
        }
      });
    },

    /**
     * 处理行编辑
     * @param index
     * @param row
     */
    handleRowEdit(row) {
      this.$nextTick(() => {
        // 加载了UserDto 到dialog内部
        this.$refs.EditUserDialog.loadRowDataById(row.id);
      });
    },
    /**
     * 处理行删除
     * @param index
     * @param row
     */
    handleRowDelete(row) {
      this.$confirm("确定删除?").then((result) => {
        if (result) {
          console.log(row)
          // 根据id和版本匹配删除
          batchRemove([{id:row.id, version:row.version}])
            .then((commonResponse) => {
              if (commonResponse.body) {
                // this.$message.success('已删除')
                // this.$message.success(commonResponse.head.$message);
                this.$message({
                  message: '已删除',
                  type: 'success'
                });
                this.handleUserSearch();
              } else {
                this.$message.error(
                  "发生错误: " + commonResponse.head.$message
                );
              }
            })
            .catch((err) => {
              // 可能是发生网络异常
              this.$message.error("发生错误:" + err);
            });
        }
      });
    },
    /**
     * @description: 行双击触发编辑方便用户操作
     * @param {*} row 行
     */
    handleRowDoubleClick(row) {
      this.$nextTick(() => {
        // 加载了UserDto 到dialog内部
        this.$refs.EditUserDialog.loadRowDataById(row.id);
      });
    },
    /******************************************************
     * 以下开始处理界面调用的逻辑方法
     * ************************************************** */

    /**
     * 接收查询条件处理查询
     */
    searchUserList(userQuery) {
      search(userQuery)
        .then((commonResponse) => {
          if (
            commonResponse == null ||
            commonResponse == "undefine" ||
            commonResponse.body == null ||
            commonResponse.body.data == null
          ) {
            console.log("backgroud return null");
          } else {
            //response 为 commonPage 包含 body 和 页面分页信息
            this.userDTOList = commonResponse.body.data;
            // debugger;
            //绑定分页组件需要的数据
            this.pagination.pageSize = commonResponse.body.pageSize;
            this.pagination.pageIndex = commonResponse.body.pageIndex;
            this.pagination.total = commonResponse.body.total;
          }
        })
        .catch((err) => this.$message.error("错误信息:" + err));
    },
  },
  /**
   * 格式化时间
   */
  // dateFormat(row, column) {
  //   let date = row[column.property];
  //   // console.log(moment(date).format("YYYY-MM-DD"));
  //   // debugger;
  //   return moment(date).utcOffset(480).format("YYYY-MM-DD");
  // },
};
</script>

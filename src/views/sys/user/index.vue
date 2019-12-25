<template>
  <d2-container>
    <template slot="header">
      <el-form :inline="true" :model="searchForm" ref="searchForm" size="mini" style="margin-bottom: -18px;">
        <el-form-item label="账号" prop="userAccount">
          <el-input v-model="searchForm.userAccount" placeholder="请输入账号" style="width: 100px;" />
        </el-form-item>

        <el-form-item label="用户名" prop="userName">
          <el-input v-model="searchForm.userName" placeholder="请输入用户名" style="width: 120px;" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearchFormSubmit">
            <d2-icon name="search" /> 查询
          </el-button>
        </el-form-item>

        <el-form-item>
          <el-button @click="handleSearchFormReset">
            <d2-icon name="refresh" /> 重置
          </el-button>
        </el-form-item>
      </el-form>
    </template>
    <el-button type="primary" size="mini" icon="el-icon-circle-plus" @click="add">
      新增
    </el-button>
    <el-button v-if="multipleSelection.length>0" type="danger" size="mini" icon="el-icon-delete" @click="batchDel">
      删除
    </el-button>
    <el-table :data="tableData" v-loading="loading" size="small" stripe highlight-current-row style="width: 100%;" @selection-change="handleSelectionChange" @sort-change="handleSortChange">

      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column label="账号名称" prop="userAccount" sortable="custom">
        <template slot-scope="scope">
          {{scope.row.userAccount}}
        </template>
      </el-table-column>

      <el-table-column label="用户名称" prop="userName" sortable="custom" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          {{scope.row.userName}}
        </template>
      </el-table-column>
      <el-table-column label="邮箱" prop="email" sortable="custom" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          {{scope.row.email}}
        </template>
      </el-table-column>
      <el-table-column label="手机号" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          {{scope.row.mobilePhone}}
        </template>
      </el-table-column>
      <el-table-column label="创建时间" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          {{scope.row.createDate}}
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="primary" title="编辑" size="mini" icon="el-icon-edit" circle @click="openEditForm(scope.row)"></el-button>
          <el-button type="danger" title="删除" size="mini" icon="el-icon-delete" circle @click="del(scope.row.userId)"></el-button>
          <el-button type="warning" title="角色列表" size="mini" icon="el-icon-share" circle @click="openUserRoleDialog(scope.row)"></el-button>
        </template>
      </el-table-column>

    </el-table>
    <template slot="footer">
      <el-pagination :current-page="page.current" :page-size="page.size" :total="page.total" :page-sizes="[1,100, 200, 300, 400]" layout="total, sizes, prev, pager, next, jumper" style="margin: -10px;" @size-change="handleSizeChange" @current-change="handleCurrentChange">
      </el-pagination>
    </template>
    <edit-form :user="user" v-model="editFormVisible" @submit="getTableData" />
    <user-role :user="user" v-model="userRoleDialogVisible" />
  </d2-container>
</template>
<script>
import * as userService from "@/api/sys/user";
import userRole from "./userRole";
import editForm from "./editForm";
export default {
  name: "UserPage",
  components: { editForm, userRole },
  data() {
    return {
      searchForm: {
        userName: "",
        userAccount: ""
      },
      loading: false,
      tableData: [],
      multipleSelection: [],
      page: {
        current: 1,
        size: 100,
        total: 0
      },
      sort: {
        prop: "",
        order: ""
      },
      user: {},
      editFormVisible: false,
      userRoleDialogVisible: false
    };
  },
  mounted() {
    this.getTableData();
  },
  methods: {
    getTableData() {
      let query = {
        pageNum: this.page.current,
        pageSize: this.page.size,
        userName: this.searchForm.userName,
        userAccount: this.searchForm.userAccount
      };
      userService.getUserPage(query).then(data => {
        this.tableData = data.list;
        this.page.total = data.total;
      });
    },
    handleSearchFormSubmit() {
      this.getTableData();
    },
    handleSearchFormReset() {
      this.$refs.searchForm.resetFields();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleSortChange(val) {
      this.sort.prop = val.prop;
      this.sort.order = val.order;
      this.getTableData();
    },
    handleSizeChange(val) {
      this.page.size = val;
      this.getTableData();
    },
    handleCurrentChange(val) {
      this.page.current = val;
      this.getTableData();
    },
    openEditForm(user) {
      this.user = user;
      this.editFormVisible = true;
    },
    add() {
      this.user = {};
      this.editFormVisible = true;
    },
    openUserRoleDialog(user) {
      this.user = user;
      this.userRoleDialogVisible = true;
    },
    batchDel() {
      this.$confirm("确认删除？", "确认信息", {
        distinguishCancelAndClose: true,
        confirmButtonText: "删除",
        cancelButtonText: "取消"
      }).then(() => {
        userService
          .delUsers({
            ids: this.multipleSelection.map(s => s.userId).join(',')
          })
          .then(() => {
            this.getTableData();
          });
      });
    },
    del(id) {
      this.$confirm("确认删除？", "确认信息", {
        distinguishCancelAndClose: true,
        confirmButtonText: "删除",
        cancelButtonText: "取消"
      }).then(() => {
        userService.delUser({ userId: id }).then(() => {
          this.getTableData();
        });
      });
    }
  }
};
</script>

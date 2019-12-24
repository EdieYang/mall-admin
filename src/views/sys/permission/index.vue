<template>
  <d2-container>
    <template slot="header">
      <el-form :inline="true" :model="searchForm" ref="searchForm" size="mini" style="margin-bottom: -18px;">
        <el-form-item label="权限名称" prop="permissionName">
          <el-input v-model="searchForm.permissionName" placeholder="请输入权限名称" style="width: 100px;" />
        </el-form-item>
        <el-form-item label="权限标识" prop="permissionCode">
          <el-input v-model="searchForm.permissionCode" placeholder="请输入权限标识" style="width: 120px;" />
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
    <el-table :data="tableData" v-loading="loading" size="small" stripe highlight-current-row style="width: 100%;" @selection-change="handleSelectionChange">

      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column label="权限名称" prop="userAccount">
        <template slot-scope="scope">
          {{scope.row.permissionName}}
        </template>
      </el-table-column>

      <el-table-column label="权限标识" prop="userName" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          {{scope.row.permissionCode}}
        </template>
      </el-table-column>
      <el-table-column label="权限描述" prop="permissionDescription" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          {{scope.row.permissionDescription}}
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="primary" title="编辑" size="mini" icon="el-icon-edit" circle @click="openEditForm(scope.row)"></el-button>
          <el-button type="danger" title="删除" size="mini" icon="el-icon-delete" circle @click="del(scope.row.id)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <template slot="footer">
      <el-pagination :current-page="page.current" :page-size="page.size" :total="page.total" :page-sizes="[1,100, 200, 300, 400]" layout="total, sizes, prev, pager, next, jumper" style="margin: -10px;" @size-change="handleSizeChange" @current-change="handleCurrentChange">
      </el-pagination>
    </template>
    <edit-form :permission="permission" v-model="editFormVisible" @submit="getTableData" />

  </d2-container>
</template>
<script>
import * as permissionService from "@/api/sys/permission";
import editForm from "./editForm";
export default {
  name: "PermissionPage",
  components: { editForm },
  data() {
    return {
      searchForm: {
        permissionName: "",
        permissionCode: ""
      },
      loading: false,
      tableData: [],
      multipleSelection: [],
      page: {
        current: 1,
        size: 100,
        total: 0
      },
      permission: {},
      editFormVisible: false
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
        permissionName: this.searchForm.permissionName,
        permissionCode: this.searchForm.permissionCode
      };
      permissionService.getPermissionPage(query).then(data => {
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
    handleSizeChange(val) {
      this.page.size = val;
      this.getTableData();
    },
    handleCurrentChange(val) {
      this.page.current = val;
      this.getTableData();
    },
    openEditForm(permission) {
      this.permission = permission;
      this.editFormVisible = true;
    },
    add() {
      this.permission = {};
      this.editFormVisible = true;
    },
    batchDel() {
      this.$confirm("确认删除？", "确认信息", {
        distinguishCancelAndClose: true,
        confirmButtonText: "删除",
        cancelButtonText: "取消"
      }).then(() => {
        permissionService
          .delUsers({
            ids: JSON.stringify(this.multipleSelection.map(s => s.id))
          })
          .then(() => {
            this.getTableData();
          });
      });
    },
    del(permissionId) {
      this.$confirm("确认删除？", "确认信息", {
        distinguishCancelAndClose: true,
        confirmButtonText: "删除",
        cancelButtonText: "取消"
      }).then(() => {
        permissionService.delPermission({ id: permissionId }).then(() => {
          this.getTableData();
        });
      });
    }
  }
};
</script>

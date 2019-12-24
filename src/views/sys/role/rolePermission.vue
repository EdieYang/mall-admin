<template>
  <el-dialog :visible.sync="dialogVisible" @open="dialogOpen">
    <div slot="title">维护
      <el-tag>{{role.roleName}}</el-tag>权限</div>
    <el-form :inline="true" :model="searchForm" ref="searchForm" size="mini" style="margin-bottom: -18px">
      <el-form-item label="权限名称" prop="permissionName">
        <el-input v-model="searchForm.permissionName" placeholder="权限名称" style="width: 100px" />
      </el-form-item>

      <el-form-item label="权限标识" prop="permissionCode">
        <el-input v-model="searchForm.permissionCode" placeholder="权限标识" style="width: 120px" />
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

    <el-table :data="tableData" v-loading="loading" size="small" stripe highlight-current-row style="width: 100%" @sort-change="handleSortChange">
      <el-table-column label="权限名称" prop="permissionName">
        <template slot-scope="scope">
          {{scope.row.permissionName}}
        </template>
      </el-table-column>
      <el-table-column label="权限标识" prop="permissionCode">
        <template slot-scope="scope">
          {{scope.row.permissionCode}}
        </template>
      </el-table-column>
      <el-table-column label="权限描述" prop="permissionDescription" sortable="custom" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          {{scope.row.permissionDescription}}
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="isAdd">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.isAdd==0" size="mini" type="info">未添加</el-tag>
          <el-tag v-if="scope.row.isAdd==1" size="mini" type="success">已添加</el-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" align="center">
        <template slot-scope="scope">
          <el-button v-if="scope.row.isAdd==0" type="primary" title="添加" size="mini" icon="el-icon-plus" circle @click="modifyRolePermission(scope.row.permissionId,1)"></el-button>
          <el-button v-if="scope.row.isAdd==1" type="danger" title="移除" size="mini" icon="el-icon-minus" circle @click="modifyRolePermission(scope.row.permissionId,0)"></el-button>
        </template>
      </el-table-column>

    </el-table>
    <div slot="footer">
      <el-pagination :current-page="page.current" :page-size="page.size" :total="page.total" :page-sizes="[1,100, 200, 300, 400]" layout="total, sizes, prev, pager, next, jumper" style="margin: -10px" @size-change="handleSizeChange" @current-change="handleCurrentChange">
      </el-pagination>
    </div>
  </el-dialog>
</template>
<script>
import * as permissionService from "@/api/sys/permission"
export default {
  name: "rolePermission",
  props: {
    role: Object,
    value: Boolean
  },
  data() {
    return {
      dialogVisible: false,
      searchForm: {
        permissionName: "",
        permissionCode: ""
      },
      loading: false,
      tableData: [],
      page: {
        current: 1,
        size: 100,
        total: 0
      },
      sort: {
        prop: "",
        order: ""
      }
    }
  },
  watch: {
    value(val) {
      this.dialogVisible = val
    },
    dialogVisible(val) {
      this.$emit("input", val)
    }
  },
  methods: {
    async dialogOpen() {
      this.getTableData()
    },
    getTableData() {
      let query = {
        pageNum: this.page.current,
        pageSize: this.page.size,
        permissionName: this.searchForm.permissionName,
        permissionCode: this.searchForm.permissionCode,
        roleId: this.role.roleId
      }
      permissionService.getPermissionPageByRoleId(query).then(data => {
        this.tableData = data.list
        this.page.total = data.total
      })
    },
    handleSearchFormSubmit() {
      this.getTableData()
    },
    handleSearchFormReset() {
      this.$refs.searchForm.resetFields()
    },
    handleSortChange(val) {
      this.sort.prop = val.prop
      this.sort.order = val.order
      this.getTableData()
    },
    handleSizeChange(val) {
      this.page.size = val
      this.getTableData()
    },
    handleCurrentChange(val) {
      this.page.current = val
      this.getTableData()
    },
    modifyRolePermission(permissionId, action) {
      if (action == 1) {
        permissionService
          .crtRolePermission({
            roleId: this.role.roleId,
            permissionId: permissionId
          })
          .then(() => {

            this.$notify({
              title: "操作成功",
              message: "已添加",
              type: "success"
            })
            this.getTableData()
          })
      } else {
        permissionService
          .delRolePermission({
            roleId: this.role.roleId,
            permissionId: permissionId
          })
          .then(() => {
            this.$notify({
              title: "操作成功",
              message: "已移除",
              type: "success"
            })
            this.getTableData()
          })
      }
    }
  }
}
</script>


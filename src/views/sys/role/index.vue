<template>
  <d2-container>
    <template slot="header">
      <el-form :inline="true" :model="searchForm" ref="searchForm" size="mini" style="margin-bottom: -18px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="searchForm.name" placeholder="名称" style="width: 100px" />
        </el-form-item>

        <el-form-item label="标识" prop="code">
          <el-input v-model="searchForm.code" placeholder="标识" style="width: 120px" />
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

    <el-table :data="tableData" v-loading="loading" size="small" stripe highlight-current-row style="width: 100%" @selection-change="handleSelectionChange" @sort-change="handleSortChange">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column label="名称" prop="roleName" sortable="custom">
        <template slot-scope="scope">
          {{scope.row.roleName}}
        </template>
      </el-table-column>

      <el-table-column label="标识" prop="roleCode" sortable="custom" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          {{scope.row.roleCode}}
        </template>
      </el-table-column>

      <el-table-column label="描述" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          {{scope.row.roleDescription}}
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="primary" title="编辑" size="mini" icon="el-icon-edit" circle @click="openEditForm(scope.row)"></el-button>
          <el-button type="danger" title="删除" size="mini" icon="el-icon-delete" circle @click="delRole(scope.row.roleId)"></el-button>
          <el-button type="warning" title="用户列表" size="mini" icon="el-icon-share" circle @click="openRoleUserDialog(scope.row)"></el-button>
          <el-button title="权限" size="mini" icon="el-icon-setting" circle @click="openPermissionDialog(scope.row)"></el-button>
          <el-button title="菜单" size="mini" icon="el-icon-menu" circle @click="openRoleMenuDialog(scope.row)"></el-button>

        </template>
      </el-table-column>

    </el-table>
    <template slot="footer">
      <el-pagination :current-page="page.current" :page-size="page.size" :total="page.total" :page-sizes="[1,100, 200, 300, 400]" layout="total, sizes, prev, pager, next, jumper" style="margin: -10px" @size-change="handleSizeChange" @current-change="handleCurrentChange">
      </el-pagination>
    </template>
    <edit-form :role="role" v-model="editFormVisible" @submit="getTableData" />
    <role-permission :role="role" v-model="permissionDialogVisible" />
    <role-user :role="role" v-model="roleUserDialogVisible" />
    <role-menu :role="role" v-model="roleMenuDialogVisible" />
  </d2-container>
</template>
<script>
import * as roleService from "@/api/sys/role"
import editForm from "./editForm"
import rolePermission from "./rolePermission"
import roleUser from "./roleUser"
import roleMenu from "./roleMenu"
export default {
  name: "RolePage",
  components: { editForm, rolePermission, roleUser, roleMenu },
  data() {
    return {
      searchForm: {},
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
      role: { roleId: "", roleName: "" },
      editFormVisible: false,
      permissionDialogVisible: false,
      roleUserDialogVisible: false,
      roleMenuDialogVisible: false
    }
  },
  mounted() {
    this.getTableData()
  },
  methods: {
    getTableData() {
      let query = {
        pageNum: this.page.current,
        pageSize: this.page.size,
        roleName: this.searchForm.name,
        roleCode: this.searchForm.code
      }
      roleService.getRolePage(query).then(data => {
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
    handleSelectionChange(val) {
      this.multipleSelection = val
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
    delRole(roleId) {
      this.$confirm("确认删除？", "确认信息", {
        distinguishCancelAndClose: true,
        confirmButtonText: "删除",
        cancelButtonText: "取消"
      }).then(() => {
        let req = {
          id: roleId
        }
        roleService.delRole(req).then(() => {
          this.getTableData()
        })
      })
    },
    batchDel() {
      this.$confirm("确认删除？", "确认信息", {
        distinguishCancelAndClose: true,
        confirmButtonText: "删除",
        cancelButtonText: "取消"
      }).then(() => {
        roleService
          .delRoles({
            ids: this.multipleSelection.map(s => s.roleId).join(',')
          })
          .then(() => {
            this.getTableData()
          })
      })
    },
    openEditForm(role) {
      this.role = role
      this.editFormVisible = true
    },
    add() {
      this.role = {}
      this.editFormVisible = true
    },
    openPermissionDialog(role) {
      this.role = role
      this.permissionDialogVisible = true
    },
    openRoleUserDialog(role) {
      this.role = role
      this.roleUserDialogVisible = true
    },
    openRoleMenuDialog(role) {
      this.role = role
      this.roleMenuDialogVisible = true
    }
  }
}
</script>

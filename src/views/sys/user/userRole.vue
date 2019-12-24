<template>
  <el-dialog :visible.sync="dialogVisible" @open="dialogOpen">
    <div slot="title">维护
      <el-tag>{{user.userName}}</el-tag>角色</div>
    <el-form :inline="true" :model="searchForm" ref="searchForm" size="mini" style="margin-bottom: -18px">
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="searchForm.roleName" placeholder="名称" style="width: 100px" />
      </el-form-item>

      <el-form-item label="角色标识" prop="roleCode">
        <el-input v-model="searchForm.roleCode" placeholder="标识" style="width: 120px" />
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
      <el-table-column label="角色名称" prop="roleName" sortable="custom">
        <template slot-scope="scope">
          {{scope.row.roleName}}
        </template>
      </el-table-column>

      <el-table-column label="角色标识" prop="roleCode" sortable="custom" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          {{scope.row.roleCode}}
        </template>
      </el-table-column>

      <el-table-column label="角色描述" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          {{scope.row.roleDescription}}
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
          <el-button v-if="scope.row.isAdd==0" type="primary" title="添加" size="mini" icon="el-icon-plus" circle @click="modifyRoleUser(scope.row.roleId,1)"></el-button>
          <el-button v-if="scope.row.isAdd==1" type="danger" title="移除" size="mini" icon="el-icon-minus" circle @click="modifyRoleUser(scope.row.roleId,0)"></el-button>
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
import * as roleService from "@/api/sys/role"
import * as userService from "@/api/sys/user"
export default {
  name: "userRole",
  props: {
    user: Object,
    value: Boolean
  },
  data() {
    return {
      dialogVisible: false,
      searchForm: {
        roleName: "",
        roleCode: ""
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
    dialogOpen() {
      this.getTableData()
    },
    getTableData() {
      let query = {
        pageNum: this.page.current,
        pageSize: this.page.size,
        roleName: this.searchForm.roleId,
        roleCode: this.searchForm.roleCode,
        userId: this.user.userId
      }
      roleService.getRolePagByUserId(query).then(data => {
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
    modifyRoleUser(roleId, action) {
      if (action == 1) {
        userService
          .crtRoleUser({
            roleId: roleId,
            userId: this.user.userId
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
        userService
          .delRoleUser({
            roleId: roleId,
            userId: this.user.userId
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


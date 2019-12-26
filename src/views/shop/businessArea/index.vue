<template>
  <d2-container>
    <template slot="header">
      <div class="header-cover">
        <el-button
          type="primary"
          size="small"
          round=""
          icon="el-icon-folder-add"
          @click="newShopBusinessArea"
          >新增商圈</el-button
        >
      </div>
    </template>
    <template>
      <el-table :data="data" style="width: 100%;" border>
        <el-table-column label="id" align="center" width="200" prop="id">
          <template slot-scope="scope">
            <span>{{ scope.row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="商圈名称" align="center" prop="areaName">
          <template slot-scope="scope">
            <span>{{ scope.row.areaName }}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="创建时间"
          align="center"
          width="230"
          prop="createDate"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.createDate }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center" width="180" fixed="right">
          <template slot-scope="scope">
            <el-tooltip content="编辑商铺" placement="top-start" effect="light">
              <el-button
                type="primary"
                icon="el-icon-edit"
                circle
                @click="editShopBusinessArea(scope.row.id, scope.row.areaName)"
              ></el-button>
            </el-tooltip>

            <el-tooltip
              content="删除"
              placement="top-start"
              circle
              effect="light"
            >
              <el-button
                type="danger"
                icon="el-icon-delete"
                circle
                @click="delShopBusinessArea(scope.row.id)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog
        :title="dialogTitle"
        :visible.sync="shopBusinessAreaDialog"
        width="30%"
        center
      >
        <el-form
          :model="form"
          :rules="rules"
          ref="form"
          label-width="100px"
          class="dialogForm"
        >
          <el-form-item label="商圈名称" prop="areaName">
            <el-input v-model="form.areaName"></el-input>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button
            @click="
              shopBusinessAreaDialog = false
              form.areaName = ''
            "
            >取 消</el-button
          >
          <el-button
            type="primary"
            @click="editArea()"
            v-if="businessAreaId != ''"
            >提 交</el-button
          >
          <el-button
            type="primary"
            @click="newArea()"
            v-if="businessAreaId == ''"
            >提 交</el-button
          >
        </span>
      </el-dialog>
    </template>
    <template slot="footer">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </template>
  </d2-container>
</template>

<script>
import {
  businessAreaList,
  businessAreaEdit,
  businessAreaNew
} from '@/api/shop/businessAreaApi'
import util from '@/libs/util'
var pageNum = 1
var pageSize = 10
var userId = ''

export default {
  name: 'BusinessAreaList',
  data() {
    return {
      shopBusinessAreaDialog: false,
      businessAreaId: '',
      dialogTitle: '',
      form: {
        areaName: ''
      },
      data: [],
      currentPage: 1,
      total: 0,
      picPath: 'https://pic.linchongpets.com/',
      rules: {
        areaName: [
          { required: true, message: '请输入商圈名称', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    userId = util.cookies.get('userId')
    if (userId == '' || userId == null || typeof userId == 'undefined') {
      this.$router.push({
        name: 'login'
      })
      return
    }
    this.getList()
  },
  methods: {
    getList() {
      let data = {
        pageNum: pageNum,
        pageSize: pageSize
      }
      businessAreaList(data).then(res => {
        console.log(res)
        this.data = res.list
        this.currentPage = res.page
        this.total = res.total
      })
    },
    newShopBusinessArea() {
      this.shopBusinessAreaDialog = true
      this.businessAreaId = ''
      this.dialogTitle = '新增商圈'
    },
    editShopBusinessArea(id, name) {
      this.shopBusinessAreaDialog = true
      this.businessAreaId = id
      this.form.areaName = name
      this.dialogTitle = '编辑商圈'
    },
    newArea() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          var formData = {
            areaName: this.form.areaName
          }
          businessAreaNew(formData).then(res => {
            this.$message({
              message: '创建成功',
              type: 'success'
            })
            this.shopBusinessAreaDialog = false
            this.form.businessAreaId = ''
            this.$refs['form'].resetFields()
            this.getList()
          })
        }
      })
    },
    editArea() {
      var formData = {
        id: this.businessAreaId,
        areaName: this.form.areaName
      }
      businessAreaEdit(formData).then(res => {
        this.$message({
          message: '更新成功',
          type: 'success'
        })
        this.shopBusinessAreaDialog = false
        this.form.businessAreaId = ''
        this.$refs['form'].resetFields()
        this.getList()
      })
    },
    delShopBusinessArea(id) {
      var formData = {
        id: id,
        delFlag: '1'
      }
      businessAreaEdit(formData).then(res => {
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        this.getList()
      })
    },
    handleSizeChange(val) {
      pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      pageNum = val
      this.getList()
    }
  }
}
</script>

<style scoped></style>

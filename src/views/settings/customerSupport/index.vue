<template>
  <d2-container>
    <template slot="header">
      <div class="header-cover">
        <el-form :inline="true" :model="formInline" class="cs-form-inline">

          <el-form-item label="客服微信号" label-width="100px">
            <el-input v-model="formInline.wechat" size="small"></el-input>
          </el-form-item>

          <el-form-item label="客服联系电话" label-width="100px">
            <el-input v-model="formInline.phone" size="small"></el-input>
          </el-form-item>

          <el-form-item label="渠道类型" label-width="100px">
            <el-select v-model="formInline.belongType" placeholder="请选择" size="small">
              <el-option v-for="item in belongTypeOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>

          <el-row>
            <el-form-item label=" " label-width="100px">
              <el-button type="primary" round="" size="small" @click="search" icon="el-icon-search">搜索</el-button>
              <el-button type="" round="" size="small" @click="reset">重置</el-button>
              <el-button type="primary" size="small" round="" icon="el-icon-folder-add" @click="newCustomerSupport()">新增客服</el-button>
            </el-form-item>
          </el-row>
        </el-form>
      </div>
    </template>
    <template>
      <el-table :data="data" style="width: 100%;" border>
        <el-table-column label="客服微信二维码" align="center" width="200" prop="wxcodeUrl">
          <template slot-scope="scope">
            <img :src="picPath+scope.row.wxcodeUrl" width="100px" height="100px" />
          </template>
        </el-table-column>
        <el-table-column label="客服微信号" align="center" width="200" prop="wechat">
          <template slot-scope="scope">
            <span>{{ scope.row.wechat }}</span>
          </template>
        </el-table-column>
        <el-table-column label="客服联系电话" align="center" width="200" prop="phone">
          <template slot-scope="scope">
            <span>{{ scope.row.phone }}</span>
          </template>
        </el-table-column>
        <el-table-column label="客服服务时间" align="center" prop="availableTime">
          <template slot-scope="scope">
            <span>{{ scope.row.availableTime }}</span>
          </template>
        </el-table-column>

        <el-table-column label="客服归属类型" align="center" width="200" prop="belongType">
          <template slot-scope="scope">
            <span>{{ scope.row.belongType=='0'?'平台客服':'公益专属客服' }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center" width="180" fixed="right">
          <template slot-scope="scope">
            <el-tooltip content="编辑客服" placement="top-start" effect="light">
              <el-button type="primary" icon="el-icon-edit" circle @click="editCustomerSupport(scope.row.id)"></el-button>
            </el-tooltip>
            <el-tooltip content="删除客服" placement="top-start" circle effect="light">
              <el-button type="danger" icon="el-icon-delete" circle @click="delCustomerSupport(scope.row.id)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 新增编辑框 -->
      <el-dialog :title="dialogTitle" :visible.sync="customerSupportDialog" width="30%" center :close-on-click-modal='false' :close-on-press-escape='false' :show-close='false'>
        <el-form :model="form" :rules="rules" ref="form" label-width="140px" class="dialogForm">
          <el-form-item label="客服微信号" prop="wechat">
            <el-input v-model="form.wechat"></el-input>
          </el-form-item>
          <el-form-item label="客服联系电话" prop="phone">
            <el-input v-model="form.phone"></el-input>
          </el-form-item>
          <el-form-item label="客服服务时间" prop="availableTime">
            <el-input v-model="form.availableTime"></el-input>
          </el-form-item>
          <el-form-item label="渠道类型" ref="belongType" prop="belongType" class="dialogForm">
            <el-select v-model="form.belongType" placeholder="请选择" size="small">
              <el-option v-for="item in belongTypeOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="微信二维码图片" prop="wxcodeUrl" ref="wxcodeUrl">
            <el-upload :action="actionUrl" list-type="picture-card" :data="wxcodeParam" :on-preview="handlePictureCardPreview" :on-remove="handleWxcodeRemove" :on-success="handleWxcodeSuccess" :before-upload="handleBefore" :limit="1" :file-list="fileList">
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible" :modal-append-to-body="false">
              <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancelDialog()">取 消</el-button>
          <el-button type="primary" @click="uptCustomerSupport()" v-if="id!=''">提 交</el-button>
          <el-button type="primary" @click="crtCustomerSupport()" v-if="id==''">提 交</el-button>
        </span>
      </el-dialog>

    </template>
    <template slot="footer">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10,20,30,40]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </template>

  </d2-container>

</template>

<script>
import { customerSupportTableList, customerSupportNew, customerSupportDetail, customerSupportEdit, customerSupportDel } from "@/api/customerSupport/customerSupportApi"
import util from '@/libs/util'
var pageNum = 1
var pageSize = 10
var userId = ''

export default {
  name: "commodityList",
  data() {
    return {
      data: [],
      currentPage: 1,
      total: 0,
      picPath: 'https://linkpets-mall-dev.oss-accelerate.aliyuncs.com/',
      actionUrl: '/api/oss/upload',
      id: '',
      fileList: [],
      formInline: {
        wechat: '',
        phone: '',
        availableTime: '',
        belongType: '0'
      },
      form: {
        wechat: '',
        phone: '',
        availableTime: '',
        belongType: '0',
        wxcodeUrl: ''
      },
      belongTypeOptions: [{
        value: '0',
        label: '平台渠道客服'
      }, {
        value: '1',
        label: '公益专属客服'
      }],
      customerSupportDialog: false,
      dialogVisible: false,
      dialogTitle: '',
      dialogImageUrl: '',
      wxcodeParam: { 'path': 'mall/customerSupport' },
      rules: {
        wechat: [
          { required: true, message: '请输入微信号', trigger: 'blur' },
          { max: 20, message: '长度不得超过20个字', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { max: 11, message: '长度不得超过11个字', trigger: 'blur' }
        ],
        availableTime: [
          { required: true, message: '请输入服务时间', trigger: 'blur' },
          { max: 40, message: '长度不得超过40个字', trigger: 'blur' }
        ],
        wxcodeUrl: [
          { required: true, message: '请上传微信二维码图片', trigger: 'change' }
        ],
      }
    }
  },
  mounted() {
    userId = util.cookies.get("userId")
    if (userId == '' || userId == null || typeof userId == 'undefined') {
      this.$router.push({
        name: 'login'
      })
      return
    }
    this.getList()
  },
  methods: {
    search() {
      this.getList()
    },
    getList() {
      let data = {
        pageNum: pageNum,
        pageSize: pageSize,
        belongType: this.formInline.belongType
      }
      customerSupportTableList(data).then(res => {
        console.log(res)
        this.data = res.list
        this.currentPage = res.pageNum
        this.total = res.total
      })
    },
    uptCustomerSupport() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          let data = {
            id: this.id,
            wechat: this.form.wechat,
            phone: this.form.phone,
            availableTime: this.form.availableTime,
            wxcodeUrl: this.form.wxcodeUrl,
            belongType: this.form.belongType
          }
          customerSupportEdit(data).then(res => {
            this.$message.success('更新成功')
            this.cancelDialog()
            this.getList()
          })
        }
      })
    },
    crtCustomerSupport() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          let data = {
            wechat: this.form.wechat,
            phone: this.form.phone,
            availableTime: this.form.availableTime,
            wxcodeUrl: this.form.wxcodeUrl,
            belongType: this.form.belongType
          }
          customerSupportNew(data).then(res => {
            this.$message.success('创建成功')
            this.cancelDialog()
            this.getList()
          })
        }
      })
    },
    delCustomerSupport(id) {
      customerSupportDel(id).then(res => {
        this.$message.success('删除成功')
        this.getList()
      })
    },
    newCustomerSupport() {
      this.dialogTitle = '新增客服信息'
      this.customerSupportDialog = true
      this.id = ''
    },
    editCustomerSupport(id) {
      this.dialogTitle = '修改客服信息'
      this.customerSupportDialog = true
      this.id = id
      customerSupportDetail(id).then(res => {
        this.form.wechat = res.wechat
        this.form.phone = res.phone
        this.form.availableTime = res.availableTime
        var file = {
          name: '',
          url: this.picPath + res.wxcodeUrl
        }
        this.fileList.push(file)
        this.form.wxcodeUrl = res.wxcodeUrl
      })
    },
    cancelDialog() {
      this.customerSupportDialog = false
      this.form.wechat = ''
      this.form.phone = ''
      this.form.availableTime = ''
      this.form.belongType = '0'
      this.form.wxcodeUrl = ''
      this.dialogImageUrl = '';
      this.fileList = []
    },
    handleSizeChange(val) {
      pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      pageNum = val
      this.getList()
    },
    reset() {
      this.formInline.wechat = ''
      this.formInline.phone = ''
      this.formInline.belongType = '0'
      this.formInline.availableTime = ''
      this.getList()
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleWxcodeSuccess(response, file, fileList) {
      this.form.wxcodeUrl = response.data.relativePath
      this.$refs.wxcodeUrl.clearValidate()
    },
    handleWxcodeRemove(file, fileList) {
      this.form.wxcodeUrl = ''
    },
    handleBefore() {

    }
  }
}
</script>

<style scoped>
.header-cover {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
</style>

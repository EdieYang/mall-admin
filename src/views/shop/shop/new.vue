<template>
  <d2-container better-scroll>
    <div style="width:100%;">
      <el-card v-loading="pageLoading">
        <el-form ref="form"
                 :model="form"
                 label-width="120px"
                 label-position="left"
                 :rules="formRules"
                 style="width:640px;display: inline-block;">

          <el-divider content-position="left">创建商户信息</el-divider>
          <el-form-item label="商户Id"
                        prop="shopId">
            <el-input v-model="form.shopId"
                      placeholder="请输入商户Id"
                      disabled></el-input>
          </el-form-item>
          <el-form-item label="商户名称"
                        prop="shopName">
            <el-input v-model="form.shopName"
                      placeholder="请输入商户名称"></el-input>
          </el-form-item>
          <el-form-item label="联系人"
                        prop="linkman">
            <el-input v-model="form.linkman"
                      placeholder="请输入联系人"></el-input>
          </el-form-item>
          <el-form-item label="手机"
                        prop="mobile">
            <el-input v-model="form.mobile"
                      placeholder="请输入手机"
                      :maxlength="11"></el-input>
          </el-form-item>
          <el-form-item label="微信"
                        prop="wechat">
            <el-input v-model="form.wechat"
                      placeholder="请输入微信"></el-input>
          </el-form-item>
          <el-form-item label="商家所在市区"
                        prop="addressDistrict">
            <el-select v-model="form.addressDistrict"
                       placeholder="请选择所在地（仅限上海市）"
                       value=""
                       style="width:100%;">
              <el-option v-for="value in addressRange"
                         :label="value"
                         :value="value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="商家地址"
                        prop="addressDetail">
            <el-input v-model="form.addressDetail"
                      placeholder="请输入详细地址"></el-input>
          </el-form-item>
          <el-form-item label="营业时间"
                        prop="openTime">
            <el-time-picker range-separator="至"
                            start-placeholder="开始时间"
                            end-placeholder="结束时间"
                            placeholder="选择时间范围"
                            is-range
                            value-format="HH:mm"
                            format="HH:mm"
                            :picker-options="{
                                            format:'HH:mm'
                                            }"
                            v-model="form.openTime">
            </el-time-picker>
          </el-form-item>
          <el-form-item label="店内电话"
                        prop="shopPhone">
            <el-input v-model="form.shopPhone"
                      placeholder="请输入店内电话"></el-input>
          </el-form-item>
          <el-form-item label="状态"
                        prop="shopStatus">
            <el-radio-group v-model="form.shopStatus"
                            size="small">
              <el-radio label="0"
                        border>停运</el-radio>
              <el-radio label="1"
                        border>运营中</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-divider content-position="left">店铺照片</el-divider>
          <el-form-item label="照片"
                        prop="imgList">
            <el-upload :action="actionUrl"
                       list-type="picture-card"
                       :data="ossData"
                       :on-preview="handlePictureCardPreview"
                       :on-remove="handleRemove"
                       :on-success="handleSuccess"
                       :before-upload="handleBefore"
                       :file-list="fileList">
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible"
                       :modal-append-to-body="false">
              <img width="100%"
                   :src="dialogImageUrl"
                   alt="">
            </el-dialog>
          </el-form-item>
          <el-form-item>
            <el-button type="primary"
                       @click="shopNew"
                       size="small">提 交</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </d2-container>

</template>

<script>
import { shopNew, shopDetail, shopEdit, getShopId } from "@/api/shop/shopApi"
import util from '@/libs/util'
var shopId = ''

export default {
  name: "shopDetail",
  data () {
    let validMobile = (rule, value, callback) => {
      let reg = /^1(3|4|5|7|8)\d{9}$/;
      if (!reg.test(value)) {
        callback(new Error('请输入正确的手机号'));
      } else {
        callback();
      }
    };
    return {
      pageLoading: false,
      pageType: "",
      canUpload: true,
      picPath: 'https://pic.linchongpets.com/',
      actionUrl: "https://www.linchongpets.com/lpCmsTest/oss/image",
      form: {
        imgList: [], //商户照片
        shopId: "", //商户ID
        shopName: "", //商户名称
        linkman: "", //联系人
        mobile: "", //手机号
        wechat: "", //微信号
        addressDistrict: "", //所在地
        addressDetail: "", //详细地址
        shopPhone: "",//店内电话
        openTime: [new Date('2019', '10', '01', '00', '00', '00'), new Date('2019', '10', '01', '23', '00', '00')],//营业开始时间
        shopStatus: "0", //商户状态
        createBy: util.cookies.get('userId'),
      },
      picArr: [],
      fileList: [],
      dialogImageUrl: '',
      dialogVisible: false,
      ossData: { 'userId ': shopId, 'ossZone ': 'mall' },
      addressRange: ["上海市 黄浦区", "上海市 徐汇区", "上海市 长宁区", "上海市 静安区", "上海市 普陀区", "上海市 虹口区",
        "上海市 杨浦区", "上海市 闵行区", "上海市 宝山区", "上海市 嘉定区", "上海市 浦东新区", "上海市 金山区",
        "上海市 松江区", "上海市 青浦区", "上海市 奉贤区", "上海市 崇明区"],
      formRules: {
        shopName: [
          { required: true, message: '请输入商铺名称', trigger: 'blur' },
          { max: 32, message: '长度不得超过32位', trigger: 'blur' }
        ],
        linkman: [
          { required: true, message: '请输入联系人', trigger: 'blur' },
          { max: 5, message: '长度不得超过5位', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: validMobile, message: '请输入正确的手机号', trigger: 'blur' },
        ],
        wechat: [
          { required: true, message: '请填写微信号', trigger: 'blur' },
        ],
        addressDistrict: [
          { required: true, message: '请选择所在区', trigger: 'change' },
        ],
        addressDetail: [
          { required: true, message: '请输入详细地址', trigger: 'blur' },
          { max: 128, message: '长度不得超过128位', trigger: 'blur' }
        ],
        shopStatus: [
          { required: true, message: '请选择状态', trigger: 'change' },
        ],
        shopPhone: [
          { required: true, message: '请输入店内电话', trigger: 'change' },
        ],
        openTime: [
          { required: true, message: '请选择营业时间', trigger: 'change' },
        ]
      }
    }
  },
  mounted () {
    this.pageType = this.$route.query.type;
    if (this.pageType === "edit") {
      this.shopDetail()
    } else {
      this.getShopId()
    }
  },
  methods: {
    getShopId () {
      getShopId().then(res => {
        console.log(res)
        shopId = res
        this.form.shopId = res
      })
    },
    shopDetail () {
      //清空遗留数据
      let shopId = this.$route.query.shopId;
      this.pageLoading = true;
      shopDetail(shopId).then(res => {
        this.pageLoading = false;
        console.log(res)
        this.form = res.shopInfo
        // var openTime = res.shopInfo.openTime.replace('[', '').replace(']', '').replace('"', '').replace(' ', '')
        var openTime = this.form.openTime.split(',')
        console.log(openTime)
        var d = new Date()
        console.log(openTime[0])

        d.setHours(openTime[0].substring(0, 2), openTime[0].substring(3))

        var d2 = new Date()
        console.log(openTime[1])
        d2.setHours(openTime[1].substring(0, 2), openTime[1].substring(3))

        this.form.openTime = [d, d2]
        console.log(this.form.openTime)

        this.form.imgList = res.imgList
        this.fileList = []
        res.imgList.forEach(element => {
          let shopPic = {
            name: element.imgName,
            url: this.picPath + element.imgUrl
          }
          this.fileList.push(shopPic)
        });
      });
    },
    shopNew () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          let formData = this.form
          debugger
          if (formData.openTime[0] instanceof Date || formData.openTime[1] instanceof Date) {
            let startTime = this.form.openTime[0].getHours() < 10 ? '0' + this.form.openTime[0].getHours() : this.form.openTime[0].getHours()
            startTime += ':'
            startTime += this.form.openTime[0].getMinutes() < 10 ? '0' + this.form.openTime[0].getMinutes() : this.form.openTime[0].getMinutes()
            let endTime = this.form.openTime[1].getHours() < 10 ? '0' + this.form.openTime[1].getHours() : this.form.openTime[1].getHours()
            endTime += ':'
            endTime += this.form.openTime[1].getMinutes() < 10 ? '0' + this.form.openTime[1].getMinutes() : this.form.openTime[1].getMinutes()
            formData.openTime = [startTime, endTime]
          } else {
            formData.openTime = formData.openTime.toString()
          }

          this.pageLoading = true;
          if (this.pageType === "edit") {
            shopEdit(formData).then(res => {
              console.log(res)
              this.pageLoading = false;
              this.$message.success('更新成功')
              if (this.pageType === "edit") {
                this.shopDetail()
              }
            });
          } else if (this.pageType === "new") {
            shopNew(formData).then(res => {
              console.log(res)
              this.pageLoading = false;
              this.$message.success('创建成功')
              this.$refs['form'].resetFields();
              this.$router.push('/shop/shop/index')
            });
          }
        }
      })
    },
    handleRemove (file, fileList) {
      console.log(file)
      var index = 0
      this.form.imgList.forEach(element => {
        if (element.imgName == file.name) {
          this.form.imgList.splice(index, 1)
          index++
        }
      });
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleSuccess (response, file, fileList) {
      console.log(file)
      this.canUpload = true
      let picFile = {
        imgName: file.response.data.split('/')[file.response.data.split('/').length - 1],
        imgUrl: file.response.data,
      }
      this.form.imgList.push(picFile)
    },
    handleBefore () {
      if (this.form.imgList.length == 12) {
        this.$message.console.warn("图片最多上传12张！");
        return false
      } else if (this.canUpload === true) {
        this.canUpload = false
        return true
      } else {
        return false
      }
    },
  }
}
</script>

<style scoped>
.el-divider__text,
.el-link {
  font-size: 18px;
}
</style>

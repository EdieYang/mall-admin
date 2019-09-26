<template>
  <d2-container better-scroll>
    <div style="width:100%;">
      <el-card v-loading="pageLoading">
        <el-form ref="form"
                 :model="form"
                 label-width="90px"
                 label-position="left"
                 :rules="formRules"
                 style="width:640px;display: inline-block;">

          <el-divider content-position="left">店铺信息</el-divider>
          <el-form-item label="商户Id"
                        prop="shopId">
            <el-input v-model="form.shopId"
                      placeholder="请输入商户Id" disabled></el-input>
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
                      placeholder="请输入手机"></el-input>
          </el-form-item>
          <el-form-item label="微信"
                        prop="wechat">
            <el-input v-model="form.wechat"
                      placeholder="请输入微信"></el-input>
          </el-form-item>
          <el-form-item label="所在地"
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
          <el-form-item label="详细地址"
                        prop="addressDetail">
            <el-input v-model="form.addressDetail"
                      placeholder="请输入详细地址"></el-input>
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
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%"
                   :src="dialogImageUrl"
                   alt="">
            </el-dialog>
            <el-input v-model="form.imgList"
                      v-show="false"></el-input>
          </el-form-item>

          <el-button class="form-sumbit"
                     type="primary"
                     @click="shopNew">提 交</el-button>
        </el-form>
        <br>
      </el-card>
    </div>
  </d2-container>

</template>

<script>
import { shopNew, shopDetail, shopEdit } from "@/api/shop/shopApi"
import util from '@/libs/util'

export default {
  name: "new",
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
      actionUrl: "https://www.linchongpets.com/lpCmsTest/oss/image",
      form: {
        imgList: "", //宠物照片
        shopID: "", //商铺ID
        shopName: "", //商铺名称
        linkman: "", //联系人
        mobile: "", //手机号
        wechat: "", //微信号
        addressDistrict: "", //所在地
        addressDetail:"", //详细地址
        shopStatus:"0", //商铺状态
        createBy: util.cookies.get('userId'),
      },
      picArr: [],
      fileList: [],
      dialogImageUrl: '',
      dialogVisible: false,
      ossData: { 'userId ':"123", 'ossZone ': 'mall' },
      addressRange: ["上海市 黄浦区", "上海市 徐汇区", "上海市 长宁区", "上海市 静安区", "上海市 普陀区", "上海市 虹口区",
        "上海市 杨浦区", "上海市 闵行区", "上海市 宝山区", "上海市 嘉定区", "上海市 浦东新区", "上海市 金山区",
        "上海市 松江区", "上海市 青浦区", "上海市 奉贤区", "上海市 崇明区"],
      formRules: {
        shopName: [
          { required: true, message: '请输入商铺名称', trigger: 'blur' },
          {  max: 32, message: '长度不得超过32位', trigger: 'blur' }
        ],
        linkman: [
          { required: true, message: '请输入联系人', trigger: 'blur' },
          {  max: 5, message: '长度不得超过5位', trigger: 'blur' }
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
          {  max: 128, message: '长度不得超过128位', trigger: 'blur' }
        ],
        shopStatus: [
          { required: true, message: '请选择状态', trigger: 'change' },
        ],

      }
    }
  },
  mounted () {

    this.pageType = this.$route.query.type;
    if (this.pageType === "edit") {
      this.shopDetail()
    }
  },
  methods: {
    shopDetail () {
      //清空遗留数据
      let shopId = this.$route.query.shopId;
      this.pageLoading = true;
      shopDetail(shopId).then(res => {
        this.pageLoading = false;
        console.log(res)
        this.form = JSON.parse(JSON.stringify(res))
        // this.form.imgList.forEach(_data => {
        //   let file = {
        //     name: '',
        //     mediaId: _data.mediaId,
        //     url: "https://pic.linchongpets.com/" + _data.mediaPath
        //   }
        //   this.fileList.push(file)
        // });

      });
    },
    shopNew () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          let formData = JSON.parse(JSON.stringify(this.form))
          this.pageLoading = true;
          if (this.pageType === "edit") {
            shopEdit(formData).then(res => {
              console.log(res)
              this.pageLoading = false;
              this.$message.success('更新成功')
              if (this.pageType === "edit") {
                this.adoptDetail()
              }
              this.$router.push('/shop/index')
            });
          } else if (this.pageType === "new") {
            shopNew(formData).then(res => {
              console.log(res)
              this.pageLoading = false;
              this.$message.success('创建成功')
              this.$refs['form'].resetFields();
              this.$router.push('/shop/index')
            });
          }
        }
      })
    },
    handleRemove (file, fileList) {
      console.log(file)
      let tempImgList = JSON.parse(this.form.imgList)
      tempImgList.forEach(picItem => {
        if (file.mediaId == picItem.mediaId) {
          picItem.isValid = 0
        }
      })
      this.form.imgList = JSON.stringify(tempImgList)
      for (var i = 0; i < this.picArr.length; i++) {
        if (this.picArr[i].mediaId == file.mediaId) {
          this.picArr.splice(i, 1);
        }
      }
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleSuccess (response, file, fileList) {
      console.log(file);
      this.canUpload = true;
      let picFile = {
        imgName: file.response.data.split('/')[file.response.data.split('/').length -1],
        imgUrl: file.response.data,
      };
      this.picArr.push(picFile);
      let tempImgList = [];
      console.log(this.form.imgList)
      if (this.form.imgList != '') {
        tempImgList = JSON.parse(this.form.imgList)
      }
      tempImgList.push(picFile);
      this.form.imgList = JSON.stringify(tempImgList)
      console.log(this.form.imgList)
    },
    handleBefore () {
      if (this.picArr.length > 11) {
        alert("图片最多上传12张！");
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

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
          <el-divider content-position="left">上传宠物照片</el-divider>
          <el-form-item label="照片"
                        prop="mediaList">
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
            <el-input v-model="form.mediaList"
                      v-show="false"></el-input>
          </el-form-item>

          <el-divider content-position="left">宠物信息</el-divider>
          <el-form-item label="昵称"
                        prop="petName">
            <el-input v-model="form.petName"
                      placeholder="请输入昵称"></el-input>
          </el-form-item>
          <el-form-item label="年龄"
                        prop="petAge">
            <el-select v-model="form.petAge"
                       placeholder="请选择年龄"
                       value=""
                       style="width:100%;">
              <el-option v-for="value in ageRange"
                         :label="value"
                         :value="value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="类别"
                        prop="petType">
            <el-radio-group v-model="form.petType"
                            size="small">
              <el-radio label="1"
                        border>狗狗</el-radio>
              <el-radio label="2"
                        border>猫咪</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="性别"
                        prop="petSex">
            <el-radio-group v-model="form.petSex"
                            size="small">
              <el-radio label="1"
                        border>未知</el-radio>
              <el-radio label="2"
                        border>男孩</el-radio>
              <el-radio label="3"
                        border>女孩</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-divider content-position="left">宠物现状</el-divider>
          <el-form-item label="绝育"
                        prop="petSterilization">
            <el-radio-group v-model="form.petSterilization"
                            size="small">
              <el-radio label="3"
                        border>不详</el-radio>
              <el-radio label="1"
                        border>已绝育</el-radio>
              <el-radio label="2"
                        border>未绝育</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="疫苗"
                        prop="petVaccine">
            <el-radio-group v-model="form.petVaccine"
                            size="small">
              <el-radio label="3"
                        border>不详</el-radio>
              <el-radio label="1"
                        border>已接种</el-radio>
              <el-radio label="2"
                        border>未接种</el-radio>
              <el-radio label="4"
                        border>接种中</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="驱虫"
                        prop="petParasite">
            <el-radio-group v-model="form.petParasite"
                            size="small">
              <el-radio label="3"
                        border>不详</el-radio>
              <el-radio label="1"
                        border>已驱</el-radio>
              <el-radio label="2"
                        border>未驱</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="体型"
                        prop="petSomatotype">
            <el-radio-group v-model="form.petSomatotype"
                            size="small">
              <el-radio label="4"
                        border>大型</el-radio>
              <el-radio label="3"
                        border>中型</el-radio>
              <el-radio label="2"
                        border>小型</el-radio>
              <el-radio label="1"
                        border>迷你</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="毛发"
                        prop="petHair">
            <el-radio-group v-model="form.petHair"
                            size="small">
              <el-radio label="1"
                        border>无毛</el-radio>
              <el-radio label="2"
                        border>短毛</el-radio>
              <el-radio label="3"
                        border>长毛</el-radio>
              <el-radio label="4"
                        border>卷毛</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-divider content-position="left">宠物特点<span class="divider-remarks">（最多选择3个选项）</span></el-divider>
          <el-form-item label="特点"
                        prop="petCharacteristic">
            <el-checkbox-group v-model="form.petCharacteristic"
                               :max="3"
                               size="small">
              <el-checkbox v-for="item in petCharacteristic"
                           :label="item.value"
                           :key="item.value"
                           border>{{item.name}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <el-divider content-position="left">领养要求</el-divider>
          <el-form-item label="要求"
                        prop="adoptRequirements">
            <el-checkbox-group v-model="form.adoptRequirements">
              <div v-for="item in adoptRequirements">
                <el-checkbox :label="item.value"
                             :key="item.value"
                             v-if="item.value==10">其他(先勾选再填信息)</el-checkbox>
                <el-checkbox :label="item.value"
                             :key="item.value"
                             v-else>{{item.name}}</el-checkbox>
              </div>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="">
            <el-input type="textarea"
                      placeholder="请输入内容"
                      v-model="requirementsText"
                      maxlength="200"
                      rows="5"
                      show-word-limit></el-input>
          </el-form-item>

          <el-divider content-position="left">送养故事</el-divider>
          <el-form-item label="故事"
                        prop="story">
            <el-input type="textarea"
                      placeholder="请描述宠物饮食偏好、行为习惯、运动量等，以及送养原因、宠物过往经历、情感故事等。"
                      v-model="form.story"
                      maxlength="200"
                      rows="5"
                      show-word-limit></el-input>
          </el-form-item>

          <el-divider content-position="left">联系方式</el-divider>
          <el-form-item label="所在地"
                        prop="address">
            <el-select v-model="form.address"
                       placeholder="请选择所在地（仅限上海市）"
                       value=""
                       style="width:100%;">
              <el-option v-for="value in addressRange"
                         :label="value"
                         :value="value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="微信号"
                        prop="wxId">
            <el-input v-model="form.wxId"
                      placeholder="请输入微信号"></el-input>
          </el-form-item>
          <el-form-item label="手机号"
                        prop="mobilePhone">
            <el-input v-model="form.mobilePhone"
                      placeholder="请输入手机号"></el-input>
          </el-form-item>

          <el-button class="form-sumbit"
                     type="primary"
                     @click="adoptNew">提 交</el-button>
        </el-form>
        <br>
      </el-card>
    </div>
  </d2-container>

</template>

<script>
import { adoptNew, adoptDetail, adoptEdit } from "@/api/adoptRelease/adoptReleaseApi"
import util from '@/libs/util'
var orgId = ''

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
      actionUrl: "https://www.linchongpets.com/lpCmsTest/oss/image",
      form: {
        mediaList: "", //宠物照片

        petName: "", //昵称
        petAge: "", //年龄
        petType: "", //类别
        petSex: "", //性别

        petSterilization: "", //绝育
        petVaccine: "", //疫苗
        petParasite: "", //驱虫
        petFrom: "2", //来源 默认公益机构，机构ID由登录账号决定
        petSomatotype: "", //体型
        petHair: "", //毛发

        petCharacteristic: [], // 宠物特点

        adoptRequirements: [], //领养要求

        story: "", //送养故事

        address: "", //所在地
        wxId: "", //微信号
        mobilePhone: "", //手机号

        createBy: util.cookies.get('userId'),
        orgId: util.cookies.get('orgId'),
      },
      picArr: [],
      fileList: [],
      dialogImageUrl: '',
      dialogVisible: false,
      canUpload: true,
      ossData: { 'userId ': util.cookies.get('userId'), 'ossZone ': 'adopt' },
      ageRange: ['不详', '0-3个月', '4-6个月', '7-12个月', '1岁', '2岁', '3岁', '4岁', '5岁', '6岁', '7岁',
        '8岁', '9岁', '10岁', '11岁', '12岁', '13岁', '14岁', '15岁', '16岁', '17岁', '18岁', '19岁', '20岁'],
      petCharacteristic: [
        {
          name: '讲卫生',
          value: '1',
          checked: false
        },
        {
          name: '亲人',
          value: '2',
          checked: false
        },
        {
          name: '不乱叫',
          value: '3',
          checked: false
        },
        {
          name: '高冷',
          value: '4',
          checked: false
        },
        {
          name: '胆小',
          value: '5',
          checked: false
        },
        {
          name: '健康',
          value: '6',
          checked: false
        },
        {
          name: '无攻击性',
          value: '7',
          checked: false
        },
        {
          name: '会看家',
          value: '8',
          checked: false
        },
        {
          name: '活泼',
          value: '9',
          checked: false
        },
        {
          name: '聪明',
          value: '10',
          checked: false
        }
      ],
      adoptRequirements: [
        {
          name: '领养前取得家人的同意。',
          value: '1',
          checked: false
        }, {
          name: '不离不弃，有病就医，不虐待，不买卖。',
          value: '2',
          checked: false
        }, {
          name: '文明养宠，出门牵绳子，科学喂养。',
          value: '3',
          checked: false
        }, {
          name: '签订领养协议。',
          value: '4',
          checked: false
        }, {
          name: '接受随访。',
          value: '5',
          checked: false
        }, {
          name: '有防盗门，纱窗护网。',
          value: '6',
          checked: false
        }, {
          name: '按时打疫苗。',
          value: '7',
          checked: false
        }, {
          name: '适龄绝育。',
          value: '8',
          checked: false
        }, {
          name: '工作稳定，有一定经济基础。',
          value: '9',
          checked: false
        }, {
          name: '其他(先勾选再填信息)',
          value: '10',
          checked: false
        }],
      requirementsText: "",
      addressRange: ["上海市 黄浦区", "上海市 徐汇区", "上海市 长宁区", "上海市 静安区", "上海市 普陀区", "上海市 虹口区",
        "上海市 杨浦区", "上海市 闵行区", "上海市 宝山区", "上海市 嘉定区", "上海市 浦东新区", "上海市 金山区",
        "上海市 松江区", "上海市 青浦区", "上海市 奉贤区", "上海市 崇明区"],
      formRules: {
        mediaList: [
          { required: true, message: '请选择照片', trigger: 'change' },
        ],
        petName: [
          { required: true, message: '请输入昵称', trigger: 'blur' },
        ],
        petAge: [
          { required: true, message: '请输入年龄', trigger: 'change' },
        ],
        petType: [
          { required: true, message: '请选择类型', trigger: 'change' },
        ],
        petSex: [
          { required: true, message: '请选择性别', trigger: 'change' },
        ],
        petSterilization: [
          { required: true, message: '请选择绝育情况', trigger: 'change' },
        ],
        petVaccine: [
          { required: true, message: '请选择疫苗情况', trigger: 'change' },
        ],
        petParasite: [
          { required: true, message: '请选择驱虫情况', trigger: 'change' },
        ],
        petSomatotype: [
          { required: true, message: '请选择体型情况', trigger: 'change' },
        ],
        petHair: [
          { required: true, message: '请选择毛发情况', trigger: 'change' },
        ],
        petCharacteristic: [
          { required: true, message: '请选择宠物特点', trigger: 'change' },
        ],
        adoptRequirements: [
          { required: true, message: '请选择领养要求', trigger: 'change' },
        ],
        story: [
          { required: true, message: '请输入送养故事', trigger: 'blur' },
        ],
        address: [
          { required: true, message: '请选择address', trigger: 'change' },
        ],
        wxId: [
          { required: true, message: '请填写微信号', trigger: 'blur' },
        ],
        mobilePhone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: validMobile, message: '请输入正确的手机号', trigger: 'blur' },
        ],
      }
    }
  },
  mounted () {
    orgId = util.cookies.get("orgId")
    if (orgId == '' || orgId == null || typeof orgId == 'undefined') {
      this.$router.push({
        name: 'login'
      })
      return
    }
    this.pageType = this.$route.query.type;
    if (this.pageType === "edit") {
      this.adoptDetail()
    }
  },
  methods: {
    adoptDetail () {
      //清空遗留数据
      this.picArr = []
      this.fileList = []
      this.requirementsText = ''
      let data = {
        petId: this.$route.query.petId,
        userId: util.cookies.get("userId")
      };
      this.pageLoading = true;
      adoptDetail(data).then(res => {
        this.pageLoading = false;
        console.log(res.petInfo)
        this.form = JSON.parse(JSON.stringify(res.petInfo))
        this.form.mediaList.forEach(_data => {
          let file = {
            name: '',
            mediaId: _data.mediaId,
            url: "https://pic.linchongpets.com/" + _data.mediaPath
          }
          this.fileList.push(file)
        });
        this.picArr = this.form.mediaList
        this.form.mediaList = JSON.stringify(this.form.mediaList)
        let characteristicArr = []
        JSON.parse(this.form.petCharacteristic).forEach(_data => {
          characteristicArr.push(_data.value)
        });
        this.form.petCharacteristic = characteristicArr
        let requirementsArr = []
        JSON.parse(this.form.adoptRequirements).forEach(_data => {
          if (_data.value === "10") {
            this.requirementsText = _data.name
          }
          requirementsArr.push(_data.value)
        });
        this.form.adoptRequirements = requirementsArr
      });
    },
    adoptNew () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.picArr.length == 0) {
            this.$message.error('宠物图片不能为空')
            return
          }
          let formData = JSON.parse(JSON.stringify(this.form))
          let petCharacteristicArr = []
          this.petCharacteristic.forEach(_data => {
            for (let value of formData.petCharacteristic) {
              if (_data.value === value) {
                var characterItem = {
                  name: _data.name,
                  value: _data.value
                }
                petCharacteristicArr.push(characterItem)
              }
            }
          });
          let adoptRequirementsArr = []
          this.adoptRequirements.forEach(_data => {
            for (let value of formData.adoptRequirements) {
              if (_data.value === value) {
                if (value === "10") {
                  _data.name = this.requirementsText
                }
                var requirement = {
                  name: _data.name,
                  value: _data.value
                }
                adoptRequirementsArr.push(requirement)
              }
            }
          });
          formData.mediaList = JSON.parse(formData.mediaList);
          formData.petCharacteristic = JSON.stringify(petCharacteristicArr);
          formData.adoptRequirements = JSON.stringify(adoptRequirementsArr);
          formData.createBy = util.cookies.get('userId');
          formData.orgId = util.cookies.get('orgId');
          this.pageLoading = true;
          if (this.pageType === "edit") {
            formData.petId = this.$route.query.petId
            formData.adoptStatus = 0
            debugger
            adoptEdit(formData).then(res => {
              console.log(res)
              this.pageLoading = false;
              this.$message.success('更新成功')
              if (this.pageType === "edit") {
                this.adoptDetail()
              }
              // this.$router.push('/adoptRelease/index')
            });
          } else if (this.pageType === "new") {
            debugger
            adoptNew(formData).then(res => {
              console.log(res)
              this.pageLoading = false;
              this.$message.success('创建成功')
              this.$refs['form'].resetFields();
              this.picArr = []
              this.fileList = []
              this.requirementsText = ''
            });
          }
        }
      })
    },
    handleRemove (file, fileList) {
      console.log(file)
      let tempMediaList = JSON.parse(this.form.mediaList)
      tempMediaList.forEach(picItem => {
        debugger
        if (file.mediaId == picItem.mediaId) {
          picItem.isValid = 0
        }
      })
      this.form.mediaList = JSON.stringify(tempMediaList)
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
      this.canUpload = true
      console.log(file)
      let picFile = {
        mediaType: file.response.data.substring(file.response.data.indexOf('.') + 1),
        mediaPath: file.response.data,
        isValid: 1
      };
      this.picArr.push(picFile)
      let tempMediaList = []
      if (this.form.mediaList = '') {
        tempMediaList = JSON.parse(this.form.mediaList)
      }
      tempMediaList.push(picFile)
      this.form.mediaList = JSON.stringify(tempMediaList)
    },
    handleBefore () {
      if (this.picArr.length > 5) {
        alert("图片最多上传6张！");
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

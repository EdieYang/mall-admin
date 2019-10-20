<template>
  <d2-container>
    <div style="width:100%;">
      <el-card v-loading="pageLoading">
        <el-divider content-position="left">创建商品信息</el-divider>
        <el-steps :active="step"
                  align-center>
          <el-step title="商品初始化"
                   description="商品初始状态设置"></el-step>
          <el-step title="录入商品信息"
                   description="完善所有版块设置"></el-step>
          <el-step title="预览及校验商品"
                   description="预览无误才可提交审核"></el-step>
        </el-steps>
        <div v-show="step===1">
          <el-form ref="form"
                   :model="form"
                   label-width="110px"
                   label-position="left"
                   :rules="formRules"
                   style="width:640px;display:inline-block;margin-top:50px;">

            <el-form-item label="商品类型"
                          prop="commodityType">
              <el-radio v-for="item in commodityTypeRadios"
                        v-model="form.commodityType"
                        :label="item.value"
                        border
                        size="medium">{{item.label}}</el-radio>
            </el-form-item>
            <el-form-item label="商品模式"
                          prop="commodityPattern">
              <el-radio v-for="item in commodityPatternRadios"
                        v-model="form.commodityPattern"
                        :label="item.value"
                        size="medium">{{item.label}}</el-radio>
            </el-form-item>
            <el-form-item label="商品多属性"
                          prop="multiSpec">
              <el-switch v-model="form.multiSpec"
                         active-text="设置一种或多种规格属性，当商品需要设置规格属性时必须打开"
                         inactive-text="">
              </el-switch>
            </el-form-item>
            <el-form-item label="加入分销功能"
                          prop="distributed">
              <el-switch v-model="form.distributed"
                         active-text="已打开分销设置"
                         inactive-text="">
              </el-switch>
            </el-form-item>
          </el-form>
        </div>

        <div v-show="step===2">
          <el-tabs v-model="activeName"
                   @tab-click="handleClick"
                   style="margin-top:50px;">
            <el-tab-pane label="基础设置"
                         name="defaultSetting">
              <el-form ref="form"
                       :model="form"
                       label-width="110px"
                       label-position="left"
                       :rules="formRules"
                       class="form-container">

                <el-form-item label="商品名称"
                              prop="commodityName">
                  <el-input v-model="form.commodityName"></el-input>
                </el-form-item>
                <el-form-item label="商品图片"
                              prop="commodityImages">
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

                <el-form-item label="商品展示图片"
                              prop="displayImage">
                  <el-upload :action="actionUrl"
                             list-type="picture-card"
                             :data="ossData"
                             :on-preview="handlePictureCardPreview"
                             :on-remove="handleRemove"
                             :on-success="handleSuccess"
                             :before-upload="handleBefore">
                    <i class="el-icon-plus"></i>
                  </el-upload>
                  <el-dialog :visible.sync="dialogVisible"
                             :modal-append-to-body="false">
                    <img width="100%"
                         :src="dialogImageUrl"
                         alt="">
                  </el-dialog>
                </el-form-item>
                <el-form-item label="售卖日期"
                              prop="saleDate">
                  <el-date-picker v-model="form.saleDate"
                                  type="datetimerange"
                                  range-separator="至"
                                  start-placeholder="开始日期"
                                  end-placeholder="结束日期">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="商品购买须知"
                              prop="commodityRules">
                  <el-input type="textarea"
                            autosize
                            placeholder="请输入购买须知"
                            v-model="form.commodityRules"></el-input>
                </el-form-item>
                <el-form-item label="商品使用须知"
                              prop="commodityUsage">
                  <el-input type="textarea"
                            autosize
                            placeholder="请输入使用须知"
                            v-model="form.commodityUsage"></el-input>
                </el-form-item>
                <el-form-item label="退款模式"
                              prop="refundType">
                  <el-radio v-for="item in refundTypeRadios"
                            v-model="form.refundType"
                            :label="item.value"
                            border
                            size="medium">{{item.label}}</el-radio>

                </el-form-item>
                <el-button type="primary"
                           round
                           plain
                           size="small"
                           @click="stepOver('stockSetting')">前往价格/库存设置<i class="el-icon-arrow-right el-icon--right"></i></el-button>
              </el-form>

            </el-tab-pane>
            <el-tab-pane label="价格/库存"
                         name="stockSetting">

              <el-form ref="form"
                       :model="form"
                       label-width="110px"
                       label-position="left"
                       :rules="formRules"
                       class="form-container">

                <el-form-item label="市场价"
                              prop="marketPrice">
                  <el-col :span="8">
                    <el-input v-model="form.marketPrice">
                      <template slot="append">元</template></el-input>
                  </el-col>
                </el-form-item>
                <el-form-item label="平台售价"
                              prop="sellingPrice">
                  <el-col :span="8">
                    <el-input v-model="form.sellingPrice">
                      <template slot="append">元</template></el-input>
                  </el-col>
                </el-form-item>
                <el-form-item label="商家结算价"
                              prop="purchasePrice">
                  <el-col :span="8">
                    <el-input v-model="form.purchasePrice">
                      <template slot="append">元</template></el-input>
                  </el-col>
                </el-form-item>
                <el-divider content-position="left">库存设置</el-divider>
                <el-form-item label="库存"
                              prop="purchasePrice">
                  <el-col :span="8">
                    <el-input v-model="form.stock">
                    </el-input>
                  </el-col>
                </el-form-item>
                <el-form-item label="库存预警"
                              prop="stockWarn">
                  <el-col :span="6">
                    <el-switch v-model="stockWarnBoolean"
                               active-text="开启"
                               inactive-text="关闭">
                    </el-switch>
                  </el-col>
                  <el-col :span="4"
                          v-if="stockWarnBoolean">
                    <el-input v-model="form.stockWarn">
                    </el-input>
                  </el-col>
                </el-form-item>
                <el-form-item label="基础销量"
                              prop="saleCount">
                  <el-col :span="8">
                    <el-input v-model="form.saleCount">
                    </el-input>
                  </el-col>
                </el-form-item>
                <el-form-item label="基础浏览量"
                              prop="browseCount">
                  <el-col :span="8">
                    <el-input v-model="form.browseCount">
                    </el-input>
                  </el-col>
                </el-form-item>

                <el-form-item label="库存展示"
                              prop="showStock">
                  <el-col :span="6">
                    <el-switch v-model="form.showStock"
                               active-text="显示"
                               inactive-text="隐藏">
                    </el-switch>
                  </el-col>
                </el-form-item>
                <el-form-item label="销量展示"
                              prop="showSale">
                  <el-col :span="6">
                    <el-switch v-model="form.showSale"
                               active-text="显示"
                               inactive-text="隐藏">
                    </el-switch>
                  </el-col>
                </el-form-item>

                <el-button type="primary"
                           round
                           plain
                           size="small"
                           icon="el-icon-arrow-left"
                           @click="stepOver('defaultSetting')">返回基础设置</el-button>
                <el-button type="primary"
                           round
                           plain
                           size="small"
                           @click="stepOver('verificationSetting')">前往核销设置<i class="el-icon-arrow-right el-icon--right"></i></el-button>
              </el-form>

            </el-tab-pane>
            <el-tab-pane label="核销设置"
                         name="verificationSetting">

              <el-form ref="form"
                       :model="form"
                       label-width="110px"
                       label-position="left"
                       :rules="formRules"
                       class="form-container">

                <el-form-item label="商家"
                              prop="shopId">
                  <el-col :span="24">
                    <el-select v-model="form.shopId"
                               multiple
                               filterable
                               placeholder="请选择"
                               style="width:100%">
                      <el-option v-for="item in options"
                                 :key="item.value"
                                 :label="item.label"
                                 :value="item.value">
                      </el-option>
                    </el-select>
                  </el-col>
                </el-form-item>
                <el-form-item label="核销方式"
                              prop="verificationType">
                  <el-radio v-model="form.verificationType"
                            label="0">默认核销时间</el-radio>
                  <el-radio v-model="form.verificationType"
                            label="1">自定义核销时间</el-radio>
                </el-form-item>
                <el-form-item label="核销日期"
                              prop="verificationDate"
                              v-if="form.verificationType==='0'">
                  <el-date-picker v-model="form.verificationDate"
                                  type="datetimerange"
                                  range-separator="至"
                                  start-placeholder="开始日期"
                                  end-placeholder="结束日期">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="自定义核销时间"
                              prop="verificationDate"
                              v-if="form.verificationType==='1'">
                  <el-col :span="8">
                    <el-input v-model="form.verificationDate">
                    </el-input>
                  </el-col>
                </el-form-item>
                <el-form-item label="限购数量"
                              prop="purchaseLimit">
                  <el-col :span="8">
                    <el-input v-model="form.purchaseLimit">
                    </el-input>
                  </el-col>
                </el-form-item>

                <el-button type="primary"
                           round
                           plain
                           size="small"
                           icon="el-icon-arrow-left"
                           @click="stepOver('stockSetting')">返回价格/库存设置</el-button>
                <el-button type="primary"
                           round
                           plain
                           size="small"
                           @click="stepOver('commodityDetailSetting')">前往商品详情设置<i class="el-icon-arrow-right el-icon--right"></i></el-button>
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="商品详情"
                         name="commodityDetailSetting">
              <el-row>
                <el-col :span="12">
                  <d2-ueditor v-model="form.commodityDetail"
                              style="margin-top:20px;margin-bottom:20px;" />
                </el-col>
              </el-row>
              <el-button type="primary"
                         round
                         plain
                         size="small"
                         icon="el-icon-arrow-left"
                         @click="stepOver('verificationSetting')">返回核销设置</el-button>
              <el-button type="primary"
                         round
                         plain
                         size="small"
                         @click="stepOver('customerServiceSetting')">前往客服/社群设置<i class="el-icon-arrow-right el-icon--right"></i></el-button>
            </el-tab-pane>
            <el-tab-pane label="客服/社群"
                         name="customerServiceSetting">
              <el-form ref="form"
                       :model="form"
                       label-width="110px"
                       label-position="left"
                       :rules="formRules"
                       class="form-container">

                <el-form-item label="客服联系方式"
                              prop="csContact">
                  <el-col :span="8">
                    <el-input v-model="form.csContact">
                    </el-input>
                  </el-col>
                </el-form-item>

                <el-form-item label="客服二维码"
                              prop="csWxcode">
                  <el-upload :action="actionUrl"
                             list-type="picture-card"
                             :data="ossData"
                             :on-preview="handlePictureCardPreview"
                             :on-remove="handleRemove"
                             :on-success="handleSuccess"
                             :before-upload="handleBefore">
                    <i class="el-icon-plus"></i>
                  </el-upload>
                  <el-dialog :visible.sync="dialogVisible"
                             :modal-append-to-body="false">
                    <img width="100%"
                         :src="dialogImageUrl"
                         alt="">
                  </el-dialog>
                </el-form-item>

                <el-button type="primary"
                           round
                           plain
                           size="small"
                           icon="el-icon-arrow-left"
                           @click="stepOver('commodityDetailSetting')">返回商品详情设置</el-button>
                <el-button type="primary"
                           round
                           plain
                           size="small"
                           @click="stepOver('shareSetting')">前往分享设置<i class="el-icon-arrow-right el-icon--right"></i></el-button>
              </el-form>

            </el-tab-pane>
            <el-tab-pane label="分享设置"
                         name="shareSetting">
              <el-form ref="form"
                       :model="form"
                       label-width="110px"
                       label-position="left"
                       :rules="formRules"
                       class="form-container">

                <el-form-item label="分享标题"
                              prop="shareTitle">
                  <el-col :span="24">
                    <el-input v-model="form.shareTitle">
                    </el-input>
                  </el-col>
                </el-form-item>
                <el-form-item label="分享详情"
                              prop="shareInfo">
                  <el-col :span="24">
                    <el-input v-model="form.shareInfo">
                    </el-input>
                  </el-col>
                </el-form-item>
                <el-form-item label="wap分享图片"
                              prop="shareWapImg">
                  <el-upload :action="actionUrl"
                             list-type="picture-card"
                             :data="ossData"
                             :on-preview="handlePictureCardPreview"
                             :on-remove="handleRemove"
                             :on-success="handleSuccess"
                             :before-upload="handleBefore">
                    <i class="el-icon-plus"></i>
                  </el-upload>
                  <el-dialog :visible.sync="dialogVisible"
                             :modal-append-to-body="false">
                    <img width="100%"
                         :src="dialogImageUrl"
                         alt="">
                  </el-dialog>
                </el-form-item>
                <el-form-item label="小程序分享图片"
                              prop="shareMiniImg">
                  <el-upload :action="actionUrl"
                             list-type="picture-card"
                             :data="ossData"
                             :on-preview="handlePictureCardPreview"
                             :on-remove="handleRemove"
                             :on-success="handleSuccess"
                             :before-upload="handleBefore">
                    <i class="el-icon-plus"></i>
                  </el-upload>
                  <el-dialog :visible.sync="dialogVisible"
                             :modal-append-to-body="false">
                    <img width="100%"
                         :src="dialogImageUrl"
                         alt="">
                  </el-dialog>
                </el-form-item>
                <el-form-item label="自定义海报"
                              prop="sharePost">
                  <el-upload :action="actionUrl"
                             list-type="picture-card"
                             :data="ossData"
                             :on-preview="handlePictureCardPreview"
                             :on-remove="handleRemove"
                             :on-success="handleSuccess"
                             :before-upload="handleBefore">
                    <i class="el-icon-plus"></i>
                  </el-upload>
                  <el-dialog :visible.sync="dialogVisible"
                             :modal-append-to-body="false">
                    <img width="100%"
                         :src="dialogImageUrl"
                         alt="">
                  </el-dialog>
                </el-form-item>
                <el-button type="primary"
                           round
                           plain
                           size="small"
                           icon="el-icon-arrow-left"
                           @click="stepOver('customerServiceSetting')">返回客服/社群设置</el-button>
                <el-button type="primary"
                           round
                           plain
                           size="small"
                           @click="stepOver('pointSetting')">前往积分设置<i class="el-icon-arrow-right el-icon--right"></i></el-button>
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="积分设置"
                         name="pointSetting">
              <el-form ref="form"
                       :model="form"
                       label-width="110px"
                       label-position="left"
                       :rules="formRules"
                       class="form-container">

                <el-form-item label="购买所得积分"
                              prop="purchasePoints">
                  <el-col :span="12">
                    <el-input v-model="form.purchasePoints">
                    </el-input>
                  </el-col>
                </el-form-item>
              </el-form>

            </el-tab-pane>
            <el-tab-pane label="分销设置"
                         name="distributeSetting"
                         v-if="form.distributed">
              <el-form ref="form"
                       :model="form"
                       label-width="160px"
                       label-position="left"
                       :rules="formRules"
                       class="form-container">

                <el-form-item label="Lv1分销佣金比例(%)"
                              prop="commissionLevelOne">
                  <el-col :span="4">
                    <el-input v-model="form.commissionLevelOne">
                    </el-input>
                  </el-col>
                  <el-col :span="12"
                          style="margin-left:20px;">
                    <span class="col-span">佣金：2.45元</span>
                    <span class="col-span">利润：<span class="s-profit">33.22元</span></span>
                  </el-col>
                </el-form-item>
                <el-form-item label="Lv2分销佣金比例(%)"
                              prop="commissionLevelTwo">
                  <el-col :span="4">
                    <el-input v-model="form.commissionLevelTwo">
                    </el-input>
                  </el-col>
                  <el-col :span="12"
                          style="margin-left:20px;">
                    <span class="col-span">佣金：2.45元</span>
                    <span class="col-span">利润：<span class="s-profit">33.22元</span></span>
                  </el-col>
                </el-form-item>
                <el-form-item label="Lv3分销佣金比例(%)"
                              prop="commissionLevelThree">
                  <el-col :span="4">
                    <el-input v-model="form.commissionLevelThree">
                    </el-input>
                  </el-col>
                  <el-col :span="12"
                          style="margin-left:20px;">
                    <span class="col-span">佣金：2.45元</span>
                    <span class="col-span">利润：<span class="s-profit">33.22元</span></span>
                  </el-col>
                </el-form-item>
              </el-form>
            </el-tab-pane>

            <el-tab-pane label="多属性设置"
                         name="multiSpecSetting"
                         v-if="form.multiSpec">
              <el-form ref="form"
                       :model="form"
                       label-width="160px"
                       label-position="left"
                       :rules="formRules"
                       class="form-container"
                       style="width:100%;">
                <el-form-item label="商品规格"
                              prop="commoditySpec">

                  <el-row>
                    <el-col :span="8">商品属性名</el-col>
                    <el-col :span="3">市场价格</el-col>
                    <el-col :span="3">结算价格</el-col>
                    <el-col :span="3">售价</el-col>
                    <el-col :span="3">库存</el-col>
                    <el-col :span="4">操作</el-col>
                  </el-row>
                  <el-row class="inputSpecRow">
                    <el-col :span="8">
                      <el-input v-model="form.specName"
                                style="width:90%;"></el-input>
                    </el-col>
                    <el-col :span="3">
                      <el-input v-model="form.marketPrice"
                                style="width:80%;"></el-input>
                    </el-col>
                    <el-col :span="3">
                      <el-input v-model="form.purchasePrice"
                                style="width:80%;"></el-input>
                    </el-col>
                    <el-col :span="3">
                      <el-input v-model="form.sellingPrice"
                                style="width:80%;"></el-input>
                    </el-col>
                    <el-col :span="3">
                      <el-input v-model="form.stock"
                                style="width:80%;"></el-input>
                    </el-col>
                    <el-col :span="4">
                      <el-button type="danger"
                                 size="small">删除</el-button>
                    </el-col>
                  </el-row>
                  <el-row class="inputSpecRow">
                    <el-col :span="8">
                      <el-input v-model="form.specName"
                                style="width:90%;"></el-input>
                    </el-col>
                    <el-col :span="3">
                      <el-input v-model="form.marketPrice"
                                style="width:80%;"></el-input>
                    </el-col>
                    <el-col :span="3">
                      <el-input v-model="form.purchasePrice"
                                style="width:80%;"></el-input>
                    </el-col>
                    <el-col :span="3">
                      <el-input v-model="form.sellingPrice"
                                style="width:80%;"></el-input>
                    </el-col>
                    <el-col :span="3">
                      <el-input v-model="form.stock"
                                style="width:80%;"></el-input>
                    </el-col>
                    <el-col :span="4">
                      <el-button type="danger"
                                 size="small">删除</el-button>
                    </el-col>
                  </el-row>
                  <el-button type="primary"
                             size="small">添加属性</el-button>
                </el-form-item>
              </el-form>
            </el-tab-pane>
          </el-tabs>

        </div>

      </el-card>
    </div>
    <template slot="footer">
      <el-button type="primary"
                 round
                 plain
                 size="large"
                 @click="nextStep"
                 v-if="step===1">前往录入商品信息设置<i class="el-icon-arrow-right el-icon--right"></i></el-button>
      <el-button type="primary"
                 round
                 plain
                 size="large"
                 icon="el-icon-arrow-left"
                 @click="previousStep"
                 v-if="step===2">返回商品初始设置</el-button>
      <el-button type="danger"
                 round
                 size="large"
                 @click="nextStep"
                 v-if="step===2">保存商品信息并预览<i class="el-icon-arrow-right el-icon--right"></i></el-button>
    </template>
  </d2-container>

</template>

<script>
import { shopNew, shopDetail, shopEdit, getShopId } from "@/api/shop/shopApi"
import util from '@/libs/util'
var shopId = ''

export default {
  name: "commodityDetail",
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
      step: 1,
      activeName: 'defaultSetting',
      form: {
        commodityType: '1',
        commodityPattern: '',
        multiSpec: false,
        distributed: false,
        commodityName: '',
        stockWarn: 0,
        saleCount: 0,
        browseCount: 0,
        showStock: false,
        showSale: false,
        shopId: [],
        verificationType: '0',
        commodityDetail: ''
      },
      options: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }],
      stockWarnBoolean: false,
      commodityTypeRadios: [{
        label: '普通商品',
        value: '0'
      }, {
        label: '活动商品',
        value: '1'
      }],
      commodityPatternRadios: [{
        label: '线上核销',
        value: '0'
      }, {
        label: '线下物流',
        value: '1'
      }, {
        label: '线下物流+自提',
        value: '2'
      }],
      refundTypeRadios: [{
        label: '不可退款',
        value: '0'
      }, {
        label: '过期后不可退款',
        value: '1'
      }, {
        label: '可退款',
        value: '2'
      }],
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
    nextStep () {
      this.step = ++this.step
    },
    previousStep () {
      this.step = --this.step
    },
    stepOver (tagName) {
      this.activeName = tagName
    },
    handleClick (tab, event) {
      console.log(tab, event);
    },
    shopDetail () {
      //清空遗留数据
      let shopId = this.$route.query.shopId;
      this.pageLoading = true;
      shopDetail(shopId).then(res => {
        this.pageLoading = false;
        console.log(res)
        this.form = res.shopInfo
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
.form-container {
  width: 640px;
  display: inline-block;
  margin-top: 20px;
}
.el-form-item__content {
  line-height: 20px;
}
.col-span {
  margin-right: 10px;
}
.s-profit {
  color: #f56c6c;
}
.inputSpecRow {
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>

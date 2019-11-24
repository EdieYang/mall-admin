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
          <el-form ref="form1"
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
              <el-form ref="form2"
                       :model="form"
                       label-width="110px"
                       label-position="left"
                       :rules="formRules"
                       class="form-container">

                <el-form-item label="商品名称"
                              prop="commodityName">
                  <el-input v-model="form.commodityName"
                            placeholder="请输入商品名称"></el-input>
                </el-form-item>
                <el-form-item label="商品图片"
                              prop="commodityImgList"
                              ref="commodityImgList">
                  <el-upload :action="actionUrl"
                             list-type="picture-card"
                             :data="commodityImgOssParam"
                             :on-preview="handlePictureCardPreview"
                             :on-remove="handleCommodityImageRemove"
                             :on-success="handleCommodityImageSuccess"
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

                <el-form-item label="商品展示图片"
                              prop="commodityDisplayImg"
                              ref="commodityDisplayImg">
                  <el-upload :action="actionUrl"
                             list-type="picture-card"
                             :data="commodityImgOssParam"
                             :on-preview="handlePictureCardPreview"
                             :on-remove="handleDisplayRemove"
                             :on-success="handleDisplaySuccess"
                             :before-upload="handleBefore"
                             :limit="1">
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
                                  value-format="yyyy-MM-dd HH:mm:ss"
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

              <el-form ref="form3"
                       :model="form"
                       label-width="110px"
                       label-position="left"
                       :rules="formRules"
                       class="form-container">

                <el-form-item label="市场价"
                              prop="marketPrice">
                  <el-col :span="9">
                    <el-input v-model="form.marketPrice"
                              @change="handleMarketPriceChange"
                              placeholder="保留2位小数"
                              type="number"
                              step="0.01"
                              min="0">
                      <template slot="append">元</template></el-input>
                  </el-col>
                </el-form-item>
                <el-form-item label="平台售价"
                              prop="sellingPrice">
                  <el-col :span="9">
                    <el-input v-model="form.sellingPrice"
                              @change="handleSellingPriceChange"
                              placeholder="保留2位小数"
                              type="number"
                              step="0.01"
                              min="0">
                      <template slot="append">元</template></el-input>
                  </el-col>
                </el-form-item>
                <el-form-item label="商家结算价"
                              prop="purchasePrice">
                  <el-col :span="9">
                    <el-input v-model="form.purchasePrice"
                              placeholder="保留2位小数"
                              type="number"
                              step="0.01"
                              min="0">
                      <template slot="append">元</template></el-input>
                  </el-col>
                </el-form-item>
                <el-divider content-position="left">库存设置</el-divider>
                <el-form-item label="库存"
                              prop="stock">
                  <el-col :span="8">
                    <el-input v-model="form.stock"
                              placeholder="请输入库存"
                              type="number"
                              step="1"
                              min="0">
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
                  <el-col :span="8"
                          v-if="stockWarnBoolean">
                    <el-input v-model="form.stockWarn"
                              @change="handelStockWarnChange"
                              placeholder="请输入库存预警值"
                              type="number"
                              step="1"
                              min="0">
                    </el-input>
                  </el-col>
                </el-form-item>
                <el-form-item label="基础销量"
                              prop="saleCount">
                  <el-col :span="8">
                    <el-input v-model="form.saleCount"
                              placeholder="请输入基础销量"
                              type="number"
                              step="1">
                    </el-input>
                  </el-col>
                </el-form-item>
                <el-form-item label="基础浏览量"
                              prop="browseCount">
                  <el-col :span="8">
                    <el-input v-model="form.browseCount"
                              placeholder="请输入基础浏览量"
                              type="number"
                              step="1">
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
              <el-form ref="form4"
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
                               placeholder="请选择商品所属的商家"
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
                                  value-format="yyyy-MM-dd HH:mm:ss"
                                  range-separator="至"
                                  start-placeholder="开始日期"
                                  end-placeholder="结束日期">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="核销天数"
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
                    <el-input v-model="form.purchaseLimit"
                              placeholder="请输入限购数量"
                              type="number"
                              step="1"
                              min="0">
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
              <p class="s-warning ">录入商品详情，如果是HTML代码，请先点击左上角HTML按钮后再粘贴</p>
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
              <el-form ref="form5"
                       :model="form"
                       label-width="110px"
                       label-position="left"
                       :rules="formRules"
                       class="form-container">

                <el-form-item label="客服联系方式"
                              prop="csContact">
                  <el-col :span="8">
                    <el-input v-model="form.csContact"
                              placeholder="请输入客服联系方式">
                    </el-input>
                  </el-col>
                </el-form-item>

                <el-form-item label="客服二维码"
                              prop="csWxcode"
                              ref="csWxcode">
                  <el-upload :action="actionUrl"
                             list-type="picture-card"
                             :data="csOssParam"
                             :on-preview="handlePictureCardPreview"
                             :on-remove="handleCsWxcodeRemove"
                             :on-success="handleCsWxcodeSuccess"
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
              <el-form ref="form6"
                       :model="form"
                       label-width="110px"
                       label-position="left"
                       :rules="formRules"
                       class="form-container">

                <el-form-item label="分享标题"
                              prop="shareTitle">
                  <el-col :span="24">
                    <el-input v-model="form.shareTitle"
                              placeholder="请输入分享标题">
                    </el-input>
                  </el-col>
                </el-form-item>
                <el-form-item label="分享详情"
                              prop="shareInfo">
                  <el-col :span="24">
                    <el-input v-model="form.shareInfo"
                              placeholder="请输入分享详情">
                    </el-input>
                  </el-col>
                </el-form-item>
                <el-form-item label="wap分享图片"
                              prop="shareWapImg"
                              ref="shareWapImg">
                  <el-upload :action="actionUrl"
                             list-type="picture-card"
                             :data="shareOssParam"
                             :on-preview="handlePictureCardPreview"
                             :on-remove="handleShareWapImgRemove"
                             :on-success="handleShareWapImgSuccess"
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
                              prop="shareMiniImg"
                              ref="shareMiniImg">
                  <el-upload :action="actionUrl"
                             list-type="picture-card"
                             :data="shareOssParam"
                             :on-preview="handlePictureCardPreview"
                             :on-remove="handleShareMiniImgRemove"
                             :on-success="handleShareMiniImgSuccess"
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
                              prop="sharePost"
                              ref="sharePost">
                  <el-upload :action="actionUrl"
                             list-type="picture-card"
                             :data="shareOssParam"
                             :on-preview="handlePictureCardPreview"
                             :on-remove="handleSharePostRemove"
                             :on-success="handleSharePostSuccess"
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
              <el-form ref="form7"
                       :model="form"
                       label-width="110px"
                       label-position="left"
                       :rules="formRules"
                       class="form-container">

                <el-form-item label="购买所得积分"
                              prop="purchasePoints">
                  <el-col :span="12">
                    <el-input v-model="form.purchasePoints"
                              placeholder="请输入积分"
                              type="number"
                              step="1">
                    </el-input>
                  </el-col>
                </el-form-item>
              </el-form>

            </el-tab-pane>
            <el-tab-pane label="分销设置"
                         name="distributeSetting"
                         v-if="form.distributed">
              <el-form ref="form8"
                       :model="form"
                       label-width="160px"
                       label-position="left"
                       :rules="formRules"
                       class="form-container">

                <el-form-item label="Lv1分销佣金比例(%)"
                              prop="commissionLevelOne">
                  <el-col :span="4">
                    <el-input v-model="form.commissionLevelOne"
                              @change="handlecommissionOneChange"
                              type="number"
                              step="0.01"
                              min="0"
                              max="100">
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
                    <el-input v-model="form.commissionLevelTwo"
                              @change="handlecommissionTwoChange"
                              type="number"
                              step="0.01"
                              min="0"
                              max="100">
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
                    <el-input v-model="form.commissionLevelThree"
                              @change="handlecommissionThreeChange"
                              type="number"
                              step="0.01"
                              min="0"
                              max="100">
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
              <el-form ref="form9"
                       :model="form"
                       label-width="160px"
                       label-position="left"
                       :rules="formRules"
                       class="form-container"
                       style="width:100%;">
                <el-form-item label="商品规格"
                              prop="commoditySpec">
                  <el-row>
                    <el-col :span="8">商品规格名</el-col>
                    <el-col :span="3">市场价格</el-col>
                    <el-col :span="3">结算价格</el-col>
                    <el-col :span="3">售价</el-col>
                    <el-col :span="3">库存</el-col>
                    <el-col :span="4">操作</el-col>
                  </el-row>
                  <el-row class="inputSpecRow"
                          v-for="(item,index) in form.commoditySpecList"
                          v-bind:key="index">
                    <el-col :span="8">
                      <el-input v-model="item.specName"
                                placeholder="请输入商品属性名"
                                style="width:90%;"></el-input>
                    </el-col>
                    <el-col :span="3">
                      <el-input v-model="item.marketPrice"
                                type="number"
                                step="0.01"
                                min="0"
                                style="width:80%;"></el-input>
                    </el-col>
                    <el-col :span="3">
                      <el-input v-model="item.purchasePrice"
                                type="number"
                                step="0.01"
                                min="0"
                                style="width:80%;"></el-input>
                    </el-col>
                    <el-col :span="3">
                      <el-input v-model="item.sellingPrice"
                                type="number"
                                step="0.01"
                                min="0"
                                style="width:80%;"></el-input>
                    </el-col>
                    <el-col :span="3">
                      <el-input v-model="item.stock"
                                type="number"
                                step="1"
                                min="0"
                                style="width:80%;"></el-input>
                    </el-col>
                    <el-col :span="4"
                            v-if='index!==0'>
                      <el-button type="danger"
                                 size="small"
                                 @click="delSpec(index)">删除</el-button>
                    </el-col>
                  </el-row>
                  <el-button type="primary"
                             size="small"
                             @click="addSpec">添加属性</el-button>
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
                 @click="uploadCommodity"
                 :loading="loading"
                 v-if="step===2">保存商品信息并预览<i class="el-icon-arrow-right el-icon--right"></i></el-button>
    </template>
  </d2-container>

</template>

<script>
import { commodityTableList, commodityNew, commodityDetail, commodityEdit } from "@/api/commodity/commodityApi"
import util from '@/libs/util'
var shopId = ''

export default {
  name: "commodityDetail",
  data () {
    return {
      loading: false,
      pageLoading: false,
      pageType: "",
      canUpload: true,
      picPath: 'https://pic.linchongpets.com/',
      // actionUrl: "https://www.linchongpets.com/lpCmsTest/oss/image",
      actionUrl: '/api/oss/upload',
      step: 1,
      activeName: 'defaultSetting',
      form: {
        commodityType: '0',
        commodityPattern: '0',
        multiSpec: false,
        distributed: false,
        commodityName: '',
        commodityImgList: [],
        commodityDisplayImg: '',
        saleDate: [],
        commodityRules: '',
        commodityUsage: '',
        refundType: '0',
        marketPrice: '',
        sellingPrice: '',
        purchasePrice: '',
        stock: '',
        stockWarn: 0,
        saleCount: 0,
        browseCount: 0,
        showStock: false,
        showSale: false,
        shopId: [],
        verificationType: '0',
        commodityDetail: '',
        csContact: '',
        csWxcode: '',
        shareTitle: '',
        shareInfo: '',
        shareWapImg: '',
        shareMiniImg: '',
        sharePost: '',
        purchasePoints: 0,
        commissionLevelOne: 0,
        commissionLevelTwo: 0,
        commissionLevelThree: 0,
        commoditySpecList: [
          {
            specName: '',
            marketPrice: 0.00,
            purchasePrice: 0.00,
            sellingPrice: 0.00,
            stock: 0
          }
        ]
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
      commodityImgOssParam: { 'path': 'mall/commodity' },
      csOssParam: { 'path': 'mall/customer-service' },
      shareOssParam: { 'path': 'mall/share/wap' },
      formRules: {
        commodityName: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
          { max: 200, message: '长度不得超过200个字', trigger: 'blur' }
        ],
        commodityImgList: [
          { required: true, message: '请上传商品图片', trigger: 'change' }
        ],
        commodityDisplayImg: [
          { required: true, message: '请上传商品展示图片', trigger: 'change' }
        ],
        saleDate: [
          { required: true, message: '请输入售卖日期', trigger: 'blur' }
        ],
        commodityRules: [
          { required: true, message: '请输入商品购买须知', trigger: 'blur' }
        ],
        commodityUsage: [
          { required: true, message: '请输入商品使用须知', trigger: 'blur' }
        ],
        marketPrice: [
          { required: true, message: '请输入有效商品市场价' },
        ],
        sellingPrice: [
          { required: true, message: '请输入有效商品售价' },
        ],
        purchasePrice: [
          { required: true, message: '请输入有效商品结算价' },
        ],
        stock: [
          { required: true, message: '请填写商品库存' },
        ],
        stockWarn: [
          { required: true, message: '请填写有效库存预计值' },
        ],
        shopId: [
          { required: true, message: '请输入商家' }
        ],
        verificationDate: [
          { required: true, message: '请输入核销时间' }
        ],
        purchaseLimit: [
          { required: true, message: '请输入限购数量' }
        ],
        commodityDetail: [
          { required: true, message: '请输入商品详情' }
        ],
        csContact: [
          { required: true, message: '请填写客服联系方式' },
        ],
        csWxcode: [
          { required: true, message: '请填写客服二维码' },
        ],
        shareTitle: [
          { required: true, message: '请填写分享标题' },
        ],
        shareInfo: [
          { required: true, message: '请填写分享内容' },
        ],
        shareWapImg: [
          { required: true, message: '请上传分享wap图片' },
        ],
        sharePost: [
          { required: true, message: '请上传分享海报图片' },
        ],
        purchasePoints: [
          { required: true, message: '请填写购买所得积分' },
        ]
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
    addSpec () {
      var specItem = {
        specName: '',
        marketPrice: 0.00,
        purchasePrice: 0.00,
        sellingPrice: 0.00,
        stock: 0
      }
      this.form.commoditySpecList.push(specItem)
    },
    delSpec (index) {
      this.form.commoditySpecList.splice(index, 1)
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
    uploadCommodity () {
      var that = this
      this.loading = true
      this.pageLoading = true

      var p2 = new Promise(function (resolve, reject) {
        that.$refs['form2'].validate((valid) => {
          if (valid) {
            resolve();
          } else {
            that.$message.error('基础设置数据缺失,请检查数据完整性！')
            that.stopUpload()
          }
        })
        // resolve();
      });
      var p3 = new Promise(function (resolve, reject) {
        that.$refs['form3'].validate((valid) => {
          if (valid) {
            resolve();
          } else {
            setTimeout(function () { that.$message.error('价格/库存设置数据缺失,请检查数据完整性！') }, 100)
            that.stopUpload()
          }
        })
        // resolve();

      });
      var p4 = new Promise(function (resolve, reject) {
        that.$refs['form4'].validate((valid) => {
          if (valid) {
            resolve();
          } else {
            setTimeout(function () { that.$message.error('核销设置数据缺失,请检查数据完整性！') }, 200)
            that.stopUpload()
          }
        })
        // resolve();

      });
      var p5 = new Promise(function (resolve, reject) {
        that.$refs['form5'].validate((valid) => {
          if (valid) {
            resolve();
          } else {
            setTimeout(function () { that.$message.error('客服/社群设置数据缺失,请检查数据完整性！') }, 300)
            that.stopUpload()
          }
        })
        // resolve();

      });
      var p6 = new Promise(function (resolve, reject) {
        that.$refs['form6'].validate((valid) => {
          if (valid) {
            resolve();
          } else {
            setTimeout(function () { that.$message.error('分享设置数据缺失,请检查数据完整性！') }, 400)
            that.stopUpload()
          }
        })
        // resolve();

      });
      var p7 = new Promise(function (resolve, reject) {
        that.$refs['form7'].validate((valid) => {
          if (valid) {
            resolve();
          } else {
            setTimeout(function () { that.$message.error('积分设置数据缺失,请检查数据完整性！') }, 500)
            that.stopUpload()
          }
        })
        // resolve();

      });

      Promise.all([p2, p3, p4, p5, p6, p7]).then(function () {
        var commodityDetail = that.form.commodityDetail
        if (commodityDetail.replace(/(^\s*)|(\s*$)/g, "") == '') {
          that.$message.error('商品详情数据缺失,请检查数据完整性！')
          that.stopUpload()
          return
        }
        //校验分销设置
        if (that.form.distributed) {
          var distributedLevelOne = that.form.commissionLevelOne
          var distributedLevelTwo = that.form.commissionLevelTwo
          var distributedLevelThree = that.form.commissionLevelThree
          if (distributedLevelOne.toString().replace(/[^\d.]/g, "") == '' || distributedLevelTwo.toString().replace(/[^\d.]/g, "") == '' || distributedLevelThree.toString().replace(/[^\d.]/g, "") == '') {
            that.$message.error('商品分销设置数据缺失,请检查数据完整性！')
            that.stopUpload()
            return
          }
          if (distributedLevelOne == 0 || distributedLevelTwo == 0 || distributedLevelThree == 0) {
            that.$message.error('商品分销设置数据必须大于0,请检查数据正确性！')
            that.stopUpload()
            return
          }
        }
        //校验规格设置
        if (that.form.multiSpec) {
          var commoditySpecList = that.form.commoditySpecList
          commoditySpecList.forEach(element => {
            var specName = element.specName
            if (specName.toString().replace(/(^\s*)|(\s*$)/g, "") == '') {
              that.$message.error('商品多属性设置规格名缺失,请检查数据完整性！')
              that.stopUpload()
              return
            }
          })
        }

        var shopIdArr = that.form.shopId
        var shopIds = ''
        for (var i = 0; i < shopIdArr.length; i++) {
          if (shopIdArr[i] !== shopIdArr[shopIdArr.length - 1]) {
            shopIds += shopIdArr[i] + ","
          } else {
            shopIds += shopIdArr[i]
          }
        }

        var verificationDate = that.form.verificationDate
        var verificationType = that.form.verificationType
        if (verificationType == '0') {
          verificationDate = verificationDate[0] + ',' + verificationDate[1]
        }


        var saleDate = that.form.saleDate[0] + ',' + that.form.saleDate[1]


        //填充表单提交
        var commodityInfo = {
          commodityName: that.form.commodityName,
          commodityType: that.form.commodityType,
          commodityPattern: that.form.commodityPattern,
          displayImg: that.form.commodityDisplayImg,
          saleDate: saleDate,
          marketPrice: that.form.marketPrice,
          sellingPrice: that.form.sellingPrice,
          purchasePrice: that.form.purchasePrice,
          stock: that.form.stock,
          stockWarn: that.form.stockWarn,
          distributed: that.form.distributed ? '0' : '1',
          commodityRules: that.form.commodityRules,
          commodityUsage: that.form.commodityUsage,
          commodityDetail: that.form.commodityDetail,
          multiSpec: that.form.multiSpec ? '0' : '1',
          recommended: that.form.recommended ? '0' : '1',
          shopId: shopIds,
          saleCount: that.form.saleCount,
          browseCount: that.form.browseCount,
          showStock: that.form.showStock ? '0' : '1',
          showSale: that.form.showSale ? '0' : '1',
          verificationType: that.form.verificationType,
          verificationDate: verificationDate,
          purchaseLimit: that.form.purchaseLimit,
          csContact: that.form.csContact,
          csWxcode: that.form.csWxcode,
          shareTitle: that.form.shareTitle,
          shareInfo: that.form.shareInfo,
          shareWapImg: that.form.shareWapImg,
          shareMiniImg: that.form.shareMiniImg,
          sharePost: that.form.sharePost,
          purchasePoints: that.form.purchasePoints,
          refundType: that.form.refundType
        }

        var commoditySpecList = []
        that.form.commoditySpecList.forEach(specItem => {
          var spec = {
            specName: specItem.specName,
            marketPrice: specItem.marketPrice,
            sellingPrice: specItem.sellingPrice,
            purchasePrice: specItem.purchasePrice,
            stock: specItem.stock
          }
          commoditySpecList.push(spec)
        })

        var commodityImgList = []
        that.form.commodityImgList.forEach(imgItem => {
          var img = {
            imgName: imgItem.imgName,
            imgUrl: imgItem.imgUrl
          }
          commodityImgList.push(img)
        })

        var commodityDistributeList = [{
          grade: '1',
          commission: that.form.commissionLevelOne
        }, {
          grade: '2',
          commission: that.form.commissionLevelTwo
        }, {
          grade: '3',
          commission: that.form.commissionLevelThree
        }]

        if (that.pageType === "edit") {

        } else {

          let data = {
            commodityInfo: commodityInfo,
            commodityImgList: commodityImgList,
            commoditySpecList: commoditySpecList,
            commodityDistributeList: commodityDistributeList
          }
          commodityNew(data).then(res => {
            console.log(res)

          });

        }


      });
    },
    stopUpload () {
      this.loading = false
      this.pageLoading = false
    },
    handleCommodityImageRemove (file, fileList) {
      var index = 0
      this.form.commodityImgList.forEach(element => {
        if (element.imgName == file.response.data.fileName) {
          this.form.commodityImgList.splice(index, 1)
        }
        index++
      });
    },
    handleCommodityImageSuccess (response, file, fileList) {
      debugger
      let element = {
        imgName: response.data.fileName,
        imgUrl: response.data.relativePath,
      }
      this.form.commodityImgList.push(element)
      this.$refs.commodityImgList.clearValidate()
    },
    handleDisplayRemove (file, fileList) {
      this.form.commodityDisplayImg = ''
    },
    handleDisplaySuccess (response, file, fileList) {
      this.form.commodityDisplayImg = response.data.relativePath
      this.$refs.commodityDisplayImg.clearValidate()
    },
    handleCsWxcodeRemove (file, fileList) {
      this.form.csWxcode = ''
    },
    handleCsWxcodeSuccess (response, file, fileList) {
      this.form.csWxcode = response.data.relativePath
      this.$refs.csWxcode.clearValidate()
    },
    handleShareWapImgRemove (file, fileList) {
      this.form.shareWapImg = ''
    },
    handleShareWapImgSuccess (response, file, fileList) {
      this.form.shareWapImg = response.data.relativePath
      this.$refs.shareWapImg.clearValidate()
    },
    handleShareMiniImgRemove (file, fileList) {
      this.form.shareMiniImg = ''
    },
    handleShareMiniImgSuccess (response, file, fileList) {
      this.form.shareMiniImg = response.data.relativePath
      this.$refs.shareMiniImg.clearValidate()
    },
    handleSharePostRemove (file, fileList) {
      this.form.sharePost = ''
    },
    handleSharePostSuccess (response, file, fileList) {
      this.form.sharePost = response.data.relativePath
      this.$refs.sharePost.clearValidate()
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleBefore () {

    },
    handleMarketPriceChange (value) {
      this.form.marketPrice = this.clearNoNum(value)
    },
    handleSellingPriceChange (value) {
      this.form.sellingPrice = this.clearNoNum(value)
    },
    handelStockWarnChange (value) {
      this.form.stockWarn = this.clearNoPositiveNum(value)
    },
    handlecommissionOneChange (value) {
      this.form.commissionLevelOne = this.clearNoNum(value)
    },
    handlecommissionTwoChange (value) {
      this.form.commissionLevelTwo = this.clearNoNum(value)
    },
    handlecommissionThreeChange (value) {
      this.form.commissionLevelThree = this.clearNoNum(value)
    },
    clearNoNum (value) {
      value = value.replace(/[^\d.]/g, "");  //清除“数字”和“.”以外的字符   
      value = value.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的   
      value = value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
      value = value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');//只能输入两个小数   
      if (value.indexOf(".") < 0 && value != "" || value.indexOf(".") == 0) {//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额  
        value = parseFloat(value);
      }
      return value;
    },
    clearNoPositiveNum (value) {
      if (parseInt(value) + "" !== value) {
        value = parseInt(value)
      }
      return value;
    },
    dispatch (componentName, eventName, params) {
      var parent = this.$parent || this.$root;
      var name = parent.$options.componentName;

      while (parent && (!name || name !== componentName)) {
        parent = parent.$parent;

        if (parent) {
          name = parent.$options.componentName;
        }
      }
      if (parent) {
        parent.$emit.apply(parent, [eventName].concat(params));
      }
    }
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
.s-warning {
  color: #f56c6c;
  font-size: 14px;
}
.inputSpecRow {
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>

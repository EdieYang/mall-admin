<template>
  <d2-container>
    <template slot="header">
      <div class="header-cover">
        <el-form :inline="true" :model="formInline" class="comm-form-inline">
          <el-row>
            <el-form-item label="商品名称" label-width="100px">
              <el-input
                v-model="formInline.commodityName"
                size="small"
              ></el-input>
            </el-form-item>

            <el-form-item label="商品ID" label-width="100px">
              <el-input
                v-model="formInline.commodityId"
                size="small"
              ></el-input>
            </el-form-item>

            <el-form-item label="商家名称" label-width="100px">
              <el-input v-model="formInline.shopName" size="small"></el-input>
            </el-form-item>

            <el-form-item label="是否上架" label-width="100px">
              <el-select
                v-model="formInline.commodityStatus"
                placeholder="请选择"
                size="small"
              >
                <el-option
                  v-for="item in commodityStatusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="模式" label-width="100px">
              <el-select
                v-model="formInline.commodityPattern"
                placeholder="请选择"
                size="small"
              >
                <el-option
                  v-for="item in commodityPatternOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="是否推荐" label-width="100px">
              <el-select
                v-model="formInline.recommended"
                placeholder="请选择"
                size="small"
              >
                <el-option
                  v-for="item in recommendedOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label=" " label-width="100px">
              <el-button type="primary" round="" size="small" @click="search"
                >搜索</el-button
              >
              <el-button type="" round="" size="small" @click="reset"
                >重置</el-button
              >
              <el-button
                type="primary"
                size="small"
                round=""
                icon="el-icon-folder-add"
                @click="newCommodity"
                >创建商品</el-button
              >
            </el-form-item>
          </el-row>
        </el-form>
      </div>
    </template>
    <template>
      <el-table :data="data" style="width: 100%;" height="700">
        <el-table-column label="商品 " width="600" prop="commodityInfo">
          <template slot-scope="scope">
            <div class="info">
              <div class="info-id">商品ID：{{ scope.row.commodityId }}</div>
              <div class="info-body">
                <img
                  :src="picPath + scope.row.displayImg"
                  class="info-display"
                />
                <div class="info-brief">
                  <div class="info-name">
                    <el-tag type="success" v-if="scope.row.onSale == 1"
                      >售卖中</el-tag
                    >
                    {{ scope.row.commodityName }}
                  </div>
                  <div class="info-tip">
                    <el-tag
                      class="tip-reco"
                      type="danger"
                      v-if="scope.row.recommended == '1'"
                      >推荐</el-tag
                    >
                    <el-tag
                      class="tip-reco"
                      type="danger"
                      v-if="scope.row.recommended == '0'"
                      >不推荐</el-tag
                    >
                    <el-tag v-if="scope.row.commodityPattern == 0"
                      >线上核销</el-tag
                    >
                    <el-tag v-if="scope.row.commodityPattern == 1"
                      >线下物流</el-tag
                    >
                    <el-tag v-if="scope.row.commodityPattern == 2"
                      >线下物流+自提</el-tag
                    >
                  </div>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column
          label="访问量"
          align=" center"
          width="140"
          prop="browserAmount"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.browserAmount }}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="销量"
          align="center"
          width="140"
          prop="saleAmount"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.saleAmount }}</span>
          </template>
        </el-table-column>

        <el-table-column label="库存" align="center" width="140">
          <template slot-scope="scope">
            <span>{{ scope.row.stock }}</span>
          </template>
        </el-table-column>

        <el-table-column label="成交额" align="center" width="140">
          <template slot-scope="scope">
            <span>{{ scope.row.turnover }}</span>
          </template>
        </el-table-column>

        <el-table-column label="分销佣金" align="center" width="140">
          <template slot-scope="scope">
            <span>{{ scope.row.distributeAmount }}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="商品状态"
          align="center"
          width="120"
          fixed="right"
          prop="commodityStatus"
        >
          <template slot-scope="scope">
            <el-tag
              type="danger"
              v-if="scope.row.commodityStatus == 0"
              effect="dark"
              >下架</el-tag
            >
            <el-tag
              type="warning"
              v-if="scope.row.commodityStatus == 1"
              effect="dark"
              >待审核</el-tag
            >
            <el-tag
              type="primary"
              v-if="scope.row.commodityStatus == 2"
              effect="dark"
              >审核通过</el-tag
            >
            <el-tag
              type="danger"
              v-if="scope.row.commodityStatus == 3"
              effect="dark"
              >上架</el-tag
            >
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center" width="180" fixed="right">
          <template slot-scope="scope">
            <el-tooltip content="编辑商品" placement="top-start" effect="light">
              <el-button
                icon="el-icon-edit"
                circle
                @click="edit(scope.row.commodityId)"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              content="订单"
              placement="top-start"
              circle
              effect="light"
            >
              <el-button
                type="primary"
                icon="el-icon-s-order"
                circle
                @click="order(scope.row.commodityId)"
              ></el-button>
            </el-tooltip>
            <el-tooltip content="复制" placement="top-start" effect="light">
              <el-button
                type="danger"
                icon="el-icon-s-help"
                circle
                @click="copy(scope.row.commodityId)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
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
import * as commodityService from '@/api/commodity/commodity'
import util from '@/libs/util'
var pageNum = 1
var pageSize = 10
var userId = ''

export default {
  name: 'CommodityList',
  data() {
    return {
      data: [],
      currentPage: 1,
      total: 0,
      picPath: util.picturePath,
      formInline: {
        shopId: '',
        shopName: ''
      },
      commodityStatusOptions: [
        {
          value: '0',
          label: '上架'
        },
        {
          value: '1',
          label: '下架'
        }
      ],
      commodityPatternOptions: [
        {
          value: '0',
          label: '线上核销'
        },
        {
          value: '1',
          label: '线下物流'
        },
        {
          value: '2',
          label: '线下物流+自提'
        }
      ],
      recommendedOptions: [
        {
          value: '0',
          label: '不推荐'
        },
        {
          value: '1',
          label: '推荐'
        }
      ]
    }
  },
  mounted() {
    this.getCommodityList()
  },
  methods: {
    getCommodityList() {
      let data = {
        pageNum: pageNum,
        pageSize: pageSize
      }
      commodityService.commodityPage(data).then(res => {
        console.log(res)
        this.data = res.list
        this.currentPage = res.pageNum
        this.total = res.size
      })
    },
    newCommodity() {
      this.$router.push({ path: '/commodity/index', query: { type: 'new' } })
    },
    edit(commodityId) {
      this.$router.push({
        path: '/commodity/index',
        query: { commodityId: commodityId, type: 'edit' }
      })
    },
    handleSizeChange(val) {
      pageSize = val
      this.getCommodityList()
    },
    handleCurrentChange(val) {
      pageNum = val
      this.getCommodityList()
    },
    search() {
      this.getCommodityList()
    },
    run(shopId, shopStatus) {
      var formData = {
        shopId: shopId,
        shopStatus: shopStatus
      }
      shopEdit(formData).then(res => {
        this.getCommodityList()
      })
    },
    reset() {
      this.formInline.shopId = ''
      this.formInline.shopName = ''
      this.getCommodityList()
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
.info {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}
.info-id {
  font-size: 13px;
}
.info-body {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  margin-top: 10px;
}
.info-display {
  width: 100px;
  height: 100px;
  border-radius: 5px;
}
.info-brief {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin-left: 10px;
}
.info-name {
  font-size: 16px;
  color: #2d2d2d;
}
.info-tip {
  margin-top: 12px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
}
.tip-reco {
  margin-right: 10px;
}
</style>

<template>
  <d2-container>
    <template slot="header">
      <div class="header-cover">
        <el-form :inline="true"
                 :model="formInline"
                 class="comm-form-inline">

          <el-form-item label="商品名称"
                        label-width="100px">
            <el-input v-model="formInline.commodityName"
                      size="small"></el-input>
          </el-form-item>

          <el-form-item label="商品ID"
                        label-width="100px">
            <el-input v-model="formInline.commodityId"
                      size="small"></el-input>
          </el-form-item>

          <el-form-item label="商家名称"
                        label-width="100px">
            <el-input v-model="formInline.shopName"
                      size="small"></el-input>
          </el-form-item>

          <el-form-item label="是否上架"
                        label-width="100px">
            <el-select v-model="formInline.commodityStatus"
                       placeholder="请选择"
                       size="small">
              <el-option v-for="item in commodityStatusOptions"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="模式"
                        label-width="100px">
            <el-select v-model="formInline.commodityPattern"
                       placeholder="请选择"
                       size="small">
              <el-option v-for="item in commodityPatternOptions"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-row>
            <el-form-item label=" "
                          label-width="100px">
              <el-button type="primary"
                         round=""
                         size="small"
                         @click="search">搜索</el-button>
              <el-button type=""
                         round=""
                         size="small"
                         @click="reset">重置</el-button>
              <el-button type="primary"
                         size="small"
                         round=""
                         icon="el-icon-folder-add"
                         @click="newCommodity">新增商品</el-button>
            </el-form-item>
          </el-row>
        </el-form>
      </div>
    </template>
    <template>
      <el-table :data="data"
                style="width: 100%;"
                border>
        <el-table-column label="商户编号"
                         align="center"
                         width="200"
                         prop="shopId">
          <template slot-scope="scope">
            <span>{{ scope.row.shopId }}</span>
          </template>
        </el-table-column>
        <el-table-column label="商品编号"
                         align="center"
                         prop="commodityId">
          <template slot-scope="scope">
            <span>{{ scope.row.commodityId }}</span>
          </template>
        </el-table-column>

        <el-table-column label="商品状态"
                         align=" center"
                         width="130"
                         prop="mobile">
          <template slot-scope="scope">
            <span>{{ scope.row.mobile }}</span>
          </template>
        </el-table-column>

        <el-table-column label="商户地址"
                         align="center"
                         width="180"
                         prop="addressDetail">
          <template slot-scope="scope">
            <span>{{ scope.row.addressDetail }}</span>
          </template>
        </el-table-column>

        <el-table-column label="商品数量"
                         align="center"
                         width="100">
          <template slot-scope="scope">
            <span>0</span>
          </template>
        </el-table-column>

        <el-table-column label="店员数量"
                         align="center"
                         width="100">
          <template slot-scope="scope">
            <span>0</span>
          </template>
        </el-table-column>

        <el-table-column label="商户状态"
                         align="center"
                         width="180"
                         prop="shopStatus">
          <template slot-scope="scope">
            <el-tag type="danger"
                    v-if="scope.row.shopStatus==0">停运</el-tag>
            <el-tag type="success"
                    v-if="scope.row.shopStatus==1">运营中</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="操作"
                         align="center"
                         width="180"
                         fixed="right">
          <template slot-scope="scope">
            <el-tooltip content="编辑商铺"
                        placement="top-start"
                        effect="light">
              <el-button type="primary"
                         icon="el-icon-edit"
                         circle
                         @click="edit(scope.row.shopId)"></el-button>
            </el-tooltip>
            <el-tooltip content="编辑店员"
                        placement="top-start"
                        circle
                        effect="light">
              <el-button type="primary"
                         icon="el-icon-user"
                         circle
                         @click="switchline(scope.row.shopId,'3')"></el-button>
            </el-tooltip>
            <el-tooltip content="激活"
                        placement="top-start"
                        effect="light"
                        v-if="scope.row.shopStatus==='0'">
              <el-button type="danger"
                         icon="el-icon-video-pause"
                         circle
                         @click="run(scope.row.shopId,'1')"></el-button>
            </el-tooltip>
            <el-tooltip content="停止"
                        placement="top-start"
                        effect="light"
                        v-if="scope.row.shopStatus==='1'">
              <el-button type="danger"
                         icon="el-icon-video-play"
                         circle
                         @click="run(scope.row.shopId,'0')"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <template slot="footer">
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="currentPage"
                     :page-sizes="[10,20,30,40]"
                     :page-size="10"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total">
      </el-pagination>
    </template>

  </d2-container>

</template>

<script>
import { shopList, shopEdit } from "@/api/shop/shopApi"
import util from '@/libs/util'
var pageNum = 1
var pageSize = 10
var userId = ''

export default {
  name: "commodityList",
  data () {
    return {
      data: [],
      currentPage: 1,
      total: 0,
      picPath: 'https://pic.linchongpets.com/',
      formInline: {
        shopId: '',
        shopName: ''
      },
      commodityStatusOptions: [{
        value: '0',
        label: '上架'
      }, {
        value: '1',
        label: '下架'
      }],
      commodityPatternOptions: [{
        value: '0',
        label: '线上核销'
      }, {
        value: '1',
        label: '线下物流'
      }, {
        value: '2',
        label: '线下物流+自提'
      }]
    }
  },
  mounted () {
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
    getList () {
      let data = {
        pageNum: pageNum,
        pageSize: pageSize,
      }
      shopList(data).then(res => {
        console.log(res)
        this.data = res.list
        this.currentPage = res.pageNum
        this.total = res.size
      });
    },
    newCommodity () {
      this.$router.push({ path: '/commodity/commoditylist/new', query: { type: "new" } })
    },
    edit (shopId) {
      this.$router.push({ path: '/shop/new', query: { shopId: shopId, type: "edit" } });
    },
    handleSizeChange (val) {
      pageSize = val
      this.getList()
    },
    handleCurrentChange (val) {
      pageNum = val
      this.getList()
    },
    search () {
      this.getList()
    },
    run (shopId, shopStatus) {
      var formData = {
        shopId: shopId,
        shopStatus: shopStatus
      }
      shopEdit(formData).then(res => {
        this.getList()
      });
    },
    reset () {
      this.formInline.shopId = ''
      this.formInline.shopName = ''
      this.getList()
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

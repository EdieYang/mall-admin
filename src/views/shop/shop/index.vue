<template>
  <d2-container>
    <template slot="header">
      <div class="header-cover">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="商户编号">
            <el-input v-model="formInline.shopId" size="small"></el-input>
          </el-form-item>
          <el-form-item label="商户名称">
            <el-input v-model="formInline.shopName" size="small"></el-input>
          </el-form-item>
          <el-form-item>
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
              @click="newShop"
              >商户入驻</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </template>
    <template>
      <el-table :data="data" style="width: 100%;" border>
        <el-table-column
          label="商户编号"
          align="center"
          width="200"
          prop="shopId"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.shopId }}</span>
          </template>
        </el-table-column>
        <el-table-column label="商家" align="center" prop="shopName">
          <template slot-scope="scope">
            <span>{{ scope.row.shopName }}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="待结算订单数量"
          align="center"
          width="130"
          prop="settleOrderNums"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.settleOrderNums }}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="待结算金额（元）"
          align="center"
          width="180"
          prop="settleAmount"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.settleAmount }}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="商户状态"
          align="center"
          width="180"
          prop="shopStatus"
        >
          <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.shopStatus == 0">停运</el-tag>
            <el-tag type="success" v-if="scope.row.shopStatus == 1"
              >运营中</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column
          label="创建时间"
          align="center"
          width="180"
          prop="shopStatus"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.createDate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="180" fixed="right">
          <template slot-scope="scope">
            <el-tooltip
              content="扫码绑定管理员"
              placement="top-start"
              effect="light"
            >
              <el-button
                type="warning"
                icon="el-icon-data-line"
                circle
                @click="run(scope.row.shopId, '1')"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              content="管理员"
              placement="top-start"
              circle
              effect="light"
            >
              <el-button
                type="success"
                icon="el-icon-user"
                circle
                @click="toShopSysUser(scope.row.shopId)"
              ></el-button>
            </el-tooltip>
            <el-tooltip content="编辑商铺" placement="top-start" effect="light">
              <el-button
                type="primary"
                icon="el-icon-edit"
                circle
                @click="edit(scope.row.shopId)"
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
import { shopList, shopEdit } from '@/api/shop/shopApi'
import util from '@/libs/util'
var pageNum = 1
var pageSize = 10
var userId = ''

export default {
  name: 'ShopList',
  data() {
    return {
      data: [],
      currentPage: 1,
      total: 0,
      picPath: 'https://pic.linchongpets.com/',
      formInline: {
        shopId: '',
        shopName: ''
      },
      shopTypeEnum: [
        {
          label: '线上门店',
          value: '1'
        },
        {
          label: '线下门店',
          value: '2'
        }
      ]
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
      shopList(data).then(res => {
        console.log(res)
        this.data = res.rows
        this.currentPage = res.page
        this.total = res.total
      })
    },
    newShop() {
      this.$router.push({ path: '/shop/shop/new', query: { type: 'new' } })
    },
    edit(shopId) {
      this.$router.push({
        path: '/shop/shop/new',
        query: { shopId: shopId, type: 'edit' }
      })
    },
    toShopSysUser(shopId) {
      this.$router.push({
        path: '/shop/shopSysUser/shopIndex',
        query: { shopId: shopId }
      })
    },
    handleSizeChange(val) {
      pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      pageNum = val
      this.getList()
    },
    search() {
      this.getList()
    },
    run(shopId, shopStatus) {
      var formData = {
        shopId: shopId,
        shopStatus: shopStatus
      }
      shopEdit(formData).then(res => {
        this.getList()
      })
    },
    reset() {
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

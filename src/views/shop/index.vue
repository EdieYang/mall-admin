<template>
  <d2-container>
    <template slot="header">
      <div class="header-cover">
        <el-form :inline="true"
                 :model="formInline"
                 class="demo-form-inline">
          <el-form-item label="商户编号">
            <el-input v-model="formInline.shopId"></el-input>

          </el-form-item>
          <el-form-item label="商户名称">
            <el-input v-model="formInline.shopName"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary"
                       round=""
                       size="small"
                       @click="search">查询</el-button>
            <el-button type=""
                       round=""
                       size="small"
                       @click="reset">重置</el-button>
            <el-button type="primary"
                       size="small"
                       round=""
                       icon="el-icon-folder-add"
                       @click="newShop">商户入驻</el-button>
          </el-form-item>
        </el-form>

      </div>
    </template>
    <el-table :data="data"
              border
              fit
              style="width: 100%;">
      <el-table-column label="商户编号"
                       align="center">
        <template slot-scope="scope">
           <span>{{ scope.row.shopId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="商户名称"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.shopName }}</span>
        </template>
      </el-table-column>

      <el-table-column label="电话"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.mobile }}</span>
        </template>
      </el-table-column>

      <el-table-column label="商户地址"
                       align="center"
                       width="120px;">
        <template slot-scope="scope">
          <span>{{ scope.row.addressDetail }}</span>
        </template>
      </el-table-column>

      <el-table-column label="商品数量"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.petAge }}</span>
        </template>
      </el-table-column>

      <el-table-column label="店员数量"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.petAge }}</span>
        </template>
      </el-table-column>

      <el-table-column label="商户状态"
                       align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.shopStatus==0">停运</span>
          <span v-else-if="scope.row.shopStatus==1">运营中</span>
        </template>
      </el-table-column>

      <el-table-column label="操作"
                       align="center"
                       width="180"
                       class-name="small-padding fixed-width "
                       fixed="right">
        <template slot-scope="scope">
          <el-tooltip content="编辑商铺"
                      placement="top-start"
                      effect="light"
                      >
            <el-button type="primary"
                       icon="el-icon-edit"
                       circle
                       @click="edit(scope.row.shopId)"></el-button>
          </el-tooltip>
          <el-tooltip content="编辑店员"
                      placement="top-start"
                      circle
                      effect="light"
                      >
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
                       @click="run(scope.row.shopId,'0')"></el-button>
          </el-tooltip>
          <el-tooltip content="停止"
                      placement="top-start"
                      effect="light"
                      v-if="scope.row.shopStatus==='1'">
            <el-button type="danger"
                       icon="el-icon-video-play"
                       circle
                       @click="run(scope.row.shopId,'1')"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
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
import { shopList, adoptEdit } from "@/api/shop/shopApi"
import util from '@/libs/util'
var pageNum = 1
var pageSize = 10
var orgId = ''

export default {
  data () {
    return {
      data: [],
      currentPage: 1,
      total: 0,
      picPath: 'https://pic.linchongpets.com/',

      formInline: {
        shopId: '',
        shopName: ''
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
        this.data = res.rows
        this.currentPage = res.page
        this.total = res.total
      });
    },
    newShop () {
      this.$router.push({ path: '/shop/new', query: { type: "new" } })
    },
    switchline (petId, status) {
      let data = {
        petId: petId,
        adoptStatus: status
      }
      adoptEdit(data).then(res => {
        this.getList()
      });
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
.tag-popover {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
}
.tag-pop {
  margin-bottom: 5px;
}
</style>

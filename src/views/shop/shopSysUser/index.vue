<template>
  <d2-container>
    <template slot="header">
      <div class="header-cover">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="商户名称">
            <el-input v-model="formInline.shopName" size="small"></el-input>
          </el-form-item>
          <el-form-item label="手机号">
            <el-input v-model="formInline.userAcc" size="small"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" round="" size="small" @click="search()">搜索</el-button>
            <el-button type="" round="" size="small" @click="reset()">重置</el-button>
          </el-form-item>
        </el-form>
      </div>

    </template>
    <template>
      <el-table :data="data" style="width: 100%;" border>
        <el-table-column label="头像" align="center" width="200" prop="userPortrait">
          <template slot-scope="scope">
            <img :src="scope.row.userPortrait" class="user_portrait" />
          </template>
        </el-table-column>
        <el-table-column label="微信昵称" align="center" prop="userName">
          <template slot-scope="scope">
            <span>{{ scope.row.userName }}</span>
          </template>
        </el-table-column>

        <el-table-column label="真实姓名" align="center" width="130" prop="realName">
          <template slot-scope="scope">
            <span>{{ scope.row.realName }}</span>
          </template>
        </el-table-column>

        <el-table-column label="店铺名称" align="center" width="130" prop="shopName">
          <template slot-scope="scope">
            <span>{{ scope.row.shopName }}</span>
          </template>
        </el-table-column>

        <el-table-column label="创建时间" align="center" width="180" prop="createTime">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="180" fixed="right">
          <template slot-scope="scope">
            <el-tooltip content="扫码记录" placement="top-start" effect="light">
              <el-button type="warning" icon="el-icon-data-line" circle @click="consumeList(scope.row.shopId,scope.row.userId)"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top-start" circle effect="light">
              <el-button type="danger" icon="el-icon-delete" circle @click="delUser(scope.row.shopId,scope.row.userId)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

    </template>
    <template slot="footer">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10,20,30,40]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </template>

  </d2-container>

</template>

<script>
import { shopSysUserList, shopSysUserDetail, shopSysUserNew, shopSysUserEdit } from "@/api/shop/shopSysUser"
import util from '@/libs/util'
var pageNum = 1
var pageSize = 10
var userId = ''

export default {
  name: "shopList",
  data() {
    let validMobile = (rule, value, callback) => {
      let reg = /^1(3|4|5|7|8)\d{9}$/;
      if (!reg.test(value)) {
        callback(new Error('请输入正确的手机号'));
      } else {
        callback();
      }
    };
    return {
      data: [],
      currentPage: 1,
      total: 0,
      picPath: 'https://pic.linchongpets.com/',
      shopId: '',
      searchVal: '',
      form: {
        userAcc: '',
        realName: ''
      },
      formInline: {
        userAcc: '',
        shopName: ''
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
    getList() {
      let data = {
        pageNum: pageNum,
        pageSize: pageSize,
        search: this.searchVal
      }
      shopSysUserList(data).then(res => {
        console.log(res)
        this.data = res.list
        this.currentPage = res.page
        this.total = res.total
      });
    },
    search() {
      pageNum = 1
      this.searchVal = this.formInline.userAcc != '' ? this.formInline.userAcc : this.formInline.shopName
      this.getList()
    },
    reset() {
      this.searchVal = ''
      this.formInline.userAcc = ''
      this.formInline.shopName = ''
      this.getList
    },
    delUser(shopId, sysUserId) {
      let data = {
        userId: sysUserId,
        delFlag: '1'
      }
      shopSysUserEdit(data, this.shopId).then(res => {
        this.$message.success('更新成功')
        this.shopSysUserDialog = false
        this.getList()
      })
    },
    consumeList() {

    },
    handleSizeChange(val) {
      pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      pageNum = val
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
.user_portrait {
  width: 60px;
  width: 60px;
}
</style>

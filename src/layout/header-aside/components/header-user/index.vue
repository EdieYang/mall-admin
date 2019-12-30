<template>
  <el-dropdown size="small" class="d2-mr">
    <span class="btn-text">{{ userName }}</span>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item @click.native="logout">
        <d2-icon name="power-off" class="d2-mr-5" />
        注销
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import { mapState, mapActions } from "vuex"
import util from "@/libs/util.js"
export default {
  data() {
    return {
      userName: ""
    }
  },
  computed: {
    ...mapState("d2admin/user", ["info"])
  },
  mounted() {
    this.getUserName()
  },
  methods: {
    ...mapActions("d2admin/account", ["logout"]),
    getUserName() {
      const userName = util.cookies.get("userName")
      this.userName = userName
    },
    /**
     * @description 登出
     */
    logout() {
      util.cookies.remove("userId")
      util.cookies.remove("userName")
      util.cookies.remove("token")
      this.$router.push({
        name: "login"
      })
    }
  }
}
</script>

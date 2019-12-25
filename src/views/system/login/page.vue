<template>
  <div class="page-login">
    <div class="page-login--layer page-login--layer-area">
      <ul class="circles">
        <li v-for="n in 10" :key="n"></li>
      </ul>
    </div>
    <div class="page-login-layer">
      <div class="login-layer-container">
        <!-- form -->
        <div class="page-login-form">
          <p class="page-login-header">linkpets-mall</p>
          <p class="page-login-title">邻宠商城运营平台</p>
          <el-form
            ref="loginForm"
            label-position="top"
            :rules="rules"
            :model="formLogin"
            class="login-form"
          >
            <el-form-item prop="username" label="账号">
              <el-input
                class="form-input"
                type="text"
                size="medium"
                v-model="formLogin.username"
                placeholder="用户名"
              >
              </el-input>
            </el-form-item>
            <el-form-item prop="password" label="密码">
              <el-input
                class="form-input"
                type="password"
                size="medium"
                v-model="formLogin.password"
                :show-password="true"
                placeholder="密码"
              >
              </el-input>
            </el-form-item>
            <el-button
              size="default"
              @click="submit"
              type="primary"
              class="button-login"
            >
              登录
            </el-button>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import util from '@/libs/util'
import * as loginService from '@/api/sys/login'
export default {
  data() {
    return {
      timeInterval: null,
      // time: dayjs().format('HH:mm:ss'),
      // 快速选择用户
      dialogVisible: false,
      users: [
        {
          name: 'Admin',
          username: 'admin',
          password: 'admin'
        }
      ],
      // 表单
      formLogin: {
        username: '',
        password: ''
      },
      // 表单校验
      rules: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  mounted() {},
  beforeDestroy() {},
  methods: {
    ...mapActions('d2admin/account', ['login']),
    /**
     * @description 接收选择一个用户快速登录的事件
     * @param {Object} user 用户信息
     */
    handleUserBtnClick(user) {
      this.formLogin.username = user.username
      this.formLogin.password = user.password
      this.submit()
    },
    /**
     * @description 提交表单
     */
    // 提交登录信息
    submit() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          // 登录
          // 注意 这里的演示没有传验证码
          // 具体需要传递的数据请自行修改代码
          let userInfo = {
            userAccount: this.formLogin.username,
            password: this.$sha256(this.formLogin.password)
          }
          console.log(this.$sha256(this.formLogin.password))
          loginService.sysLogin(userInfo).then(res => {
            console.log(res)
            util.cookies.set('userId', res.userId)
            util.cookies.set('token', res.token)
            util.cookies.set('userName', res.userName)
            this.$router.push('/index')
          })
        } else {
          // 登录表单校验失败
          this.$message.error('请输入完整账号密码！')
        }
      })
    }
  }
}
</script>

<style lang="scss">
.page-login-layer {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
}

.login-layer-container {
  height: 100%;
  width: 40%;
  position: absolute;
  right: 0;
  top: 0;
  background-color: #fff;
}

.page-login-form {
  width: 80%;
  margin-left: 10%;
  margin-top: 30%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.page-login-header {
  margin-bottom: 20px;
  font-size: 32px;
  font-weight: bold;
}
.page-login-title {
  margin: 0 0;
  font-size: 20px;
}

.login-form {
  margin-top: 50px;
}

.form-input .el-input__inner {
  width: 300px;
  border: 0 none;
  border-bottom: 1px solid #999;
  border-radius: 0;
}

.button-login {
  border-radius: 0;
  width: 300px;
  margin-top: 30px;
  font-size: 22px;
  box-shadow: -4px -4px 10px #eaeaea;
}

.page-login {
  @extend %unable-select;
  $backgroundColor: #fff;
  // ---
  background-color: $backgroundColor;
  background-image: url('/image/local/login.jpg');
  background-repeat: no-repeat;
  height: 100%;
  background-size: auto 100%;
  position: relative;
  font-family: PingFangSC-Regular, San Francisco;
  min-width: 1200px;
  min-height: 800px;
  // 背景
  .circles {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    margin: 0px;
    padding: 0px;
    li {
      position: absolute;
      display: block;
      list-style: none;
      width: 20px;
      height: 20px;
      background: #fff;
      animation: animate 25s linear infinite;
      bottom: -200px;
      @keyframes animate {
        0% {
          transform: translateY(0) rotate(0deg);
          opacity: 1;
          border-radius: 0;
        }
        100% {
          transform: translateY(-1000px) rotate(720deg);
          opacity: 0;
          border-radius: 50%;
        }
      }
      &:nth-child(1) {
        left: 15%;
        width: 80px;
        height: 80px;
        animation-delay: 0s;
      }
      &:nth-child(2) {
        left: 5%;
        width: 20px;
        height: 20px;
        animation-delay: 2s;
        animation-duration: 12s;
      }
      &:nth-child(3) {
        left: 70%;
        width: 20px;
        height: 20px;
        animation-delay: 4s;
      }
      &:nth-child(4) {
        left: 40%;
        width: 60px;
        height: 60px;
        animation-delay: 0s;
        animation-duration: 18s;
      }
      &:nth-child(5) {
        left: 65%;
        width: 20px;
        height: 20px;
        animation-delay: 0s;
      }
      &:nth-child(6) {
        left: 75%;
        width: 120px;
        height: 120px;
        animation-delay: 3s;
      }
      &:nth-child(7) {
        left: 35%;
        width: 200px;
        height: 200px;
        animation-delay: 7s;
      }
      &:nth-child(8) {
        left: 50%;
        width: 25px;
        height: 25px;
        animation-delay: 15s;
        animation-duration: 45s;
      }
      &:nth-child(9) {
        left: 20%;
        width: 15px;
        height: 15px;
        animation-delay: 2s;
        animation-duration: 35s;
      }
      &:nth-child(10) {
        left: 85%;
        width: 150px;
        height: 150px;
        animation-delay: 0s;
        animation-duration: 11s;
      }
    }
  }
}
</style>

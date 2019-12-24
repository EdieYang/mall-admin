<template>
  <el-dialog title="用户信息" :visible.sync="dialogVisible" @opened="dialogOpen">
    <el-form ref="form" :model="form" label-width="80px" size="small">
      <el-form-item prop="userAccount" label="账号" :rules="[{ required: true, message: '不能为空'}]">
        <el-input v-model="form.userAccount"></el-input>
      </el-form-item>
      <el-form-item prop="userName" label="用户名称" :rules="[{ required: true, message: '不能为空'}]">
        <el-input v-model="form.userName"></el-input>
      </el-form-item>
      <el-form-item prop="email" label="邮箱">
        <el-input v-model="form.email"></el-input>
      </el-form-item>
      <el-form-item prop="mobilePhone" label="phone">
        <el-input v-model="form.mobilePhone" type="text" maxlength="11"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="loading" @click="saveUser">保存</el-button>
        <el-button @click="close">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>

</template>
<script>
import * as userService from "@/api/sys/user";
export default {
  name: "userEditForm",
  props: {
    user: Object,
    value: Boolean
  },
  data() {
    return {
      loading: false,
      dialogVisible: false,
      form: {
        name: "",
        trueName: "",
        phone: "",
        email: ""
      }
    };
  },
  watch: {
    value(val) {
      this.dialogVisible = val;
    },
    dialogVisible(val) {
      this.$emit("input", val);
    }
  },
  methods: {
    dialogOpen() {
      this.$refs.form.resetFields();
      if (this.user.userId) {
        userService.getUser({ userId: this.user.userId }).then(data => {
          let form = {};
          form.userAccount = data.userAccount;
          form.userName = data.userName;
          form.mobilePhone = data.mobilePhone;
          form.email = data.email;
          this.form = form;
        });
      } else {
        this.form = {};
      }
    },
    saveUser() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.loading = true;
          let req = {
            userId: this.user.userId,
            userAccount: this.form.userAccount,
            userName: this.form.userName,
            mobilePhone: this.form.mobilePhone,
            email: this.form.email
          }
          if (this.user.userId != '' && typeof this.user.userId != 'undefined') {
            userService
              .uptUser(req)
              .then(data => {
                this.loading = false;
                this.dialogVisible = false;
                this.$emit("submit");
              });
          } else {
            userService
              .saveUser(req)
              .then(data => {
                this.loading = false;
                this.dialogVisible = false;
                this.$emit("submit");
              });
          }
        } else {
          return
        }
      });
    },
    close() {
      this.$refs["form"].resetFields();
      this.dialogVisible = false;
    }
  }
};
</script>


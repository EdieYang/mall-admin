<template>
  <el-dialog title="权限信息" :visible.sync="dialogVisible" @opened="dialogOpen">
    <el-form ref="form" :model="form" label-width="80px" size="small">
      <el-form-item prop="permissionName" label="权限名称" :rules="[{ required: true, message: '不能为空'}]">
        <el-input v-model="form.permissionName"></el-input>
      </el-form-item>
      <el-form-item prop="permissionCode" label="权限标识" :rules="[{ required: true, message: '不能为空'}]">
        <el-input v-model="form.permissionCode"></el-input>
      </el-form-item>
      <el-form-item prop="permissionDescription" label="权限描述">
        <el-input v-model="form.permissionDescription"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="loading" @click="savePermission">保存</el-button>
        <el-button @click="close">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>

</template>
<script>
import * as permissionService from "@/api/sys/permission";
export default {
  name: "permissionEditForm",
  props: {
    permission: Object,
    value: Boolean
  },
  data() {
    return {
      loading: false,
      dialogVisible: false,
      form: {
        permissionName: "",
        permissionCode: "",
        permissionDescription: ""
      }
    }
  },
  watch: {
    value(val) {
      this.dialogVisible = val
    },
    dialogVisible(val) {
      this.$emit("input", val)
    }
  },
  methods: {
    dialogOpen() {
      this.$refs.form.resetFields()
      if (this.permission.id) {
        permissionService.getPermission({ id: this.permission.id }).then(data => {
          let form = {}
          form.permissionName = data.permissionName
          form.permissionCode = data.permissionCode
          form.permissionDescription = data.permissionDescription
          this.form = form
        })
      } else {
        this.form = {}
      }
    },
    savePermission() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.loading = true;
          let req = {
            id: this.permission.id,
            permissionName: this.form.permissionName,
            permissionCode: this.form.permissionCode,
            permissionDescription: this.form.permissionDescription
          }
          if (this.permission.id != '' && typeof this.permission.id != 'undefined') {
            permissionService
              .uptPermission(req)
              .then(data => {
                this.loading = false;
                this.dialogVisible = false;
                this.$emit("submit");
              });
          } else {
            permissionService
              .savePermission(req)
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


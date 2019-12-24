<template>
  <el-dialog title="角色信息" :visible.sync="dialogVisible" @opened="dialogOpen" @closed="dialogClose">
    <el-form ref="form" :model="form" label-width="80px" size="small">
      <el-form-item prop="roleName" label="角色名称" :rules="[{ required: true, message: '不能为空'}]">
        <el-input v-model="form.roleName"></el-input>
      </el-form-item>
      <el-form-item prop="roleCode" label="角色标识" :rules="[{ required: true, message: '不能为空'}]">
        <el-input v-model="form.roleCode"></el-input>
      </el-form-item>
      <el-form-item prop="roleDescription" label="备注">
        <el-input type="textarea" v-model="form.roleDescription"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="loading" @click="saveRole">保存</el-button>
        <el-button @click="close">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>

</template>
<script>
import * as roleService from "@/api/sys/role";
export default {
  name: "roleEditForm",
  props: {
    role: Object,
    value: Boolean
  },
  data() {
    return {
      loading: false,
      dialogVisible: false,
      form: {
        roleName: "",
        roleCode: "",
        roleDescription: ""
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
      if (this.role.roleId) {
        let req = {
          id: this.role.roleId
        }
        roleService.getRole(req).then(data => {
          let form = {};
          form.roleName = data.roleName;
          form.roleCode = data.roleCode;
          form.roleDescription = data.roleDescription;
          this.form = form;
        });
      } else {
        this.form = {};
      }
    },
    saveRole() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.loading = true;
          console.log(this.role.roleId)
          let req = {
            roleId: this.role.roleId,
            roleName: this.form.roleName,
            roleCode: this.form.roleCode,
            roleDescription: this.form.roleDescription
          }
          if (this.role.roleId != '' && typeof this.role.roleId !='undefined') {
            roleService
              .uptRole(req)
              .then(data => {
                this.loading = false;
                this.dialogVisible = false;
                this.$emit("submit");
              });
          } else {
            roleService
              .saveRole(req)
              .then(data => {
                this.loading = false;
                this.dialogVisible = false;
                this.$emit("submit");
              });
          }
        }
      });
    },
    close() {
      this.dialogClose();
    },
    dialogClose() {
      this.$refs["form"].resetFields();
      this.dialogVisible = false;
    }
  }
};
</script>


<template>
  <d2-container>
    <el-button-group>
      <el-button
        type="primary"
        icon="el-icon-circle-plus-outline"
        size="mini"
        @click="add"
        >添加</el-button
      >
      <el-button
        type="primary"
        icon="el-icon-edit"
        :disabled="!currentId"
        size="mini"
        @click="edit"
        >编辑</el-button
      >
      <el-button
        type="primary"
        icon="el-icon-delete"
        :disabled="!currentId"
        size="mini"
        @click="del"
        >删除</el-button
      >
      <el-button
        type="primary"
        icon="el-icon-circle-close-outline"
        :disabled="!currentId"
        size="mini"
        @click="cancel"
        >取消</el-button
      >
    </el-button-group>
    <el-popover
      placement="top-start"
      title="温馨提示"
      width="400"
      trigger="hover"
    >
      <li>请合理维护好菜单排序</li>
      <li>无法添加3级菜单，请合理安排菜单分配</li>
      <el-button
        slot="reference"
        size="mini"
        icon="el-icon-info"
        style="float:right"
        >操作提示</el-button
      >
    </el-popover>
    <el-row>
      <el-col :span="8" style="margin-top:15px;">
        <el-tree
          ref="tree"
          class="filter-tree"
          node-key="id"
          default-expand-all
          highlight-current
          :expand-on-click-node="false"
          :data="menuList"
          :props="defaultProps"
          @node-click="getMenuData"
        ></el-tree>
      </el-col>
      <el-col :span="16" style="margin-top:15px;">
        <el-card shadow="always">
          <el-form
            label-position="right"
            label-width="80px"
            :model="menuform"
            :rules="formRules"
            ref="menuform"
          >
            <el-form-item label="父级节点" prop="parentId">
              <el-input
                v-model="menuform.parentId"
                :disabled="true"
                placeholder="父级节点"
              ></el-input>
            </el-form-item>

            <el-form-item label="标题" prop="title">
              <el-input
                v-model="menuform.title"
                :disabled="!formEdit"
                placeholder="请输入标题"
              ></el-input>
            </el-form-item>
            <el-form-item label="路径" prop="path">
              <el-input
                v-model="menuform.path"
                :disabled="!formEdit"
                placeholder="请输入路径"
              ></el-input>
            </el-form-item>
            <el-form-item label="图标" prop="icon">
              <d2-icon-select v-model="menuform.icon" :user-input="false" />
            </el-form-item>
            <el-form-item label="排序" prop="sort">
              <el-input
                v-model="menuform.sort"
                :disabled="!formEdit"
                type="number"
                step="1"
                placeholder="请输入排序"
              ></el-input>
            </el-form-item>
            <el-form-item v-if="formEdit">
              <el-button type="primary" @click="submit">提交</el-button>
              <el-button @click="reset">清空</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
    <!-- <edit-form v-model="editFormDialogVisible" @submit="getMenuList" /> -->
  </d2-container>
</template>

<script>
import * as menuService from '@/api/sys/menu'
export default {
  name: 'MenuPage',
  data() {
    return {
      formRules: {
        title: [
          { required: true, message: '请输入菜单标题', trigger: 'blur' },
          { max: 32, message: '长度不得超过32位', trigger: 'blur' }
        ],
        path: [
          { required: true, message: '请输入菜单路径', trigger: 'blur' },
          { max: 32, message: '长度不得超过32位', trigger: 'blur' }
        ],
        icon: [{ required: true, message: '请选择图标', trigger: 'change' }],
        sort: [{ required: true, message: '请输入排序', trigger: 'blur' }]
      },
      formEdit: false,
      currentId: 0,
      menuList: [],
      defaultProps: {
        label: 'title'
      },
      menuform: {
        id: '',
        parentId: 0,
        title: '',
        path: '',
        icon: '',
        sort: 0
      },
      typeOptions: [
        {
          value: 1,
          label: '菜单'
        },
        {
          value: 2,
          label: '功能'
        }
      ],
      editFormDialogVisible: false,
      relateInterfaceDialogVisible: false
    }
  },
  methods: {
    getMenuList() {
      menuService.getMenuList().then(data => {
        this.menuList = data
      })
    },
    getMenuData(data) {
      let req = {
        id: data.id
      }
      menuService.getMenu(req).then(data => {
        this.menuform = {
          id: data.id,
          parentId: data.parentId,
          title: data.title,
          path: data.path,
          icon: data.icon,
          permission: data.permission,
          sort: data.sort,
          type: data.type,
          isLock: data.isLock
        }
        this.currentId = data.id
      })
    },
    add() {
      if (this.menuform.parentId != 0 && this.currentId != 0) {
        this.$message.warning('只支持2级菜单，无法添加菜单！')
        return
      }
      this.menuform = {
        id: 0,
        parentId: this.currentId
      }
      this.formEdit = true
    },
    edit() {
      this.formEdit = true
    },
    del() {
      this.$confirm('确认删除？', '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '删除',
        cancelButtonText: '取消'
      }).then(() => {
        let req = {
          id: this.currentId
        }
        menuService.delMenu(req).then(() => {
          this.formEdit = false
          this.currentId = 0
          this.menuform = {}
          this.getMenuList()
        })
      })
    },
    cancel() {
      this.formEdit = false
      this.currentId = 0
      this.menuform = {}
    },
    submit() {
      this.$refs.menuform.validate(valid => {
        if (valid) {
          if (this.menuform.id != 0) {
            menuService.uptMenu(this.menuform).then(() => {
              this.formEdit = false
              this.currentId = 0

              menuService.getMenuList().then(data => {
                this.menuList = data
              })
            })
          } else {
            menuService.saveMenu(this.menuform).then(() => {
              this.formEdit = false
              this.currentId = 0

              menuService.getMenuList().then(data => {
                this.menuList = data
              })
            })
          }
        }
      })
    },
    reset() {
      this.menuform = {
        id: this.currentId,
        parentId: this.menuform.parentId,
        title: '',
        path: '',
        icon: '',
        permission: '',
        sort: 0,
        type: 1,
        isLock: false
      }
    }
  },
  created() {
    this.getMenuList()
  }
}
</script>

<template>
  <el-dialog :title="titleName" :visible="showDialog" @close="btnCancel">
    <el-form
      ref="roleForm"
      :model="roleForm"
      :rules="rules"
      label-width="120px"
    >
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="roleForm.name" />
      </el-form-item>
      <el-form-item label="角色描述">
        <el-input v-model="roleForm.description" />
      </el-form-item>
    </el-form>
    <!-- 底部 -->
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button size="small" @click="btnCancel">取消</el-button>
        <el-button size="small" type="primary" @click="btnOK">确定</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { updateRole, getRoleDetail, addRole } from '@/api/setting'
export default {
  name: 'EditRole',
  data() {
    return {
      showDialog: false,
      // 专门接收新增或者编辑的编辑的表单数据
      roleForm: {
        name: '',
        description: ''
      },
      rules: {
        name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }]
      },
      titleName: ''
    }
  },
  created() {
    this.$bus.$on('editRole', async(id) => {
      this.titleName = '编辑角色'
      this.roleForm = await getRoleDetail(id)
      this.showDialog = true // 为了不出现闪烁的问题 先获取数据 再弹出层
    })
    this.$bus.$on('addRole', () => {
      this.titleName = '新增角色'
      this.showDialog = true
    })
  },
  methods: {
    async btnOK() {
      try {
        await this.$refs.roleForm.validate()
        // 只有校验通过的情况下 才会执行await的下方内容
        // roleForm这个对象有id就是编辑 没有id就是新增
        if (this.roleForm.id) {
          await updateRole(this.roleForm)
        } else {
          await addRole(this.roleForm)
        }
        // 重新拉取数据
        this.$emit('getRoleList')
        this.$message.success('操作成功')
        this.showDialog = false
      } catch (error) {
        console.log(error)
      }
    },
    btnCancel() {
      this.$refs.roleForm.resetFields()
      this.roleForm = {
        name: '',
        description: ''
      }
      this.showDialog = false
    }
  }
}
</script>

<style></style>

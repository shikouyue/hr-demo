<template>
  <el-dialog title="新增员工" :visible="showDialog" :before-close="btnCancel">
    <!-- 表单 -->
    <el-form
      ref="addEmployee"
      :model="formData"
      :rules="rules"
      label-width="120px"
    >
      <el-form-item label="姓名" prop="username">
        <el-input
          v-model="formData.username"
          style="width: 50%"
          placeholder="请输入姓名"
        />
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input
          v-model="formData.mobile"
          style="width: 50%"
          placeholder="请输入手机号"
        />
      </el-form-item>
      <el-form-item label="入职时间" prop="timeOfEntry">
        <el-date-picker
          v-model="formData.timeOfEntry"
          style="width: 50%"
          placeholder="请选择日期"
        />
      </el-form-item>
      <el-form-item label="聘用形式" prop="formOfEmployment">
        <el-select
          v-model="formData.formOfEmployment"
          style="width: 50%"
          placeholder="请选择"
        >
          <!-- 遍历只能遍历组件的数据 -->
          <el-option
            v-for="item in EmployeeEnum.hireType"
            :key="item.id"
            :label="item.value"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="工号" prop="workNumber">
        <el-input
          v-model="formData.workNumber"
          style="width: 50%"
          placeholder="请输入工号"
        />
      </el-form-item>
      <el-form-item label="部门" prop="departmentName">
        <el-input
          v-model="formData.departmentName"
          style="width: 50%"
          placeholder="请选择部门"
          @focus="getDepartments"
        />
        <!-- 放置一个tree组件 -->
        <el-tree
          v-if="showTree"
          v-loading="loading"
          class="objectTree"
          :data="treeData"
          default-expand-all=""
          :props="{ label: 'name' }"
          @node-click="selectNode"
        />
      </el-form-item>
      <el-form-item label="转正时间" prop="correctionTime">
        <el-date-picker
          v-model="formData.correctionTime"
          style="width: 50%"
          placeholder="请选择日期"
        />
      </el-form-item>
    </el-form>
    <!-- footer插槽 -->
    <template v-slot:footer>
      <el-row type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" @click="btnCancel">取消</el-button>
          <el-button type="primary" size="small" @click="btnOK">确定</el-button>
        </el-col>
      </el-row>
    </template>
  </el-dialog>
</template>

<script>
import { getRequiredRules } from '@/utils/validate'
import EmployeeEnum from '@/api/constant/employees'
import { getDepartments } from '@/api/departments'
import { addEmployee } from '@/api/employees'
import { transData } from '@/utils/index'
export default {
  name: 'AddEmployee',
  data() {
    return {
      EmployeeEnum, // 在data中定义数据
      showDialog: false,
      // 表单数据
      treeData: [], // 定义数组接收树形数据
      showTree: false, // 控制树形的显示或者隐藏
      loading: false, // 控制树的显示或者隐藏进度条
      formData: {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      },
      rules: {
        username: [
          getRequiredRules('用户名'),
          {
            min: 1,
            max: 4,
            message: '用户姓名为1-4位',
            trigger: 'blur'
          }
        ],
        mobile: [
          getRequiredRules('手机号'),
          {
            pattern: /^1[3-9]\d{9}$/,
            message: '手机号格式不正确',
            trigger: 'blur'
          }
        ],
        formOfEmployment: [getRequiredRules('聘用形式')],
        workNumber: [getRequiredRules('工号')],
        departmentName: [
          { required: true, message: '部门名称不能为空', blur: 'change' }
        ],
        timeOfEntry: [getRequiredRules('入职时间')]
      }
    }
  },
  created() {
    this.$bus.$on('showDialog', () => {
      this.showDialog = true
    })
  },
  methods: {
    // 点击确定时 校验整个表单
    async btnOK() {
      try {
        await this.$refs.addEmployee.validate()
        // 调用新增接口
        await addEmployee(this.formData) // 新增员工
        // 告诉父组件更新数据
        // this.$parent 可以直接调用到父组件的实例 实际上就是父组件this
        // this.$emit
        this.$emit('getEmployeeList')
        this.showDialog = false
      } catch (error) {
        console.log(error)
      }
    },
    // 取消
    btnCancel() {
      this.$refs.addEmployee.resetFields()
      this.formData = {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      }
      this.showDialog = false
    },
    async getDepartments() {
      this.showTree = true
      this.loading = true
      const { depts } = await getDepartments()
      // depts是数组 但不是树形
      this.treeData = transData(depts, '')
      this.loading = false
    },
    selectNode(node) {
      this.formData.departmentName = node.name
      this.showTree = false
    }
  }
}
</script>

<style scoped>
.objectTree {
  position: absolute;
  width: 200px;
  height: 300px;
  z-index: 999;
  border: 1px solid #dddee1;
  left: 0;
  border-radius: 5px;
  margin-top: 5px;
  overflow: auto;
}
</style>

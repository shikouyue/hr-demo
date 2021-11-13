<template>
  <div v-loading="loading" class="dashboard-container">
    <div class="app-container">
      <!-- 实现页面的基本布局 -->
      <el-card class="tree-card">
        <!-- 用了一个行列布局 -->
        <!-- 缺少treeNode -->
        <TreeTools :tree-node="company" :is-root="true" />
        <!--放置一个属性   这里的props和我们之前学习的父传子 的props没关系-->
        <el-tree :data="departs" :props="defaultProps" default-expand-all>
          <!-- 说明el-tree里面的这个内容 就是插槽内容 => 填坑内容  => 有多少个节点循环多少次 -->
          <!-- scope-scope 是 tree组件传给每个节点的插槽的内容的数据 -->
          <!-- 顺序一定是 执行slot-scope的赋值 才去执行 props的传值 -->
          <TreeTools
            slot-scope="{ data }"
            :tree-node="data"
            @delDepts="getDepartments"
          />
        </el-tree>
      </el-card>
    </div>
    <AddDept @addDepts="getDepartments" />
  </div>
</template>

<script>
import TreeTools from './components/tree-tools.vue'
import AddDept from './components/add-dept' // 引入新增部门组件
import { getDepartments } from '@/api/departments'
import { transData } from '@/utils/index'
export default {
  components: { TreeTools, AddDept },
  data() {
    return {
      company: {}, // 就是头部的数据结构
      departs: [],
      defaultProps: {
        label: 'name' // 表示 从这个属性显示内容
      },
      loading: false // 用来控制进度弹层的显示和隐藏
    }
  },
  created() {
    this.getDepartments() // 调用自身的方法
  },
  methods: {
    async getDepartments() {
      this.loading = true
      const result = await getDepartments()
      this.company = { name: result.companyName, manager: '负责人', id: '' }
      // this.departs = result.depts // 需要将其转化成树形结构
      this.departs = transData(result.depts, '')
      // console.log(result)
      this.loading = false
    }
  }
}
</script>

<style scoped>
.tree-card {
  padding: 30px 140px;
  font-size: 14px;
}
</style>

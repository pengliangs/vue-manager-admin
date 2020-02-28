<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.roleName"
        placeholder="资源名"
        style="width: 200px;"
        class="filter-item"
      />
     <el-select v-model="listQuery.status" placeholder="请求方式" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in requestTypes" :key="item" :label="item" :value="item" />
      </el-select>
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleSearch"
      >
        搜索
      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-refresh-left"
        @click="handleCreate"
      >
        刷新资源
      </el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column prop="id" label="ID" align="center" width="95" />
      <el-table-column prop="resourceName" label="资源名称" align="center" />
      <el-table-column prop="method" label="请求方式" align="center" />
      <el-table-column prop="mapping" label="映射路径" align="center" />
      <el-table-column prop="authType" label="授权类型" align="center" />
      <el-table-column prop="perm" label="权限标识" align="center" />
      <el-table-column prop="updateTime" label="修改时间" width="200" align="center"/>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="renderData"
    />
  </div>
</template>

<script>
import { getBackResources } from "@/api/table";
import Pagination from "@/components/Pagination";

export default {
  name: "resources-manager",
  components: { Pagination },
  data() {
    return {
      requestTypes:["GET","POST","PUT","DELETE"],
      list: [],
      total: 0,
      listQuery: {
        page: 1,
        limit: 20,
        roleName: ""
      },
      listLoading: true,
      formData: {
        roleName: "",
        remark: ""
      }
    };
  },
  created() {
    this.renderData();
  },
  methods: {
    renderData() {
      let that = this;
      that.listLoading = true;
      getBackResources().then(res => {
        let { result } = res;
        that.total = result.total || 0;
        that.list = result.records;
        that.listLoading = false;
      });
    },
    handleSearch() {
      this.renderData();
    }
  }
};
</script>

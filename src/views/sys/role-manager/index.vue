<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.roleName"
        placeholder="角色名称"
        style="width: 200px;"
        class="filter-item"
      />
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
        icon="el-icon-edit"
        @click="handleCreate"
      >
        添加
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
      <el-table-column prop="roleName" label="角色" align="center" />
      <el-table-column prop="remark" label="备注" align="center" />
      <el-table-column
        prop="createTime"
        label="创建时间"
        width="200"
        align="center"
      />
      <el-table-column
        prop="updateTime"
        label="修改时间"
        width="200"
        align="center"
      />
      <el-table-column fixed="right" label="操作" align="center" width="180">
        <template slot-scope="scope">
          <el-button @click="handlerGrant(scope.row)" type="text" size="small"
            >菜单授权</el-button
          >
          <el-button
            @click="handleUpdateClick(scope.row)"
            type="text"
            size="small"
            >修改</el-button
          >
          <el-button type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="renderData"
    />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="formData"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="角色名" prop="roleName">
          <el-input v-model="formData.roleName" placeholder="请输入角色名" />
        </el-form-item>

        <el-form-item label="角色" prop="remark">
          <el-input
            v-model="formData.remark"
            :autosize="{ minRows: 2, maxRows: 4 }"
            type="textarea"
            placeholder="请输入备注"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button
          type="primary"
          @click="dialogStatus === 'create' ? createData() : updateData()"
        >
          提交
        </el-button>
      </div>
    </el-dialog>

    <el-dialog title="菜单授权" :visible.sync="dialogGrantVisible" top="40px" width="400px">
      <div style="height:500px;overflow: auto;">
        <div>
          <el-tree
            ref="tree"
            :data="permList"
            show-checkbox
          ></el-tree>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
          <el-button @click="dialogGrantVisible = false">
            取消
          </el-button>
          <el-button type="primary">
            提交
          </el-button>
        </div>
    </el-dialog>
  </div>
</template>

<script>
import { getBackRoles } from "@/api/table";
import Pagination from "@/components/Pagination";

export default {
  name: "role-manager",
  components: { Pagination },
  filters: {
    joinRolesFilter(roles) {
      if (!roles || roles.length <= 0) {
        return "";
      }
      return roles.map(role => role.roleName).join(",");
    },
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "gray",
        deleted: "danger"
      };
      return statusMap[status];
    }
  },
  data() {
    return {
      dialogGrantVisible: false,
      permList: [{
          id: 1,
          label: '一级 1',
          children: [{
            id: 4,
            label: '二级 1-1',
            children: [{
              id: 9,
              label: '三级 1-1-1'
            }, {
              id: 10,
              label: '三级 1-1-2'
            }]
          }]
        }, {
          id: 2,
          label: '一级 2',
          children: [{
            id: 5,
            label: '二级 2-1'
          }, {
            id: 6,
            label: '二级 2-2'
          }]
        }, {
          id: 3,
          label: '一级 3',
          children: [{
            id: 7,
            label: '二级 3-1'
          }, {
            id: 8,
            label: '二级 3-2'
          }]
        }],
      roles: ["超级管理员", "管理员"],
      list: [],
      total: 0,
      listQuery: {
        page: 1,
        limit: 20,
        roleName: ""
      },
      accountStatus: [
        { value: 0, name: "正常" },
        { value: 1, name: "禁用" }
      ],
      listLoading: true,
      dialogFormVisible: false,
      textMap: { create: "创建", update: "修改" },
      dialogStatus: "",
      rules: {
        roleName: [
          { required: true, message: "角色名必填", trigger: "change" }
        ],
        remark: [{ required: false, message: "xxxx", trigger: "blur" }]
      },
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
      getBackRoles().then(res => {
        let { result } = res;
        that.total = result.total || 0;
        that.list = result.records;
        that.listLoading = false;
      });
    },
    handlerGrant() {
      this.dialogGrantVisible = true;
    },
    handleCreate() {
      let that = this;
      that.dialogFormVisible = true;
      that.dialogStatus = "create";
      that.formData.loginName = "";
      that.formData.nickname = "";
      that.formData.phone = "";
      that.formData.email = "";
    },
    handleUpdateClick(row) {
      let that = this;
      that.dialogFormVisible = true;
      that.dialogStatus = "update";
      that.formData.loginName = row.loginName;
      that.formData.nickname = row.nickname;
      that.formData.phone = row.phone;
      that.formData.email = row.email;
    },
    handleSearch() {
      this.renderData();
    }
  }
};
</script>

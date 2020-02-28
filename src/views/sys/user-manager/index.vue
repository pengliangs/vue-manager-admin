<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.loginName"
        placeholder="账号"
        style="width: 200px;"
        class="filter-item"
      />
      <el-input
        v-model="listQuery.nickname"
        placeholder="昵称"
        style="width: 200px;"
        class="filter-item"
      />
      <el-select
        v-model="listQuery.status"
        placeholder="状态"
        clearable
        style="width: 90px"
        class="filter-item"
      >
        <el-option
          v-for="item in accountStatus"
          :key="item.value"
          :label="item.name"
          :value="item.value"
        />
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
      <el-table-column prop="loginName" label="账号" align="center" />
      <el-table-column prop="nickname" label="昵称" align="center" />
      <el-table-column prop="nickname" label="角色" align="center">
        <template slot-scope="scope">
          {{ scope.row.userRoles | joinRolesFilter }}
        </template>
      </el-table-column>
      <el-table-column
        prop="phone"
        label="手机号码"
        width="110"
        align="center"
      />
      <el-table-column prop="email" label="邮箱" width="110" align="center" />
      <el-table-column
        prop="createTime"
        label="创建时间"
        width="200"
        align="center"
      />
      <el-table-column prop="nickname" label="状态" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            :active-value="0"
            :inactive-value="1"
            active-text="正常"
            inactive-text="禁用"
            @change="handleSwitchChange(scope.row)"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" align="center" width="150">
        <template slot-scope="scope">
          <el-button
            @click="handleUpdateClick(scope.row)"
            type="text"
            size="small"
            >修改</el-button
          >
          <el-button type="text" size="small" @click="handleRestPwd(scope.row)">重置密码</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.cursor"
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
        <el-form-item label="账号" prop="loginName">
          <div v-if="dialogStatus === 'create'">
            <el-input
              v-model="formData.loginName"
              placeholder="请输入登录账号"
            />
          </div>
          <div v-else>{{ formData.loginName }}</div>
        </el-form-item>

        <el-form-item label="昵称" prop="nickname">
          <el-input
            v-model.trim="formData.nickname"
            placeholder="请输入用户昵称"
          />
        </el-form-item>

        <el-form-item label="电话" prop="phone">
          <el-input
            v-model.number="formData.phone"
            placeholder="请输入手机号码"
          />
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input
            v-model.trim="formData.email"
            placeholder="请输入电子邮箱"
          />
        </el-form-item>

        <el-form-item label="角色" prop="roleIds">
          <el-select
            v-model="formData.roleIds"
            class="filter-item"
            placeholder="请选择角色"
          >
            <el-option
              v-for="item in roles"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
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
  </div>
</template>

<script>
import { getBackUsers, switchBackUserStatus,restBoackPassword } from "@/api/user-manager";
import Pagination from "@/components/Pagination";

export default {
  name: "user-manager",
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
      roles: ["超级管理员", "管理员"],
      list: [],
      total: 0,
      listQuery: {
        cursor: 1,
        limit: 20,
        loginName: "",
        nickname: "",
        status: ""
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
        loginName: [
          { required: true, message: "用户名必填", trigger: "change" }
        ],
        nickname: [
          {
            type: "date",
            required: true,
            message: "用户昵称必填",
            trigger: "change"
          }
        ],
        roleIds: [{ required: true, message: "角色必填", trigger: "blur" }]
      },
      formData: {
        loginName: "",
        nickname: "",
        phone: "",
        email: "",
        roleIds: []
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
      getBackUsers(that.listQuery).then(res => {
        let { result } = res;
        that.total = result.total || 0;
        that.list = result.records;
        that.listLoading = false;
      });
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
    },
    handleSwitchChange(row) {
      switchBackUserStatus(row.id, row.status)
        .then(res => {})
        .catch(er => {
          if (row.status == 0){
            row.status = 1;
          }else if (row.status == 1){
            row.status = 0;
          }
        });
    },
    handleRestPwd(row){
       this.$confirm(`是否确认重置 "${row.nickname}" 登陆密码?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
         restBoackPassword(row.id);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    }
  }
};
</script>

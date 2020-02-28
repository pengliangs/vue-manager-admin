<template>
  <div class="app-container">
    <el-row :gutter="10">
      <el-col :md="8">
        <div class="operation">
          <el-button size="mini" @click="addMenu()" type="primary"
            >添加一级菜单</el-button
          >
          <el-button size="mini" @click="renderTreeData()">刷新菜单</el-button>
          <el-button size="mini" @click="expandFirstNodeTree()"
            >展开一级</el-button
          >
          <el-button size="mini" @click="expandTree(true)">全部展开</el-button>
          <el-button size="mini" @click="expandTree(false)">全部收起</el-button>
        </div>
        <el-alert
          class="operation"
          type="info"
          :description="alertDescription"
          show-icon
          :closable="false"
        >
        </el-alert>
        <el-input
          class="operation"
          size="small"
          placeholder="输入关键字进行过滤"
          v-model="filterText"
        ></el-input>
        <el-tree
          ref="tree"
          :data="menus"
          :expand-on-click-node="false"
          node-key="id"
          :render-content="handlerRenderContent"
          highlight-current
          :filter-node-method="filterNode"
          @node-click="handleNodeClick"
        ></el-tree>
      </el-col>
      <el-col :sm="10">
        <el-form ref="form" :model="formData" label-width="80px">
          <el-form-item label="菜单名称">
            <el-input
              v-model.trim="formData.menuName"
              placeholder="请输入菜单名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="权限名称">
            <el-input
              v-model.trim="formData.alias"
              placeholder="请输入权限名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="类型">
            <el-radio-group v-model="formData.menuType">
              <el-radio :label="1">目录</el-radio>
              <el-radio :label="2">菜单</el-radio>
              <el-radio :label="3">按钮</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="菜单图标">
            <el-input placeholder="请输入内容" v-model="formData.icon">
              <template slot="prepend">icon</template>
              <el-button
                slot="append"
                icon="el-icon-help"
                @click="
                  iconsVisible = true;
                  clickOperationBut = 'update';
                "
                >选择图标</el-button
              >
            </el-input>
          </el-form-item>
          <el-form-item label="状态">
            <el-radio-group v-model="formData.status">
              <el-radio :label="0">正常</el-radio>
              <el-radio :label="1">禁用</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item>
            <el-button type="primary">提交</el-button>
            <el-button @click="resetForm()">取消选中</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <el-dialog title="添加节点" :visible.sync="dialogFormVisible" @open="handlerDialogOpen" width="550px">
      <el-form
        ref="addFrom"
        :rules="addRules"
        :model="addFormData"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left:50px;"
      >
        <el-alert
          class="operation"
          type="info"
          :description="alertDescAddMenu"
          show-icon
          :closable="false"
        >
        </el-alert>
        <el-form-item label="菜单名称" prop="menuName">
          <el-input
            v-model="addFormData.menuName"
            placeholder="请输入菜单名称"
          />
        </el-form-item>

        <el-form-item label="权限别名" prop="alias">
          <el-input
            v-model.trim="addFormData.alias"
            placeholder="请输入权限别名"
          />
        </el-form-item>
        <el-form-item label="节点类型">
          <el-radio-group v-model="addFormData.menuType">
            <el-radio :label="1">目录</el-radio>
            <el-radio :label="2">菜单</el-radio>
            <el-radio :label="3">按钮</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="菜单图标">
          <el-input placeholder="请输入内容" v-model="addFormData.icon">
            <template slot="prepend">icon</template>
            <el-button
              slot="append"
              icon="el-icon-help"
              @click="
                iconsVisible = true;
                clickOperationBut = 'create';
              "
              >选择图标</el-button
            >
          </el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="addFormData.status">
            <el-radio :label="0">正常</el-radio>
            <el-radio :label="1">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary">
          提交
        </el-button>
      </div>
    </el-dialog>

    <iconsPanel
      :visible.sync="iconsVisible"
      @iconClick="handlerIconClick"
    ></iconsPanel>
  </div>
</template>
<script>
import { allMenus } from "@/api/menu-manager";
import IconsPanel from "@/components/IconsPanel";
export default {
  name: "menu-manager",
  components: { IconsPanel },
  data() {
    return {
      clickOperationBut: "", //update,create
      iconsVisible: false,
      dialogFormVisible: false,
      filterText: "",
      alertDescriptionInfo: "当前正在编辑节点：",
      alertDescription: "当前正在编辑节点：",
      alertDescAddMenuInfo: "上级：",
      alertDescAddMenu: "上级：",
      menus: [],
      menusList: [],
      formData: {
        id: "",
        menuName: "",
        alias: "",
        menuType: "",
        status: "",
        icon: ""
      },
      addFormData: {
        menuName: "",
        alias: "",
        menuType: 1,
        status: 0,
        icon: ""
      },
      addRules: {}
    };
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  created() {
    this.renderTreeData();
  },
  methods: {
    resetAddFormData() {
      this.addFormData.menuName = "";
      this.addFormData.alias = "";
      this.addFormData.menuType = 1
      this.addFormData.status = 0;
      this.addFormData.icon = "";
    },
    renderTreeData() {
      let that = this;
      allMenus().then(res => {
        that.menusList = res.result || [];
        that.menus = that.menuToTree(res.result);
      });
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    handlerRenderContent(h, { node, data, store }) {
      return (
        <span class="custom-tree-node">
          <span>{data.menuName}</span>
          <span>
            <el-button
              size="mini"
              type="text"
              on-click={() => this.appendTree(data)}
            >
              添加
            </el-button>
            <el-button
              size="mini"
              type="text"
              on-click={() => this.removeTree(node, data)}
            >
              删除
            </el-button>
          </span>
        </span>
      );
    },
    menuToTree(list) {
      if (!list || list.length === 0) {
        return;
      }

      let resultMenus = [];
      let childrenMenus = [];
      list.forEach(item => {
        if (!item.parentId) {
          resultMenus.push(item);
        } else {
          childrenMenus.push(item);
        }
      });

      resultMenus.forEach(item => {
        findChildren(item);
      });

      function findChildren(item) {
        childrenMenus.forEach(childrenItem => {
          if (item.id === childrenItem.parentId) {
            if (item.children) {
              item.children.push(childrenItem);
            } else {
              item.children = [childrenItem];
            }
            findChildren(childrenItem);
          }
        });
      }
      return resultMenus;
    },
    handleNodeClick(data, node, compt) {
      this.formData.id = data.id;
      this.formData.menuName = data.menuName;
      this.formData.alias = data.alias;
      this.formData.menuType = data.menuType;
      this.formData.status = data.status;
      this.alertDescription = this.alertDescriptionInfo + data.menuName;
    },
    handlerExpanded(list, isExpand) {
      let that = this;
      let size = list ? list.length : 0;
      for (let index = 0; index < size; index++) {
        let id = list[index].id;
        if (id) {
          let nodesMap = that.$refs.tree.store.nodesMap[id];
          if (nodesMap) {
            nodesMap.expanded = isExpand;
          }
        }
      }
    },
    expandTree(isExpand) {
      this.handlerExpanded(this.menusList, isExpand);
    },
    expandFirstNodeTree() {
      this.expandTree(false);
      this.handlerExpanded(this.menus, true);
    },
    resetForm() {
      this.formData.id = "";
      this.formData.menuName = "";
      this.formData.alias = "";
      this.formData.menuType = "";
      this.formData.status = "";
      this.alertDescription = this.alertDescriptionInfo;
      this.$refs.tree.setCurrentKey(null);
    },
    appendTree() {},
    removeTree() {},
    addMenu() {
      this.dialogFormVisible = true;
      this.alertDescAddMenu = this.alertDescAddMenuInfo + "第一级根节点";
    },
    handlerIconClick(value) {
      if (this.clickOperationBut === "create") {
        this.addFormData.icon = value;
        return;
      }
      if (this.clickOperationBut === "update") {
        this.formData.icon = value;
        return;
      }
    },
    handlerDialogOpen(){
      this.resetAddFormData();
    }
  }
};
</script>
<style scoped lang="scss">
.operation {
  margin: 0px 0px 10px 0px;
}
</style>

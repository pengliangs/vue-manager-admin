<template>
  <el-dialog
    title="Icons面板"
    @close="handleClose"
    :visible="visible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <div class="icons-container">
      <div class="icons-item" @click="handeClick('iconfont xxxx')">
        <div class="icon el-icon-help"></div>
        <div>xxxx</div>
      </div>
      <div style=" clear: both;"></div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "IconsPanel",
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleClose(){
      this.$emit("update:visible", false);
    },
    handeClick(value) {
      this.$emit("update:visible", false);
      this.$emit("iconClick", value);
    }
  }
};
</script>

<style scoped lang="scss">
.icons-container {
  position: relative;
  .icons-item {
    height: 70px;
    text-align: center;
    padding: 5px;
    margin-left: 15px;
    margin-bottom: 10px;
    color: #666;
    float: left;
    line-height: 20px;
    &:hover {
      color: #409eff;
    }
    cursor: pointer;
    div {
      width: 100px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .icon {
      font-size: 30px;
    }
  }
}
</style>

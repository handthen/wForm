<template>
  <m-form ref="form" :label-width="formConfig.labelWidth" :model="form" :showMessage="formConfig.showMessage"
    :inline="formConfig.inline">
    <w-row v-for="(itemRow, index) in formList" :key="index" :gutter="formConfig.gutter">
      <template v-for="itemcolumn in itemRow">
        <w-col :key="itemcolumn.key" v-if="$scopedSlots[itemcolumn.key]" :span="itemcolumn.columnSpan">
          <m-form-item :label="itemcolumn.label" :prop="itemcolumn.key" :rules="itemcolumn.rules"
            :label-width="itemcolumn.labelWidth" :required="itemcolumn.required">
            <slot :name="itemcolumn.key" :data="itemcolumn"></slot>
          </m-form-item>
        </w-col>
        <template v-else>
          <column-item :key="itemcolumn.key" :config="itemcolumn" v-model="form[itemcolumn.key]">
          </column-item>
        </template>
      </template>
    </w-row>
  </m-form>
</template>
<script>
import ColumnItem from "./component/ColumnItem.vue";
import wRow from "@/components/wRow";
import wCol from "@/components/wCol";
import { MForm, MFormItem } from '@/components/form'
export default {
  name: "WForm",
  components: {
    ColumnItem,
    wRow,
    wCol,
    MForm,
    MFormItem
  },
  provide() {
    return {
      WForm: this,
    };
  },
  props: {
    formData: {
      type: Object,
      default: () => ({}),
    },
    columnList: {
      type: Array,
      default: () => ([]),
    },
    formConfig: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      formList: [],
      form: {},
    };
  },
  created() {
    this.formList = this.initColumn();
    this.form = this.formData
    this.$on('set_from', this.setValue)
  },
  methods: {
    initColumn() {
      // 生成每行每列 默认每行 24 栅格
      const newColumnList = [];
      let newColumnItem = [];
      let columnNum = 0;
      for (let i = 0; i < this.columnList.length; i++) {
        const item = this.columnList[i];
        // 如果该项没有设置 columnSpan 则默认占该行剩余空间
        if (!this.isColumnSpan(item.columnSpan) && !this.formConfig.inline) {
          item.columnSpan = 24
          // const remaColumn = newColumnItem.reduce(
          //   (a, b) => a + b.columnSpan,
          //   0
          // );
          // item.columnSpan = remaColumn == 0 ? 24 : 24 - remaColumn;
          newColumnItem.push(item);
          newColumnList.push(newColumnItem);
          newColumnItem = [];
          columnNum = 0;
          continue;
        }
        columnNum += +item.columnSpan;
        columnNum += +item.offset;
        // 满 24 换一行
        if (columnNum >= 24 || i == this.columnList.length - 1) {
          // 如果加上该项大于了 24 ,则让该项换一行显示
          if (columnNum > 24) {
            newColumnList.push(newColumnItem);
            newColumnItem = [];
            columnNum = 0;
            newColumnItem.push(item);
            // 如果是最后一个则直接放入数组,否则循环下一个
            i == this.columnList.length - 1 &&
              newColumnList.push(newColumnItem);
            continue;
          }
          newColumnItem.push(item);
          newColumnList.push(newColumnItem);
          newColumnItem = [];
          columnNum = 0;
          continue;
        }
        newColumnItem.push(item);
      }
      return newColumnList;
    },
    isColumnSpan(columnSpan) {
      if (!isNaN(+columnSpan)) {
        return true;
      }
      return false;
    },
    async validate() {
      const vaild = await this.$refs["form"].validate();
      return vaild;
    },
    clearValid(props) {
      this.$refs['form'].clearValid(props)
    },
    resetValid(props) {
      this.$refs['form'].resetValid(props)
    },
    setValue(key, val) {
      this.$set(this.form, key, val)
      this.$set(this.formData, key, val)
    }
  },
};
</script>
<style>
</style>

<template>
  <w-col :span="config.columnSpan" :offset="config.offset" v-bind="config.respond">
    <m-form-item :label="config.label" :prop="config.key" :label-width="config.labelWidth" :rules="config.rules"
      :required="config.required" :showMessage="config.showMessage">
      <component :style="config.styleItem" :is="config.name" :value="currentValue" @input="updataValue"
        v-bind="getAttrs[0]" v-on="getAttrs[1]">
        <template v-if="config.optionName">
          <component :is="config.optionName" v-for="(item, index) in config.options" :key="index"
            :value="isRC ? '' : item.value" :label="isRC ? item.value : item.label">
            {{ item.label }}
          </component>
        </template>
      </component>
    </m-form-item>
  </w-col>
</template>
<script>
import wCol from "@/components/wCol";
import { MFormItem } from "@/components/form";
import mix_bs from "./mix_bs";
export default {
  name: "ColumnItem",
  components: { wCol, MFormItem },
  props: {
    config: {
      type: Object,
      default: () => { },
    },
    value: [String, Number, Array],
  },
  mixins: [mix_bs],
  data() {
    return {
      currentValue: "",
      Pself: null,
    };
  },
  inject: ["WForm"],
  created() {
    this.currentValue = this.value;
  },
  computed: {
    isRC() {
      const names = ["radio", "checkbox"];
      // 以上组件label <==> value 互换
      if (names.some((v) => this.config.name.indexOf(v) != -1)) {
        return 1;
      }
      return 0;
    },
    getAttrs() {
      // 剔除和获取属性
      const attrs = { ...this.config };
      const listeners = {};
      const filterAttr = [
        "options",
        "offset",
        "name",
        "rules",
        "columnSpan",
        "value",
        "label",
        "styleItem",
        "optionName",
      ];
      Object.keys(attrs).forEach((v) => {
        if (typeof attrs[v] == "function") {
          if (!this.Pself) {
            this.getSelf();
          }
          listeners[v] = attrs[v].bind(this.Pself);
          delete attrs[v];
        }
        if (filterAttr.includes(v)) {
          delete attrs[v];
        }
      });

      return [attrs, listeners];
    },
  },
  watch: {
    currentValue() {
      if (this.value != this.currentValue) {
        this.$emit("input", this.currentValue);
      }
    },
  },
  methods: {
    updataValue(e) {
      if (
        Object.prototype.toString.call(e).slice(8, -1).indexOf("Event") != -1
      ) {
        return (this.currentValue = e.target.value);
      }
      this.currentValue = e;
    },
    getSelf() {
      let parent = this.$parent;
      while (parent && parent.$options.name !== "WForm") {
        parent = parent.$parent;
      }
      this.Pself = parent.$parent;
    },
  },
};
</script>
<style>
</style>

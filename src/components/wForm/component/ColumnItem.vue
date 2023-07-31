<template>
  <w-col
    :span="config.columnSpan"
    :offset="config.offset"
    v-bind="config.respond"
  >
    <m-form-item
       ref="formItem"
      :label="config.label"
      :prop="config.key"
      :label-width="config.labelWidth"
      :rules="config.rules"
      :required="config.required"
      :showMessage="config.showMessage"
    >
      <component
        :id="'w_' + config.key"
        :style="config.styleItem"
        :is="config.name"
        :value="currentValue"
        @input="updataValue"
        @blur="blur"
        @change="change"
        v-bind="getAttrs[0]"
        v-on="getAttrs[1]"
      >
        <template v-if="config.optionName">
          <component
            :is="config.optionName"
            v-for="(item, index) in config.options"
            :key="index"
            :value="isRC ? '' : item.value"
            :label="isRC ? item.value : item.label"
          >
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
      default: () => {},
    },
    value: {
      default: "",
    },
  },
  mixins: [mix_bs],
  data() {
    return {
      currentValue: "",
      Pself: null,
    };
  },
  inject: ["WForm"],
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
        "required"
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
  mounted() {
    this.$nextTick(() => {
      this.target = document.querySelector("#w_" + this.config.key);
    });
  },
  watch: {
    value: {
      handler() {
        if (this.target) {
          if (this.target.$options && this.target.$options._componentTag) {
            return (this.currentValue = this.value);
          } else {
            this.target.value = this.value;
          }
        }
        this.currentValue = this.value;
      },
      immediate: true,
    },
  },
  methods: {
    updataValue(e) {
      if (
        Object.prototype.toString.call(e).slice(8, -1).indexOf("Event") != -1
      ) {
        this.$dispatch("WForm", "set_from", this.config.key, e.target.value);
        this.$refs['formItem'].$emit('valid_filed',{type:'input'})
        return (this.currentValue = e.target.value);
      }
      this.$dispatch("WForm", "set_from", this.config.key, e);
      this.$refs['formItem'].$emit('valid_filed',{type:'input'})
      this.currentValue = e;
    },
    getSelf() {
      let parent = this.$parent;
      while (parent && parent.$options.name !== "WForm") {
        parent = parent.$parent;
      }
      this.Pself = parent.$parent;
    },
    blur(e){
      this.$refs['formItem'].$emit('valid_filed',{type:'blur'})
    },
    change(e){
      this.$refs['formItem'].$emit('valid_filed',{type:'change'})
    }
  },
};
</script>
<style></style>

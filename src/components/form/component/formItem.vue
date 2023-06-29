<template>
  <div class="w_form_item" :class="{ w_form_inline: MForm.inline }">
    <label-warp :class="{ is_required: isRequired }" :labelWidth="labelWidth">
      <label
        class="w_form_item_label"
        :style="{ width: labelWidth || MForm.labelWidth,textAlign:align }"
      >
        {{ label }}
      </label>
    </label-warp>
    <div class="w_form_item__content">
      <slot></slot>
      <div
        class="m_form_error_text"
        v-if="validateState == 'error' && showMessage && MForm.showMessage"
      >
        {{ validateMessage }}
      </div>
    </div>
  </div>
</template>
<script>
import labelWarp from "./labelWarp.vue";
import asyncValidator from "async-validator";
import mix_util from "../mix_util";
export default {
  name: "FormItem",
  components: { labelWarp },
  mixins: [mix_util],
  props: {
    labelWidth: String,
    label: {
      type: String,
      default: "",
    },
    prop: String,
    required: Boolean,
    rules: {
      type: Array,
      default: null,
    },
    showMessage: {
      type: Boolean,
      default: true,
    },
    align:{
        type:String,
        default:'right'
    }
  },
  data() {
    return {
      validateState: "",
      validateMessage: "",
      validateDisabled: false,
    };
  },
  inject: ["MForm"],
  computed: {
    getRules() {
      const requiredRule = this.required
        ? { required: !!this.required, message: "请填入信息", trigger: "blur" }
        : [];
      return []
        .concat(this.rules || this.getProp(this.MForm.rules, this.prop) || [])
        .concat(requiredRule);
    },
    getRulesTargger() {
      const rules = this.getRules;
      return function (targger) {
        return rules.filter((v) => {
          if (!v.targger || !targger) return true;
          if (Array.isArray(v)) {
            return v.includes(targger);
          } else {
            return targger === v.target;
          }
        });
      };
    },
    getFliedValue() {
      if (!this.prop || !this.MForm.model) return;
      return this.getProp(this.MForm.model, this.prop);
    },
    isRequired() {
      try {
        if (this.required) return true;
        const roules = this.getRules;
        if (this.prop && roules.length) return true;
        return false;
      } catch {
        return false;
      }
    },
  },
  mounted() {
    this.$dispatch("MForm", "add_filed", this);
  },
  // eslint-disable-next-line vue/no-deprecated-destroyed-lifecycle
  beforeDestroy() {
    this.$dispatch("MForm", "remove_filed", this);
  },
  methods: {
    validator(trigger, callback) {
      const rules = [...this.getRulesTargger(trigger)];
      rules.forEach((v) => {
        delete v.trigger;
      });
      const descriptor = {
        [this.prop]: rules,
      };
      const validator = new asyncValidator(descriptor);
      validator.validate(
        { [this.prop]: this.getFliedValue },
        { firstFields: true },
        (error, result) => {
          this.validateState = error ? "error" : "success";
          this.validateMessage = error ? error[0].message : "";
          callback && callback(this.validateMessage, result);
        }
      );
    },
    getProp(target, str) {
      if (!str || !target) return;
      const strArr = str.split(".");
      return strArr.reduce((t, s) => {
        return t[s];
      }, target);
    },
  },
};
</script>

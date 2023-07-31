<template>
  <div class="w_form_item" :class="{ w_form_inline: MForm.inline }">
    <label-warp :class="{ is_required: isRequired }" :labelWidth="labelWidth">
      <label
        class="w_form_item_label"
        :style="{ width: labelWidth || MForm.labelWidth, textAlign: align }"
      >
        {{ label }}
      </label>
    </label-warp>
    <div
      class="w_form_item__content"
      :class="{
        valid_error:
          validateState == 'error' && showMessage && MForm.showMessage,
      }"
    >
      <slot></slot>
      <transition name="el-zoom-in-top">
        <div
          class="m_form_error_text"
          v-if="validateState == 'error' && showMessage && MForm.showMessage"
        >
          {{ validateMessage }}
        </div>
      </transition>
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
    labelWidth: {
      type: String,
      default: null,
    },
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
    align: {
      type: String,
      default: "right",
    },
  },
  data() {
    return {
      validateState: "",
      validateMessage: "",
      validateDisabled: false,
      target: null,
      initValue: "",
    };
  },
  inject: ["MForm"],
  computed: {
    getRules() {
      const requiredRule = this.required
        ? {
            required: !!this.required,
            message: "请填入信息",
            trigger: ["change", "blur"],
          }
        : [];
      return []
        .concat(this.rules || this.getProp(this.MForm.rules, this.prop) || [])
        .concat(requiredRule);
    },
    getRulesTargger() {
      const rules = this.getRules;
      return function (trigger) {
        return rules.filter((v) => {
          if (!trigger) return true;
          if(!v.trigger) return false
          if (Array.isArray(v.trigger)) {
            return v.trigger.includes(trigger);
          } else {
            return trigger === v.trigger;
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
    this.initValue = this.getFliedValue;
    this.$on("valid_filed",this.triggerFn);
  },
  // eslint-disable-next-line vue/no-deprecated-destroyed-lifecycle
  beforeDestroy() {
    this.$dispatch("MForm", "remove_filed", this);
  },
  methods: {
    validator(trigger, callback) {
      const rules = this.$clone([...this.getRulesTargger(trigger)]);
      if(!rules.length)return
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
    clearValid() {
      this.validateState = "";
      this.validateMessage = "";
      this.validateDisabled = true;
    },
    resetValid() {
      this.$dispatch("WForm", "set_from", this.prop, this.initValue);
      this.clearValid();
    },
    getProp(target, str) {
      if (!str || !target) return;
      const strArr = str.split(".");
      return strArr.reduce((t, s) => {
        return t[s];
      }, target);
    },
    async triggerFn(e) {
      // await this.sleep(110);
      if (this.validateDisabled) {
        return (this.validateDisabled = false);
      }
      this.validator(e.type);
    },
    async sleep(time) {
      return new Promise((res) => {
        setTimeout(() => {
          res(1);
        }, time);
      });
    },
  },
};
</script>

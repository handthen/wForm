<template>
  <div class="w_form_item" :class="{ w_form_inline: MForm.inline }">
    <label-warp :class="{ is_required: isRequired }" :labelWidth="labelWidth">
      <label class="w_form_item_label" :style="{ width: labelWidth || MForm.labelWidth, textAlign: align }">
        {{ label }}
      </label>
    </label-warp>
    <div class="w_form_item__content"
      :class="{ 'valid_error': validateState == 'error' && showMessage && MForm.showMessage }">
      <slot></slot>
      <transition name="el-zoom-in-top">
        <div class="m_form_error_text" v-if="validateState == 'error' && showMessage && MForm.showMessage">
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
    this.$slots.default[0].elm.addEventListener("click", this.bindEvent, true); // 注册事件 ==》验证时机
  },
  // eslint-disable-next-line vue/no-deprecated-destroyed-lifecycle
  beforeDestroy() {
    this.clearEnvent();
    this.$dispatch("MForm", "remove_filed", this);
  },
  methods: {
    validator(trigger, callback) {
      const rules = this.$clone([...this.getRulesTargger(trigger)]);
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
      this.validateState = ""
      this.validateMessage = ""
      this.validateDisabled = true
    },
    resetValid() {
      this.$dispatch('WForm', 'set_from', this.prop, this.initValue)
      this.clearValid()
      this.$nextTick(() => {
        this.$forceUpdate()
      })
    },
    getProp(target, str) {
      if (!str || !target) return;
      const strArr = str.split(".");
      return strArr.reduce((t, s) => {
        return t[s];
      }, target);
    },
    async triggerFn(e) {
      await this.sleep(110);
      if (this.validateDisabled) {
        return this.validateDisabled = false
      }
      this.validator(e.type);
    },
    clearEnvent() {
      if (this.target) {
        this.target.removeEventListener("blur", this.triggerFn);
        this.target.removeEventListener("input", this.triggerFn);
        this.target.removeEventListener("change", this.triggerFn);
      }
    },
    async sleep(time) {
      return new Promise((res) => {
        setTimeout(() => {
          res(undefined);
        }, time);
      });
    },
    bindEvent(e) {
      try {
        this.target = e.target;
        this.getRules.forEach((v) => {
          if (Array.isArray(v.trigger)) {
            v.trigger.forEach(
              (tg) => this.target.addEventListener(tg, this.triggerFn),
              false
            );
          } else {
            v.trigger &&
              this.target.addEventListener(v.trigger, this.triggerFn, false);
          }
        });
        this.$slots.default[0].elm.removeEventListener(
          "click",
          this.bindEvent,
          true
        );
      } catch { }
    },
  },
};
</script>

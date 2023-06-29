<script>
export default {
  name: "MForm",
  props: {
    inline: Boolean,
    model: {
      type: Object,
      default: null,
    },
    rules: {
      type: Object,
      default: null,
    },
    labelWidth: String,
    showMessage: {
      type: Boolean,
      default: true,
    },
  },
  provide() {
    return {
      MForm: this,
    };
  },
  data() {
    return {
      rulesKey: [],
    };
  },
  created() {
    // eslint-disable-next-line vue/no-deprecated-events-api
    this.$on("add_filed", (flied) => {
      flied && this.rulesKey.push(flied);
    });
    // eslint-disable-next-line vue/no-deprecated-events-api
    this.$on("remove_filed", (flied) => {
      flied.prop && this.rulesKey.splice(this.rulesKey.indexOf(flied), 1);
    });
  },
  methods: {
    validate(callback) {
      let flag = true;
      let promise;
      let resultList = {};
      if (typeof callback !== "function" && window.Promise) {
        promise = new Promise((reslove, reject) => {
          callback = function (...arg) {
            arg[0] ? reslove(...arg) : reject(...arg);
          };
        });
      }
      if (!this.model || !this.rulesKey.length) {
        return callback(true);
      }

      this.rulesKey.forEach((v, i) => {
        v.validator("", (v, result) => {
          if (v) {
            flag = false;
          }
          resultList = { ...resultList, ...result };
          if (
            typeof callback === "function" &&
            i === this.rulesKey.length - 1
          ) {
            callback(flag, resultList);
          }
        });
      });

      if (promise) return promise;
    },
  },
  render(h) {
    return h(
      "form",
      {
        class: ["w_form"],
      },
      this.$slots.default
    );
  },
};
</script>

<script>
export default {
  name: "LabelWarp",
  props: {
    labelWidth: String,
  },
  inject: ["MForm"],
  methods: {},
  render() {
    const slot = this.$slots;
    if (!slot) return null;
    return slot.default[0]
  },
};
</script>

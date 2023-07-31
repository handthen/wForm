<script>
export default {
  name: "WRow",
  props: {
    gutter: {
      type: [Number, String],
      default: 0,
    },
    justify: String,
    tag: {
      type: String,
      default: "div",
    },
  },
  inject: ['WForm'],
  computed: {
    rowStyle() {
      return {
        boxSizing: "border-box",
        marginLeft: -this.gutter / 2 + "px",
        marginRight: -this.gutter / 2 + "px",
        justifyContent: this.justify,
      };
    },
  },
  render(h) {
    return h(
      this.tag,
      {
        class: "row",
        style: this.rowStyle,
      },
      this.$slots.default
    );
  },
};
</script>
<style scoped lang="scss">
.row {
  display: flex;
  flex-wrap: wrap;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
</style>

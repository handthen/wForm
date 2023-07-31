<script>
export default {
  name: "WCol",
  props: {
    span: {
      type: [String, Number],
      default: 0,
    },
    xs: [Number, Object],
    sm: [Number, Object],
    md: [Number, Object],
    lg: [Number, Object],
    xl: [Number, Object],
    offset: {
      type: Number,
      default: 0,
    },
    tag: {
      type: String,
      default: "div",
    },
  },
  data() {
    return {
      classList: []
    }
  },
  computed: {
    colStyle() {
      let parent = this.$parent;
      while (parent && parent.$options.name !== "WRow") {
        parent = parent.$parent;
      }
      const gutter = parent.gutter
      return {
        boxSizing: "border-box",
        marginLeft: this.offset ? `calc(100% / 24 * ${this.offset})` : "",
        paddingLeft: gutter ? gutter / 2 + "px" : "",
        paddingRight: gutter ? gutter / 2 + "px" : "",
      };
    },
    colClass() {
      if (this.span == 0) return ''
      return "w-col-" + this.span;
    },

  },
  created() {
    this.initClass()
  },
  methods: {
    initClass() {
      ['xs', 'sm', 'md', 'lg', 'xl'].forEach(v => {
        if (typeof this[v] === 'number') {
          this.classList.push(`w_col_${v}_${this[v]}`)
        }
      })
    }
  },
  render(h) {
    return h(
      this.tag,
      {
        class: [this.colClass, ...this.classList],
        style: this.colStyle,
      },
      this.$slots.default
    );
  },
};
</script>
<style scoped lang="scss">
$w_sm: 768px;
$w_md: 992px;
$w_lg: 1200px;
$w_xl: 1920px;
$w_m: (
  "xs": (max-width: $w_sm - 1,
  ),
  "sm": (min-width: $w_sm,
  ),
  "md": (min-width: $w_md,
  ),
  "lg": (min-width: $w_lg,
  ),
  "xl": (min-width: $w_xl,
  ),
);

@for $i from 1 through 24 {
  .w-col-#{$i} {
    flex: calc(100% / 24 * #{$i});
    max-width: calc(100% / 24 * #{$i});
  }
}

//---------------col-xs sm md lg xl
@mixin Col($c, $m: $w_m) {
  @if map-has-key($m, $c) {
    @media only screen and #{inspect(map-get($m, $c))} {
      @content;
    }
  }
}

@mixin for($t) {
  @for $i from 0 through 24 {
    .w_col_#{$t}_#{$i} {
      flex: calc(100% / 24 * #{$i});
      max-width: calc(100% / 24 * #{$i});

      @if($i==0) {
        display: none;
      }
    }
  }
}

@include Col(xs) {
  @include for('xs')
}

@include Col(sm) {
  @include for('sm')
}

@include Col(md) {
  @include for('md')
}

@include Col(lg) {
  @include for('lg')
}

@include Col(xl) {
  @include for('xl')
}
</style>

import brand from "@shared/styles/tokens/brand-tokens";
import global from "@shared/styles/tokens/global-tokens";

export const theme = {
  background: {
    color: {
      primary: {
        pure: brand.background_color_primary_pure,
      },
    },
    blur: {
      level: {
        one: global.background_blur_level_one,
        two: global.background_blur_level_two,
        three: global.background_blur_level_three,
        four: global.background_blur_level_four,
      },
    },
  },
  border: {
    radius: {
      none: global.border_radius_none,
      sm: global.border_radius_sm,
      md: global.border_radius_md,
      lg: global.border_radius_lg,
      pill: global.border_radius_pill,
      circular: global.border_radius_circular,
    },
    width: {
      none: global.border_width_none,
      hairline: global.border_width_hairline,
      thin: global.border_width_thin,
      thick: global.border_width_thick,
      heavy: global.border_width_heavy,
    },
  },
  breakpoints: {
    sm: global.breakpoint_sm,
    md: global.breakpoint_md,
    lg: global.breakpoint_lg,
    xl: global.breakpoint_xl,
    xxl: global.breakpoint_xxl,
  },
  colors: {
    brand: {
      primary: {
        pure: brand.brand_color_primary_pure,
        light: brand.brand_color_primary_light,
        medium: brand.brand_color_primary_medium,
        dark: brand.brand_color_primary_dark,
      },
      secondary: {
        pure: brand.brand_color_secondary_pure,
        light: brand.brand_color_secondary_light,
        medium: brand.brand_color_secondary_medium,
        dark: brand.brand_color_secondary_dark,
      },
    },
    highlight: {
      pure: brand.highlight_color_pure,
      light: brand.highlight_color_light,
      medium: brand.highlight_color_medium,
      dark: brand.highlight_color_dark,
    },
    neutral: {
      low: {
        pure: brand.neutral_color_low_pure,
        light: brand.neutral_color_low_light,
        medium: brand.neutral_color_low_medium,
        dark: brand.neutral_color_low_dark,
      },
      high: {
        pure: brand.neutral_color_high_pure,
        light: brand.neutral_color_high_light,
        medium: brand.neutral_color_high_medium,
        dark: brand.neutral_color_high_dark,
      },
    },
    feedback: {
      warning: {
        pure: brand.feedback_color_warning_pure,
        light: brand.feedback_color_warning_light,
        medium: brand.feedback_color_warning_medium,
        dark: brand.feedback_color_warning_dark,
      },
      helper: {
        pure: brand.feedback_color_helper_pure,
        light: brand.feedback_color_helper_light,
        medium: brand.feedback_color_helper_medium,
        dark: brand.feedback_color_helper_dark,
      },
      success: {
        pure: brand.feedback_color_success_pure,
        light: brand.feedback_color_success_light,
        medium: brand.feedback_color_success_medium,
        dark: brand.feedback_color_success_dark,
      },
      neutral: {
        pure: brand.feedback_color_neutral_pure,
        light: brand.feedback_color_neutral_light,
        medium: brand.feedback_color_neutral_medium,
        dark: brand.feedback_color_neutral_dark,
      },
    },
  },
  font: {
    family: {
      base: brand.font_family_base,
      highlight: brand.font_family_highlight,
    },
    weight: {
      regular: brand.font_weight_regular,
      medium: brand.font_weight_medium,
      bold: brand.font_weight_bold,
    },
    size: {
      xxxs: brand.font_size_xxxs,
      xxs: brand.font_size_xxs,
      xs: brand.font_size_xs,
      sm: brand.font_size_sm,
      md: brand.font_size_md,
      lg: brand.font_size_lg,
      xl: brand.font_size_xl,
      xxl: brand.font_size_xxl,
      display: brand.font_size_display,
    },
  },
  gradient: {
    distance: {
      default: global.gradient_distance_default,
    },
  },
  line: {
    height: {
      default: global.line_height_default,
      xs: global.line_height_xs,
      sm: global.line_height_sm,
      md: global.line_height_md,
      lg: global.line_height_lg,
      xl: global.line_height_xl,
      xxl: global.line_height_xxl,
    },
  },
  opacity: {
    level: {
      semiopaque: global.opacity_level_semiopaque,
      intense: global.opacity_level_intense,
      medium: global.opacity_level_medium,
      light: global.opacity_level_light,
      semitransparent: global.opacity_level_semitransparent,
    },
  },
  shadow: {
    level: {
      one: global.shadow_level_one,
      two: global.shadow_level_two,
      three: global.shadow_level_three,
      four: global.shadow_level_four,
    },
  },
  spacing: {
    quarck: global.spacing_quarck,
    nano: global.spacing_nano,
    xxxs: global.spacing_xxxs,
    xxs: global.spacing_xxs,
    xs: global.spacing_xs,
    sm: global.spacing_sm,
    md: global.spacing_md,
    lg: global.spacing_lg,
    xl: global.spacing_xl,
    xxl: global.spacing_xxl,
    xxxl: global.spacing_xxxl,
    huge: global.spacing_huge,
    giant: global.spacing_giant,
    inset: {
      quarck: global.spacing_inset_quarck,
      nano: global.spacing_inset_nano,
      xs: global.spacing_inset_xs,
      sm: global.spacing_inset_sm,
      md: global.spacing_inset_md,
      lg: global.spacing_inset_lg,
    },
  },
  zindex: {
    one: global.z_index_level_one,
    two: global.z_index_level_two,
    three: global.z_index_level_three,
    four: global.z_index_level_four,
    five: global.z_index_level_five,
    six: global.z_index_level_six,
    seven: global.z_index_level_seven,
    eight: global.z_index_level_eight,
    nine: global.z_index_level_nine,
    ten: global.z_index_level_ten,
  },
};

export const BlendMode = {
  BLEND_ALPHA: 0, // Blend textures considering alpha (default)
  BLEND_ADDITIVE: 1, // Blend textures adding colors
  BLEND_MULTIPLIED: 2, // Blend textures multiplying colors
  BLEND_ADD_COLORS: 3, // Blend textures adding colors (alternative)
  BLEND_SUBTRACT_COLORS: 4, // Blend textures subtracting colors (alternative)
  BLEND_ALPHA_PREMULTIPLY: 5, // Blend premultiplied textures considering alpha
  BLEND_CUSTOM: 6, // Blend textures using custom src/dst factors (use rlSetBlendFactors())
  BLEND_CUSTOM_SEPARATE: 7, // Blend textures using custom rgb/alpha separate src/dst factors (use rlSetBlendFactorsSeparate())
} as const;

export type BlendMode = (typeof BlendMode)[keyof typeof BlendMode];

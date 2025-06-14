export interface ParseArgsOptionConfig {
  /**
   * Type of argument.
   */
  type: 'string' | 'boolean';
  /**
   * Whether this option can be provided multiple times.
   * If `true`, all values will be collected in an array.
   * If `false`, values for the option are last-wins.
   * @default false.
   */
  multiple?: boolean | undefined;
  /**
   * A single character alias for the option.
   */
  short?: string | undefined;
  /**
   * The default value to
   * be used if (and only if) the option does not appear in the arguments to be
   * parsed. It must be of the same type as the `type` property. When `multiple`
   * is `true`, it must be an array.
   * @since v18.11.0
   */
  default?: string | boolean | string[] | boolean[] | undefined;
}

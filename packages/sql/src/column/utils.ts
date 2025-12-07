import type { Dialect } from '../table/constants';
import { ColumnProperties, ColumnPropertyMapping } from './constants';

export function getColumnProperty<DbDialect extends Dialect>(
  dialect: DbDialect,
  property: ColumnProperties
) {
  return ColumnPropertyMapping[property][dialect];
}

export function columnProperty<DbDialect extends Dialect>(dialect: DbDialect) {
  return {
    [ColumnProperties.NOT_NULL]: getColumnProperty(
      dialect,
      ColumnProperties.NOT_NULL
    ),
    [ColumnProperties.UNIQUE]: getColumnProperty(
      dialect,
      ColumnProperties.UNIQUE
    ),
    [ColumnProperties.DEFAULT]: getColumnProperty(
      dialect,
      ColumnProperties.DEFAULT
    ),
    [ColumnProperties.AUTO_INCREMENT]: getColumnProperty(
      dialect,
      ColumnProperties.AUTO_INCREMENT
    ),
    [ColumnProperties.PRIMARY_KEY]: getColumnProperty(
      dialect,
      ColumnProperties.PRIMARY_KEY
    ),
  };
}

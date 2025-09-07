// schemas/schema.js
import createSchema from 'part:@sanity/base/schema-creator';
import schemaTypes from 'all:part:@sanity/base/schema-type';

import article from './article';
import blockContent from './blockContent';
import kuaFengShuiTip from './kuaFengShuiTip.js';
import chineseHoroscope from './chineseHoroscope.js';

export default createSchema({
  name: 'default',
  types: schemaTypes.concat([
    article,
    blockContent,
	kuaFengShuiTip,
	chineseHoroscope,
  ]),
});
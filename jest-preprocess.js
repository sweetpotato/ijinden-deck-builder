// SPDX-License-Identifier: MIT

const babelOptions = {
  presets: ['babel-preset-gatsby'],
};

module.exports = require('babel-jest').default.createTransformer(babelOptions);

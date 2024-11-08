// SPDX-License-Identifier: MIT

require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}.local`,
});

/**
 * @type {import('gatsby').GatsbyConfig}
 */
module.exports = {
  siteMetadata: {
    title: 'イジンデン デッキ作成',
    description: 'イジンデンのデッキレシピを作成するアプリです。',
  },
  pathPrefix: '/ijinden-deck-builder',
}

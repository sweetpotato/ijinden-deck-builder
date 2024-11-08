// SPDX-License-Identifier: MIT

import React from 'react';
import PropTypes from 'prop-types';

function HTML(props) {
  /* eslint-disable react/destructuring-assignment, react/jsx-props-no-spreading */
  return (
    <html {...props.htmlAttributes} lang="ja" prefix="og: https://ogp.me/ns#">
      <head>
        <meta charset="utf-8" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        {props.headComponents}
      </head>
      <body {...props.bodyAttributes}>
        {props.preBodyComponents}
        <noscript>このアプリを利用するには JavaScript を有効にしてください。</noscript>
        {/* eslint-disable react/no-danger */}
        <div
          key="body"
          id="___gatsby"
          dangerouslySetInnerHTML={{ __html: props.body }}
        />
        {/* eslint-enable react/no-danger */}
        {props.postBodyComponents}
      </body>
    </html>
  );
  /* eslint-enable react/jsx-props-no-spreading, react/destructuring-assignment */
}

/* eslint-disable react/forbid-prop-types, react/require-default-props */
HTML.propTypes = {
  htmlAttributes: PropTypes.object,
  headComponents: PropTypes.array,
  bodyAttributes: PropTypes.object,
  preBodyComponents: PropTypes.array,
  body: PropTypes.string,
  postBodyComponents: PropTypes.array,
};
/* eslint-enable react/require-default-props, react/forbid-prop-types */

export default HTML;

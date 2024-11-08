// SPDX-License-Identifier: MIT

import { graphql, useStaticQuery } from 'gatsby';
import React from 'react';
import App from '../components/App';

function IndexPage() {
  return (
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

function useSiteMetadata() {
  const data = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
          description
        }
      }
    }
  `);
  return data.site.siteMetadata;
}

export function Head() {
  const siteMetadata = useSiteMetadata();
  const siteUrl = process.env.PUBLIC_URL || 'http://localhost:8000';
  return (
    <>
      <link rel="icon" href={`${siteUrl}/favicon.ico`} sizes="32x32" />
      <link rel="apple-touch-icon" href={`${siteUrl}/apple-touch-icon.png`} sizes="180x180" />
      <link rel="manifest" href={`${siteUrl}/manifest.json`} />
      <meta name="description" content={siteMetadata.description} />
      <meta property="og:title" content={siteMetadata.title} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`${siteUrl}/`} />
      <meta property="og:image" content={`${siteUrl}/icon-512.png`} />
      <meta property="og:description" content={siteMetadata.description} />
      <meta property="og:site_name" content={siteMetadata.title} />
      <title>{siteMetadata.title}</title>
    </>
  );
}

export default IndexPage;

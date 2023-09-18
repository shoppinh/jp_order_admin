import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

const Head = ({ ...props }) => {
  const { i18n } = useTranslation();

  return (
    <Helmet
      titleTemplate='%s - JP_Order'
      defaultTitle='JP_Order'
      htmlAttributes={{ lang: i18n.language }}
    >
      <meta name='description' content='MuaNgay-VN' />
      <link rel='dns-prefetch' href='https://www.googletagmanager.com' />
      <link rel='preconnect' href='https://www.googletagmanager.com' />
      <link rel='preconnect' href='https://www.google-analytics.com' />
      <link rel='preconnect' href={process.env.REACT_APP_API_URL} />
      {process.env.REACT_APP_DEBUG_MODE === 'true' && <meta name='robots' content='noindex' />}
      <title>{props.title ? props.title + ' | ' : null} Japan Order Admin Dashboard</title>
    </Helmet>
  );
};
export default Head;

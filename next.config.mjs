import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.js');

/** @type {import('next').NextConfig} */
const config = {
  images: { unoptimized: true },
};

export default withNextIntl(config);

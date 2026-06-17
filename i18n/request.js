import { getRequestConfig } from 'next-intl/server';
import en from '../messages/en.json';
import zh from '../messages/zh.json';
import id from '../messages/id.json';

const messages = { en, zh, id };

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale;
  return {
    locale,
    messages: messages[locale] || messages.en,
    timeZone: 'Asia/Shanghai',
  };
});

import type { NextConfig } from "next";

const limitedBots = [
  'facebookexternalhit',
  'WhatsApp',
  'Twitterbot',
  'TelegramBot',
  'vkShare',
  'Discordbot',
  'Slackbot',
  'Googlebot',
  'YandexBot'
];

const nextConfig: NextConfig = {
  // ОТКЛЮЧАЕМ СТРИМИНГ МЕТАДАННЫХ ДЛЯ БОТОВ
  // Подробности тут: https://nextjs.org/docs/app/api-reference/functions/generate-metadata#streaming-metadata
  htmlLimitedBots: new RegExp(limitedBots.join('|'), 'i'),
}
 
export default nextConfig;

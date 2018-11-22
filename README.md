# stock-ticker

> Command line stock price monitor tool

This is a simple Node.js app using Yahoo Finance API as a data source. It monitors stock quotes from your watch list every 5s (configurable) by default.

![Screenshot](https://github.com/phoenixzqy/stock-ticker/blob/master/screenshot/stock-monitor.png?raw=true)

## Dependency

Make sure to install [Node.js](https://nodejs.org/en/download/);

## INSTALL & RUN

Just simply clone this Repo and run `node ticker.js`  or `npm run quote` under Repo.

## CONFIG

In your `config/config.json` file, you can set `refresh_frequency` in millisecond. You can also set your `sync_period` based on your local time and market open schedule.

In general, you **don't** need to touch `yahoo_api`, unless you know what you are doing.

## WATCH LIST

You create your own `config/watch_list.json` file to get your stock watch list. You can group them by creating an array of stocks with a key as category name.

Note: Please start your watch list by renaming and editing the `watch_list.example.json` file.

## Stocks from Markets other than the U.S.

For example, if you need to find a stock from HongKong market, let's say `Tencent` Inc., you always can find it's symbol from [Yahoo Finance](https://finance.yahoo.com/). The symbol would be like this: `0700.HK`;

## TODOs

* Stock price/percentage alert/notification

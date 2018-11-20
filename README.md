# stock-ticker

> Command line stock price monitor tool

This is a simple Node.js app using Yahoo Finance API as a data source. It monitor stock quotes every 5s(configurable) in your watch list.

![Screenshot](https://github.com/phoenixzqy/stock-ticker/blob/master/screenshot/stock-monitor.png?raw=true)

## Dependency

Make sure to install [Node.js](https://nodejs.org/en/download/);

## INSTALL & RUN

Just simply clone this Repo and run `node ticker.js`  or `npm run quote` under Repo.

## CONFIG

In your `.config.json` file, you can add stock simple in `watch_list` array. And also you can set `refresh_frequency` in millisecond. In general, you **don't** need to touch `yahoo_api`, unless you know what you are doing.

## Stocks from Markets other than the US

For example, if you need to find a stock from HongKong market, let's say `Tencent` Inc., you always can find it's symbol from [Yahoo Finance](https://finance.yahoo.com/). The symbol would be like this: `0700.HK`;

## TODOs

* Stock price/percentage alert/notification

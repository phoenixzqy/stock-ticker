const config = require("./.config.json");
const https = require("https");
const COLOR_SET = {
    RESET: "\x1b[0m",
    FG_RED: "\x1b[31m",
    FG_GREEN: "\x1b[32m",
    FG_YELLOW: "\x1b[33m"
};
const colorize = (num, color) => {
    return `${color}${num}${COLOR_SET.RESET}`;
};
const quoteFromYahoo = cb => {
    const endpoint = config.yahoo_api.endpoint;
    const symbols = config.watch_list.join(',');
    // const fields = config.yahoo_api.fields.join(',');
    // var url = `${endpoint}&fields=${fields}&symbols=${symbols}`;
    var url = `${endpoint}&symbols=${symbols}`;
    https.get(url, (resp) => {
        let data = '';
        // A chunk of data has been received.
        resp.on('data', (chunk) => {
            data += chunk;
        });
        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            cb(JSON.parse(data));
        });
    }).on("error", (err) => {
        console.log("Error: " + err.message);
    });
};

const printTable = data => {
    const results = data.quoteResponse.result;
    var table = [
        // table headers
        ['Symbol', 'State', 'Open at', 'Now at', 'Change $', 'Change %', ' Name'],
    ];
    // build table data
    results.forEach(item => {
        table.push([
            item.symbol,
            item.marketState,
            item.regularMarketPreviousClose.toFixed(2),
            item.regularMarketPrice.toFixed(2),
            item.regularMarketChange.toFixed(2),
            item.regularMarketChangePercent.toFixed(2),
            ` ${item.shortName}`
        ]);
    });
    // clear console
    console.clear();
    // print table
    const CHANGE_PERCENT_INDEX = 5;
    const STATE_INDEX = 1;
    const COLORIZED_NUM_INDEXES = [4, 5];
    const ALIGN_RIGHT_INDEXES = [2, 3 , 4, 5];
    table.forEach((item, index) => {
        const TABLE_CELL_WIDTH = 10;
        console.log(`${item.map((x, i) => {
            var str = i === CHANGE_PERCENT_INDEX && index > 0 ? `(${x}%)` : x.toString();
            var spaces = ' '.repeat(Math.max(TABLE_CELL_WIDTH - str.length, 0));
            var text = "";
            if (i === STATE_INDEX && index > 0) {
                text = x.toUpperCase() === 'REGULAR' ? colorize(str, COLOR_SET.FG_GREEN) : colorize(str, COLOR_SET.FG_YELLOW);
            } else {
                text = COLORIZED_NUM_INDEXES.indexOf(i) >= 0 && index > 0 ? colorize(str, x >= 0 ? COLOR_SET.FG_GREEN : COLOR_SET.FG_RED) : str;
            }
            if (ALIGN_RIGHT_INDEXES.indexOf(i) >= 0) {
                // align right
                return `${spaces}${text}`;
            } else {
                // align left
                return `${text}${spaces}`;
            }
        }).join('')}`);
        if (index === 0) {
            console.log('-'.repeat(TABLE_CELL_WIDTH * table[0].length));
        }
    });
    // should refresh time
    console.log(`\nRefresh at: ${new Date()}`);
};

// start the monitor
setInterval(function callMe() {
    quoteFromYahoo(printTable);
    return callMe;
}(), config.refresh_frequency);

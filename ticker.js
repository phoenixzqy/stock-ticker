const config = require("./config/config.json");
const watch_list = (function() {
    try {
        return require("./config/watch_list.json");
    } catch (e) {
        console.log("ERROR: Can NOT find `config/watch_list.json` file");
        process.exit();
    }
})();
const https = require("https");
const COLOR_SET = {
    RESET: "\x1b[39m",
    FG_RED: "\x1b[31m",
    FG_GREEN: "\x1b[92m",
    FG_YELLOW: "\x1b[33m",
    FG_BLUE: "\x1b[34m",

};
const colorize = (num, color) => {
    return `${color}${num}${COLOR_SET.RESET}`;
};

const quoteFromYahoo = cb => {
    const endpoint = config.yahoo_api.endpoint;
    const symbols = Object.values(watch_list).reduce((acc, curr) => acc.concat(curr));
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
    const ALIGN_RIGHT_INDEXES = [2, 3, 4, 5];
    const SYMBOL_INDEX = 0;
    const HEADER_ROW_INDEX = 0;
    let category = "";
    const TABLE_CELL_WIDTH = 10;
    const TABLE_WIDTH = TABLE_CELL_WIDTH * table[HEADER_ROW_INDEX].length;
    table.forEach((item, index) => {
        // print category name
        if (index > HEADER_ROW_INDEX) {
            for (let cat in watch_list) {
                if (watch_list[cat].indexOf(item[SYMBOL_INDEX]) >= 0) {
                    if (category !== cat) {
                        category = cat;
                        const repeat_times = (TABLE_WIDTH - category.length) / 2;
                        console.log('-'.repeat(Math.floor(repeat_times)) + colorize(category, COLOR_SET.FG_BLUE) + '-'.repeat(Math.ceil(repeat_times)));
                    }
                    break;
                }
            }
        }
        // print 1 row of data
        console.log(`${item.map((x, i) => {
            var str = i === CHANGE_PERCENT_INDEX && index > HEADER_ROW_INDEX ? `(${x}%)` : x.toString();
            var spaces = ' '.repeat(Math.max(TABLE_CELL_WIDTH - str.length, 0));
            var text = "";
            if (i === STATE_INDEX && index > 0) {
                text = x.toUpperCase() === 'REGULAR' ? colorize(str, COLOR_SET.FG_GREEN) : colorize(str, COLOR_SET.FG_YELLOW);
            } else {
                text = COLORIZED_NUM_INDEXES.indexOf(i) >= 0 && index > HEADER_ROW_INDEX ? colorize(str, x >= 0 ? COLOR_SET.FG_GREEN : COLOR_SET.FG_RED) : str;
            }
            if (ALIGN_RIGHT_INDEXES.indexOf(i) >= 0) {
                // align right
                return spaces + text;
            } else {
                // align left
                return text + spaces;
            }
        }).join('')}`);
    });
    // print table bottom border
    console.log('-'.repeat(TABLE_WIDTH));

    // should refresh time
    console.log(`\nRefreshed at: ${new Date()}`);
    console.log(`Sync Setting: Only Sync between ${config.sync_period.start_at} and ${config.sync_period.end_at}`);
};

const shouldSync = () => {
    let start_at = config.sync_period.start_at.split(':');
    let end_at = config.sync_period.end_at.split(':');
    let start_time = new Date().setHours(~~start_at[0], ~~start_at[1]);
    let end_time = new Date().setHours(~~end_at[0], ~~end_at[1]);
    let now = new Date();
    return now > start_time && now < end_time;
};

// start the monitor
setInterval(function callMe() {
    if (shouldSync()) {
        quoteFromYahoo(printTable);
    }
    return callMe;
}(), config.refresh_frequency);
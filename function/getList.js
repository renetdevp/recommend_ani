const request = require('request');
const cheerio = require('cheerio');

const url = 'http://www.kyotoanimation.co.jp/works/';

request(url, (err, res, body) => {
    if (err) {
        console.log(err);
    }
    const $ = cheerio.load(body);

    const mainContent = $('.mainContent');
    const aniList = [];

    mainContent.children('dl').each((i, elem) => {
        aniList.push($(elem).children('dd').children('a').text());
    });
    module.exports.list = aniList;
});

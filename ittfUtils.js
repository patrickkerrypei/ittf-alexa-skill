'use strict';

const superagent = require('superagent');
const cheerio = require('cheerio');

/**
 * Gets the player name of specified rank and gender
 * @param ranking - {Number} (Guaranteed by caller: 1 <= ranking <= 840)
 * @param gender - 'M' / 'W'
 * @returns {Promise|String}
 */

function getPlayer(ranking, gender) {
    const baseUrl = 'http://old.ittf.com/ittf_ranking/';
    const ageCategories = 'Age_category_1=&Age_category_2=&Age_category_3=&Age_category_4=&Age_category_5=&';
    const lookupDate = 'Month1=1&Year1=2017';
    const pageNum = Math.floor(ranking / 150) + 1;
    ranking = ranking % 150;
    const rankingUrl = `${baseUrl}WR_Table_3_A2.asp?${ageCategories}Category=100${gender}&${lookupDate}&Formv_WR_Table_3_Page=${pageNum}`;

    return new Promise((resolve, reject) => {
        return superagent
            .get(rankingUrl)
            .end((err, res) => {
                if (err || !res.ok) {
                    console.error('Error: ', err.message);
                    reject(err);
                }

                const $ = cheerio.load(res.text);
                let tableEntries = $("td[colspan='2']");

                // 12 first entries are ITTF's table setup
                tableEntries = tableEntries.slice(12);
                // TODO: searching sibling nodes for reported rank in case of ties
                const name = $(tableEntries[ranking - 1]).children().text().trim();

                resolve(name);
            });
    });
}

module.exports.getPlayer = getPlayer;
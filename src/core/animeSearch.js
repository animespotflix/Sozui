const winston = require("winston");

const anilist = require("./anilist");
const kitsu = require("./kitsu");
const Anime = require("./../models/Anime");

/**
 * @param {String} query Anime title
 */
async function search(query) {
  winston.debug(`Searching for '${query}'`);

  const a = await anilist.searchAnime(query);
  if (!a) {
    winston.debug(`Unable to find '${query}' on Anilist`);
    return null;
  }
  winston.debug(`Found '${query}' on Anilist`);

  const kt = await kitsu.searchAnime(a.title.userPreferred);
  if (kt) {
    winston.debug(`Found '${query}' on Kitsu`);
  } else {
    winston.debug(`Unable to find '${query}' on Kitsu`);
  }

  const anime = new Anime(
    a.title.userPreferred,
    a.coverImage.medium,
    a.description,
    a.genres,
    a.meanScore,
    a.siteUrl,
    a.idMal,
    kt,
    a.status,
    `${a.startDate.day}-${a.startDate.month}-${a.startDate.year}`,
    `${a.endDate.day}-${a.endDate.month}-${a.endDate.year}`,
    a.episodes,
    a.duration,
    a.isAdult
  );

  return anime;
}

module.exports = search;
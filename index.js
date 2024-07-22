const config = require("./config.json");
let fromDate = "2024-07-01";
let toDate = "2024-07-04";
let dryRun = false;

const me = { name: "Fada", tag: "001" };
const peti = { name: "JustAlive", tag: "EUNE" };
const ezi = { name: "ezi1", tag: "EUNE" };

let headers = {
  "X-Riot-Token": config["Riot-API-key"],
};

main();

async function main() {
  await getStats(peti);
  console.log("");
  await getStats(me);
  console.log("");
  await getStats(ezi);
}

async function getStats(user) {
  const userMatches = await getMatches(await getGames(await getUser(user)));
  const userSwarmMatches = userMatches.filter(
    (m) => m.info.gameMode == "STRAWBERRY"
  );
  console.log("Player: ", user.name + "#" + user.tag);
  console.log("Swarm matches played: ", userSwarmMatches.length);
  console.log(
    "Swarm matches won: ",
    userSwarmMatches.filter((m) => m.info.teams[0].win).length
  );
}

async function getUser(user) {
  const response = await fetch(
    "https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/" +
      user.name +
      "/" +
      user.tag,
    { headers: headers }
  );
  return await response.json();
}

async function getGames(riotUser) {
  const response = await fetch(
    "https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/" +
      riotUser.puuid +
      "/ids?startTime=1721136556&start=0&count=100",
    { headers: headers }
  );

  return await response.json();
}

async function getMatch(matchId) {
  const response = await fetch(
    "https://europe.api.riotgames.com/lol/match/v5/matches/" + matchId,
    { headers: headers }
  );

  return await response.json();
}

async function getMatches(matchIds) {
  let rArr = [];
  for (let i = 0; i < matchIds.length; i += 20) {
    rArr = rArr.concat(await getMatchesWithWait(matchIds.slice(i, i + 20)));
  }
  return rArr;
}

async function getMatchesWithWait(matchIds) {
  await new Promise((resolve) => setTimeout(resolve, 1000)); //api restriction
  let rArr = [];
  for (let i = 0; i < matchIds.length; i++) {
    const element = await getMatch(matchIds[i]);
    rArr.push(element);
  }
  return rArr;
}

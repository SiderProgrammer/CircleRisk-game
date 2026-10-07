# Circle Risk

https://circle-risk.web.app/

https://m.apkpure.com/pl/circle-risk-challenge-your-reflex/com.pip.circlerisk

Circle Risk is a one-tap reflex game for Android and the web. Two circles are joined by a stick: one is the pivot and the other spins around it. Tap when the spinning circle is over the next target to make it the new pivot. If you miss, you lose.

The project has two versions:

|            | **v1: the original game**                                                    | **v2: multiplayer**                              |
| ---------- | ---------------------------------------------------------------------------- | ------------------------------------------------ |
| Written by | me (assets by my brother)                                                    | AI, built on top of v1                           |
| Modes      | single player: levels, skins, leaderboard                                    | everything from v1 plus real-time **1 vs 1**     |
| Backend    | Express + MongoDB, hosted on Heroku                                          | the same server plus Socket.IO, hosted on Render |
| Code       | [`d9274c2`](https://github.com/SiderProgrammer/CircleRisk-game/tree/d9274c2) | this branch                                      |

---

## v1: the original game (no multiplayer)

- Campaign levels in easy, medium and hard groups, plus mystery levels
- Unlockable skins for targets, circles and backgrounds
- Accounts, stats and leaderboards stored in MongoDB
- AdMob integration
- Assets made by my brother

Technology stack:

- Phaser 3 (client, packaged with Cordova)
- Express.js
- MongoDB (with Mongoose)
- Server hosted on Heroku

A note on v1's code quality: the folders should be structured differently and some files should have different names. There's a lot of spaghetti code, code repetition and badly named functions, and many features could be implemented more simply, briefly and cleanly.

---

## v2: multiplayer (written by AI)

v2 adds real-time 1 vs 1 matches to the original game. All of the multiplayer code, client and server, was written by AI. v1's single-player game is still there unchanged.

**Features**

- **Quick Match**: get paired with a random opponent from the queue
- **Private rooms**: create a room and share its 4-letter code, or join one by code
- **Room configurator**: the room creator sets the number of targets, starting speed, speed-up, maximum speed, target size, spin direction, maximum jump, score to win and arena
- **Ghost opponent**: you see your opponent's circle as a translucent ghost on your board
- **Results and rematch**: first to the winning score wins, then both players can request a rematch
- Better layout on different screen sizes, plus bug fixes

**How it works**

- **The server decides.** It runs each match and has the final say on every hit, death and win (`server/src/multiplayer/match.js`).
- **Client-side prediction.** The client checks each tap immediately so it feels instant, and corrects itself when the server's verdict arrives (`client/src/main/multiplayer/local-player.js`).
- **Shared rules.** The client and the server use the same game rules and room settings code (`server/src/shared/`), so their results always match.
- **Clock sync and input checks.** The client keeps its clock in sync with the server's, and the server checks every incoming message so a bad one can't crash it.
- **Tests.** Node's built-in test runner covers the rules, the room settings and full matches over Socket.IO (`server/test/`).

**Stack additions:** Socket.IO, Render (server, see `render.yaml`), Firebase Hosting (web client).

---

## Running locally

Server (in memory, no MongoDB needed):

```bash
npm --prefix server install
```

```bash
npm --prefix server run dev:nodb
```

The server listens on port 3001. Use `npm --prefix server run dev` with a `DB_URL` environment variable to use MongoDB instead.

Client:

```bash
npm --prefix client install
```

```bash
npm --prefix client start
```

To play against your local server, set `SERVER_URL` in `client/src/config.js` to `http://localhost:3001`. To try multiplayer, open the game in two browser tabs.

Server tests:

```bash
npm --prefix server test
```

## Deployment

- **Server:** on Render, create a Blueprint from this repository (`render.yaml`) and enter `DB_URL` in the Render dashboard. Run only one instance, because rooms and matches are kept in memory.
- **Web client:** `npm --prefix client run deploy:web` builds the client and deploys it to Firebase Hosting.

Sensitive config files (database credentials) are not in the repository.

# Wooper

Real-time 1v1 Pokémon battle simulator. Build a team out of any of the 1000+
Pokémon, pick 4 moves for each, then fight another player (or a bot if nobody
is online) until someone runs out of Pokémon.

Play it here: https://wooper-demo.vercel.app

<!-- gravar um gif de batalha (ScreenToGif) -> docs/demo.gif e descomentar -->
<!-- ![battle demo](docs/demo.gif) -->

## How it works

The whole battle state lives on the server (`server/`). The client only sends
intents like `{type: 'move', index: 2}` and renders whatever comes back, so
there's no way to cheat by messing with the frontend. The battle engine itself
(`server/src/engine.js`) is pure functions with an injectable RNG, which makes
it easy to unit test (`npm test` runs the Jest suite).

Everything else worth knowing:

- No database. Matches live in memory, nobody creates an account.
- The full Pokédex (base stats, types, learnable damaging moves) is a static
  JSON generated once from [PokéAPI](https://pokeapi.co) by
  `server/scripts/fetch-pokedex.js`. The game never calls external APIs at
  runtime.
- Teams are validated server-side: every Pokémon has to exist and actually
  learn the moves you picked for it.
- Turn timeout: if you don't act in 30s the server picks a random legal move.
- Disconnected? You have 30s to come back before your opponent wins.
- The bot plays a random team and always goes for the highest expected damage
  (power x accuracy x effectiveness x STAB).
- Each player only ever receives the opponent's active Pokémon and how many
  are left alive. The rest of the enemy team never leaves the server.

Sound effects are synthesized with the Web Audio API, cries come from PokéAPI,
and battle music plays through a hidden YouTube embed (there's a mute button).

## Running locally

```bash
npm run install:all   # installs server/ and client/
npm run server        # server on http://localhost:3001
npm run client        # frontend on http://localhost:3000 (separate terminal)
```

Open two tabs on `localhost:3000` to play against yourself (player tokens are
per-tab), or just hit "Jogar contra o Bot".

## Deploy

Vercel doesn't hold persistent WebSocket connections, so the server lives
somewhere else:

- client: Vercel, root `client/`, build `npm run build`, output `dist/`,
  set `VITE_SERVER_URL` to the server's public URL
- server: Railway/Fly.io, root `server/`, start `npm start`,
  set `CLIENT_ORIGIN` to the frontend URL (CORS)

## Credits

Fan project, not affiliated with Nintendo, Game Freak or The Pokémon Company.
Pokémon data and sprites from [PokéAPI](https://pokeapi.co).

---

<div align='center'><img src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/194.png' align='center'></img></div>
<div align='center'><i>wooper</i></div>

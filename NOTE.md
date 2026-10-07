# NOTE

- [ ] `--no-session-operators`

近期尚未完成、值得後續追蹤的事項。

## Pi `bash` 應沿用 Terminal MCP 的 configured shell

- `--pi-operators` 的 `bash` 目前在 `src/tools/operators.ts` 寫死 `shell: "/bin/sh"`。
- 應改為沿用 Terminal MCP 原本的 shell selection：`--shell` → `TERMINAL_MCP_SHELL` → `$SHELL` / `COMSPEC` → platform fallback。
- 目前做法也可能造成 Windows portability 問題。
- 修正後同步更新 README、`skills/terminal-mcp/SKILL.md`、MCP server instructions 與 tool description，不再宣稱固定使用 `/bin/sh`。
- 補上 configured-shell 與跨平台行為的測試。

## 追查 `npm_config_allow_scripts` 的來源

- `npx -y louisje/terminal-mcp` 曾遇到 `EALLOWSCRIPTS`；已確認 repo 本身與 `node-pty` 不是根因。
- 問題來自 shell session 殘留的 `npm_config_allow_scripts` / `npm_config_allow_git` 環境變數；清除後官方 `node-pty` 可正常安裝與啟動。
- 已檢查常見 shell/npm 設定檔但未找到來源，之後可追查是哪個父進程或 launcher 動態注入。

## `.claude-plugin` 安裝與 `node-pty` native dependency

- `node-pty` 是 native module，無法直接被 esbuild bundle。
- `.claude-plugin` 若只是 git clone、不執行 `npm install`，目標機器沒有可用的 `node-pty` 時仍可能啟動失敗。
- 待評估是否 vendor prebuilt binary，或採用其他能可靠部署 native dependency 的方式。

## build 文件同步

- `install.sh` 與 README 尚需確認是否完整反映目前 build 流程：`tsc --emitDeclarationOnly && node scripts/build.mjs`。

## 測試參數與 `client.test.ts`

- 曾執行 `npm test -- test/platform.test.ts` 時仍跑全套測試，且 `client.test.ts` 出現 `Cannot find module ../package.json`（由 `src/utils/version.ts` require）。
- `node --test --import tsx test/platform.test.ts` 單跑可通過。
- 待確認 npm test 的參數轉發行為，以及 `client.test.ts` / version 測試環境是否仍有問題。

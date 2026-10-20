# NOTE

- [ ] `--no-session-operators`

近期尚未完成、值得後續追蹤的事項。

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

## `feat/codemode` 合併前待辦（2026-10-20）

**合併門檻：全部 P0、P1 完成且驗收通過；P2 可暫緩。**

進度：已完成 CI 失敗初步診斷（缺少 rg/fd），並為 CI 安裝依賴；Headless 與 Socket Codemode → bash 的 AbortSignal 已接線，Socket 取消後不會執行延遲副作用的整合測試已通過。仍須驗證逾時、PTY/其他工具的取消語義（已產生的副作用不可回滾），故 P0 仍未完成。

- [ ] **P0：取消與逾時安全性**：驗證 QuickJS 執行逾時、AbortSignal 與 MCP Client 中斷時，執行中的 `bash`、PTY 操作及其他非同步工具是否會停止或繼續執行；釐清工具副作用不可回滾的情況，必要時補上取消訊號傳遞、子行程清理和迴歸測試。
- [ ] **P0：跨平台 CI**（`6df5ab0` 已完成成功；較新提交仍須驗證）：查驗 `feat/codemode` GitHub Actions 的實際結果（Node.js 22/24；Linux/macOS/Windows 建置及 Linux/macOS 測試），特別確認 Windows 的 QuickJS Worker、WASM 路徑與打包相容性，修正失敗項目。
- [ ] **P1：工具探索一致性**：補齊 `searchTools()`、`describeTool()`、`describeNamespace()` 的權限、參數驗證及邊界測試；確保只可發現當前已啟用的 tools，且 `terminal` namespace / MCP Instructions 保持一致。
- [ ] **P1：Claude Plugin 啟動效能**：追查 `bootstrap.cjs` 整合測試耗時不穩（曾達 30～50 秒）的原因，區分依賴檢查、選用 resvg 補裝及測試資源競爭；改善測試穩定性，避免不必要的網路安裝。
- [ ] **P1：文件與 Skills**（README／SKILL.md 已補 Codemode；尚待內容及各入口最終核對）：補齊 README、使用者文件及 AI-facing Skills 的 `--codemode` 範例、工具探索、輸出過濾、PTY/session 使用規則，以及 Node.js >=22.19 的需求；核對 Headless、Socket、Claude Plugin 三種入口。
- [ ] **收尾**：P0 與 P1 全部完成且驗證通過後，才評估將 `feat/codemode` 合併至 `main`；目前不合併。
- [ ] **P2（視需求）**：若工具數量/namespace 增加，再考慮將 `searchTools()` 的簡單字串比對升級為 BM25，以及新增更細的 namespace 分組；目前不列為合併阻擋項。

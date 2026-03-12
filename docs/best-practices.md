# Terminal MCP Best Practices

## 🎯 Quick Guide for Efficient Usage

### ⭐ Use `autoSubmit` for Command Execution

**RECOMMENDED:** Execute commands in a single call with `autoSubmit: true`

```typescript
// ✅ Good: One call, instant result
type({ text: "uptime", autoSubmit: true })

// ❌ Avoid: Multiple calls for simple commands
type({ text: "uptime" })
sendKey({ key: "Enter" })
wait({ seconds: 2 })  // Unnecessary!
getContent()
```

### ⚡ Minimize Wait Time

Most commands complete **instantly** - don't wait unnecessarily!

```typescript
// ✅ Good: No wait needed for fast commands
type({ text: "pwd", autoSubmit: true })
type({ text: "ls -la", autoSubmit: true })
type({ text: "uptime", autoSubmit: true })

// ❌ Bad: Wasting time on fast commands
type({ text: "pwd", autoSubmit: true })
wait({ seconds: 2 })  // Why wait for pwd?
```

### 📊 When to Use Each Tool

| Tool | Best Use Case | Avoid |
|------|---------------|-------|
| `type(cmd, autoSubmit=true)` | Execute any command | Adding unnecessary `wait()` after |
| `type(text)` + `sendKey()` | Interactive input, multi-step | Simple one-off commands |
| `wait(N)` | Long builds, downloads | After every command |
| `getContent()` | Manual content check | After `autoSubmit=true` (already returns content) |

### ✅ When to Use `wait()`

**Use `wait()` for:**
- 🔨 Build processes: `npm run build`, `make`, `cargo build`
- 📦 Package installations: `npm install`, `pip install`, `brew install`
- 🌐 Downloads: `curl`, `wget`, long file transfers
- ⏳ Background tasks that need time to complete
- 🤔 Interactive prompts that appear after a delay

**DON'T use `wait()` for:**
- ❌ Fast commands: `ls`, `pwd`, `cd`, `echo`, `cat`, `uptime`
- ❌ After `type(cmd, autoSubmit=true)` - it already waits 100ms
- ❌ "Just in case" - this wastes time

### 🚀 Example: Efficient Workflow

```typescript
// ✅ Efficient: 3 commands, ~300ms total
type({ text: "pwd", autoSubmit: true })
type({ text: "ls -la", autoSubmit: true })
type({ text: "uptime", autoSubmit: true })

// ❌ Inefficient: 3 commands + 6 seconds of waiting
type({ text: "pwd", autoSubmit: true })
wait({ seconds: 2 })  // Wasted 2 seconds
type({ text: "ls -la", autoSubmit: true })
wait({ seconds: 2 })  // Wasted 2 seconds
type({ text: "uptime", autoSubmit: true })
wait({ seconds: 2 })  // Wasted 2 seconds
```

### 💡 Special Cases

**Interactive Input (e.g., password prompts):**
```typescript
// Don't use autoSubmit for interactive prompts
type({ text: "sudo something" })
sendKey({ key: "Enter" })
wait({ seconds: 1 })  // Wait for prompt to appear
type({ text: "password" })
sendKey({ key: "Enter" })
```

**Long-running Process:**
```typescript
// Use autoSubmit, then wait appropriately
type({ text: "npm install", autoSubmit: true })
wait({ seconds: 30 })  // Justified - installation takes time

type({ text: "npm run build", autoSubmit: true })
wait({ seconds: 10 })  // Justified - build takes time
```

**Multi-line Input:**
```typescript
// Type multiple lines without executing
type({ text: "cat > file.txt" })
sendKey({ key: "Enter" })
type({ text: "Line 1" })
sendKey({ key: "Enter" })
type({ text: "Line 2" })
sendKey({ key: "Enter" })
sendKey({ key: "Ctrl+D" })  // EOF
```

## 📈 Performance Impact

Using `autoSubmit` and avoiding unnecessary `wait()` can dramatically improve efficiency:

| Approach | Time | Tool Calls |
|----------|------|------------|
| With `autoSubmit`, no unnecessary waits | ~100ms | 1 |
| Without `autoSubmit`, with waits | ~2-5s | 3-4 |

**Speed improvement: 20-50x faster!** ⚡

## 🎓 Summary

1. **Default to `autoSubmit: true`** for command execution
2. **Only use `wait()` when commands actually need time**
3. **Don't wait after `autoSubmit`** - it already includes a wait
4. **Save time by avoiding unnecessary tool calls**

Happy terminal automation! 🚀

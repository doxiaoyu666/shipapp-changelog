# @shipapp/changelog

[English](#english) | [中文](#中文)

---

<a id="english"></a>

Generate multilingual "What's New" text from git commits for App Store releases.

Part of the [ShipApp](https://github.com/doxiaoyu666) toolkit for indie iOS developers.

## Why?

Every release, you need to write "What's New" text — in multiple languages. Usually you:

1. Look through git log to remember what changed
2. Write user-friendly release notes (not raw commit messages)
3. Translate to 8+ languages
4. Copy-paste into App Store Connect

**@shipapp/changelog** automates steps 1-2, and integrates with [@shipapp/metadata](https://github.com/doxiaoyu666/shipapp-metadata) for step 3-4.

## How It Works

This tool reads the **git commit history of your own app project** (e.g., your iOS app repo) and automatically generates user-friendly "What's New" release notes. You don't need to write anything manually — your commit messages are the input.

```
Your App Repo (git commits)  →  AI rewrites  →  Multilingual What's New  →  App Store Connect
```

**Prerequisites:**
- Your app project must be a git repository
- Write meaningful commit messages (they become the raw material for release notes)
- Works with both [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`) and regular commit messages

## Quick Start

### Step 1: Install the tool

```bash
git clone https://github.com/doxiaoyu666/shipapp-changelog.git
cd shipapp-changelog
npm install && npm run build
```

### Step 2: Use it in your app project

#### Option A: Claude Code (Recommended)

```bash
# Go to YOUR APP's project directory (not this tool's directory)
cd ~/git/my-ios-app

# Run the skill
/changelog MyApp
```

The skill reads **your app's git history**, generates user-friendly What's New in 8 languages, and optionally uploads to App Store Connect.

#### Option B: CLI

```bash
# Point --cwd to YOUR APP's git repository
shipapp-changelog log --cwd ~/git/my-ios-app

# Generate What's New JSON from your app's commits
shipapp-changelog generate --cwd ~/git/my-ios-app --output ./whats_new

# Then push to App Store Connect
shipapp-metadata push --app "MyApp" --dir ./whats_new --only whats_new
```

## Commands

### `log`

Show git commit history grouped by type (features, fixes, improvements).

```bash
shipapp-changelog log [--since <tag|commit>] [--cwd <path>] [--format <pretty|json>]
```

- `--since` — Start from this git ref (default: latest tag)
- `--cwd` — Path to git repository (default: current directory)
- `--format` — Output format: `pretty` (default) or `json`

Non-user-facing commits (chore, ci, test, docs) are hidden by default.

### `generate`

Generate What's New text from git commits and write to JSON file.

```bash
shipapp-changelog generate [--since <tag|commit>] [--cwd <path>] [--output <dir>]
```

- `--since` — Start from this git ref (default: latest tag)
- `--cwd` — Path to git repository (default: current directory)
- `--output` — Output directory (default: `./whats_new`)

Outputs `en-US.json` with a `whats_new` field compatible with @shipapp/metadata.

## Commit Convention

This tool works best with [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add dark mode support
fix: resolve crash when opening settings
perf: optimize image loading speed
refactor: simplify animation logic
chore: bump dependencies          ← hidden (not user-facing)
test: add unit tests              ← hidden
docs: update README               ← hidden
ci: fix build pipeline            ← hidden
```

Non-conventional commits are categorized as "other".

## Integration with @shipapp/metadata

The output JSON format is compatible with @shipapp/metadata's `push --only whats_new` command:

```bash
# Generate → Push workflow
shipapp-changelog generate --cwd ~/git/my-app --output ./whats_new
shipapp-metadata push --app "MyApp" --dir ./whats_new --only whats_new
```

Or use the Claude Code skill `/changelog MyApp` to do everything in one step.

## License

MIT

---

<a id="中文"></a>

# @shipapp/changelog

从 git commits 生成多语言「新功能」文案，用于 App Store 发版。

[ShipApp](https://github.com/doxiaoyu666) 独立开发者工具箱的一部分。

## 为什么需要？

每次发版都要写「新功能」——还要翻译成多种语言。通常你要：

1. 翻 git log 回忆改了什么
2. 把 commit 信息改写成用户友好的文案
3. 翻译成 8+ 种语言
4. 复制粘贴到 App Store Connect

**@shipapp/changelog** 自动化步骤 1-2，并与 [@shipapp/metadata](https://github.com/doxiaoyu666/shipapp-metadata) 集成完成步骤 3-4。

## 工作原理

这个工具读取**你自己的 App 项目的 git commit 历史**（比如你的 iOS 项目仓库），自动生成用户友好的「新功能」文案。你不需要手动写任何内容——你的 commit message 就是输入。

```
你的 App 仓库（git commits）→ AI 改写 → 多语言「新功能」→ App Store Connect
```

**前提条件：**
- 你的 App 项目必须是一个 git 仓库
- commit message 要有意义（它们是生成文案的原材料）
- 支持 [Conventional Commits](https://www.conventionalcommits.org/)（`feat:`、`fix:`）和普通 commit message

## 快速开始

### 第一步：安装工具

```bash
git clone https://github.com/doxiaoyu666/shipapp-changelog.git
cd shipapp-changelog
npm install && npm run build
```

### 第二步：在你的 App 项目中使用

#### 方式一：Claude Code（推荐）

```bash
# 进入你自己的 App 项目目录（不是这个工具的目录）
cd ~/git/my-ios-app

# 运行 skill
/changelog 我的App
```

Skill 读取**你的 App 的 git 历史**，生成 8 种语言的用户友好「新功能」，确认后上传到 App Store Connect。

#### 方式二：CLI

```bash
# --cwd 指向你自己的 App 的 git 仓库
shipapp-changelog log --cwd ~/git/my-ios-app

# 从你的 App 的 commit 历史生成 What's New
shipapp-changelog generate --cwd ~/git/my-ios-app --output ./whats_new

# 推送到 App Store Connect
shipapp-metadata push --app "我的App" --dir ./whats_new --only whats_new
```

## 命令

### `log` — 查看 commit 历史

```bash
shipapp-changelog log [--since <tag|commit>] [--cwd <路径>] [--format <pretty|json>]
```

按类型分组展示（新功能、修复、改进）。非用户可见的 commit（chore/ci/test/docs）自动隐藏。

### `generate` — 生成 What's New

```bash
shipapp-changelog generate [--since <tag|commit>] [--cwd <路径>] [--output <目录>]
```

输出 `en-US.json`，格式与 @shipapp/metadata 兼容。

## Commit 规范

使用 [Conventional Commits](https://www.conventionalcommits.org/) 效果最佳：

```
feat: 添加深色模式          ← 展示给用户
fix: 修复设置页闪退         ← 展示给用户
chore: 升级依赖             ← 自动隐藏
test: 添加单元测试          ← 自动隐藏
```

## 与 @shipapp/metadata 集成

```bash
# 生成 → 推送
shipapp-changelog generate --cwd ~/git/my-app --output ./whats_new
shipapp-metadata push --app "我的App" --dir ./whats_new --only whats_new
```

或用 Claude Code skill `/changelog 我的App` 一步完成。

## 开源协议

MIT

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

## Quick Start

### Option A: Claude Code (Recommended)

```bash
git clone https://github.com/doxiaoyu666/shipapp-changelog.git
cd shipapp-changelog
npm install && npm run build

# In Claude Code, from your app's project directory:
/changelog MyApp
```

The skill reads your git history, generates user-friendly What's New in 8 languages, and optionally uploads to App Store Connect.

### Option B: CLI

```bash
git clone https://github.com/doxiaoyu666/shipapp-changelog.git
cd shipapp-changelog
npm install && npm run build

# View commit history grouped by type
shipapp-changelog log --cwd ~/git/my-app

# Generate What's New JSON
shipapp-changelog generate --cwd ~/git/my-app --output ./whats_new

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

## 快速开始

### 方式一：Claude Code（推荐）

```bash
git clone https://github.com/doxiaoyu666/shipapp-changelog.git
cd shipapp-changelog
npm install && npm run build

# 在 Claude Code 中，在你的 app 项目目录下：
/changelog 我的App
```

Skill 读取 git 历史，生成 8 种语言的用户友好「新功能」，确认后上传到 App Store Connect。

### 方式二：CLI

```bash
git clone https://github.com/doxiaoyu666/shipapp-changelog.git
cd shipapp-changelog
npm install && npm run build

# 查看按类型分组的 commit 历史
shipapp-changelog log --cwd ~/git/my-app

# 生成 What's New JSON
shipapp-changelog generate --cwd ~/git/my-app --output ./whats_new

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

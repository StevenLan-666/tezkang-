# 特质康+ Vercel 部署指南

## 前置条件

- GitHub 仓库：`StevenLan-666/tezkang-`
- Supabase 项目已创建并初始化数据库
- Vercel 账号已注册

---

## 部署步骤

### 1. 导入项目

1. 访问 [vercel.com/new](https://vercel.com/new)
2. 选择 **Import Git Repository** → 选择 `StevenLan-666/tezkang-`
3. 确认以下配置：

| 配置项 | 值 |
|-------|---|
| **Project Name** | `tezkang`（或自定义） |
| **Framework Preset** | `Vite`（自动检测） |
| **Root Directory** | `./` |
| **Build Command** | `npm run build`（默认） |
| **Output Directory** | `dist`（默认） |

### 2. 配置环境变量（⚠️ 关键步骤）

> [!CAUTION]
> 不配置环境变量会导致页面显示 **"Supabase 未配置，请检查 .env 文件"**

展开 **Environment Variables** 区域，添加以下两个变量：

| KEY | VALUE |
|-----|-------|
| `VITE_SUPABASE_URL` | `https://folwxlxuiltihtkdxduj.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `sb_publishable_3DxZ-qJoxd02jrQNFzoUdw_am1Tmkw8` |

勾选适用环境：**Production** ✅ / **Preview** ✅ / **Development** ✅

### 3. 点击 Deploy

等待构建完成（约 1-2 分钟），成功后会自动分配域名如 `tezkang.vercel.app`。

---

## 部署后验证

1. 访问分配的 URL，确认登录页正常显示（无红色 Supabase 错误）
2. 使用测试账号登录：`testuser01` / `Test123456`
3. 检查各模块数据是否正常加载

---

## 常见问题

### Q: 部署成功但显示 "Supabase 未配置"
**A:** 环境变量未配置或名称写错。进入 **Settings → Environment Variables** 检查。修改后需 **Redeploy** 才生效。

### Q: 构建失败 (Build Error)
**A:** 检查 Build Log，常见原因：
- TypeScript 类型错误：在 `vite.config.ts` 中确认 `build.target` 正确
- 依赖缺失：确认 `package.json` 中的依赖完整

### Q: 登录后数据为空
**A:** 确认 Supabase 数据库中已执行以下 SQL 脚本：
1. `supabase-schema.sql` — 表结构
2. `supabase-data-link.sql` — 测试用户和活动数据
3. `supabase-history-seed.sql` — 历史记录种子数据

### Q: 更新代码后如何重新部署
**A:** 推送到 GitHub `main` 分支后 Vercel 会**自动部署**，无需手动操作。

---

## 项目技术栈

| 技术 | 用途 |
|-----|------|
| React 18 + TypeScript | 前端框架 |
| Vite | 构建工具 |
| Tailwind CSS | 样式系统 |
| Supabase | 后端服务（数据库 + 认证） |
| Vercel | 部署平台 |

# 部署指南

本项目是纯前端静态站点，通过 **GitHub Actions 自动构建 + rsync 推送到服务器 nginx**，实现数据更新后全自动部署。

## 架构

```
GitHub (push / 定时)
   │
   ├─ workflow: Fetch Prompts   每天 09:00 拉取新提示词 → commit 回仓库
   │       │ (数据有变化时)
   │       ▼
   └─ workflow: Deploy           自动触发 → npm run build → rsync 推送 dist/ 到服务器
           │
           ▼
   你的服务器 nginx
```

**无需服务器主动拉取**，数据更新 → 自动构建 → 自动部署，全程在 GitHub 端完成。

## 一、配置 GitHub Secrets

在仓库 **Settings → Secrets and variables → Actions → New repository secret** 添加以下 5 个：

| Secret 名 | 值 | 示例 |
|-----------|-----|------|
| `DEPLOY_HOST` | 服务器 IP 或域名 | `1.2.3.4` 或 `your-server.com` |
| `DEPLOY_USER` | SSH 登录用户 | `root` |
| `DEPLOY_PATH` | nginx 站点目录（绝对路径） | `/home/your-site` |
| `DEPLOY_SSH_KEY` | SSH 私钥（**完整内容，含 BEGIN/END 行**） | 见下方生成方法 |
| `DEPLOY_PORT` | SSH 端口（可选，默认 22） | `22` |

## 二、生成 SSH 密钥（推荐用专用 deploy key）

**在本地或服务器上生成一对专用密钥**（不要用你个人的日常密钥）：

```bash
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/deploy_imagehub -N ""
```

生成两个文件：
- `~/.ssh/deploy_imagehub` —— **私钥**，内容粘贴到 GitHub Secret `DEPLOY_SSH_KEY`
- `~/.ssh/deploy_imagehub.pub` —— **公钥**，追加到服务器的 `~/.ssh/authorized_keys`

### 把公钥加入服务器

```bash
# 在服务器上（root 用户）
cat >> ~/.ssh/authorized_keys << 'EOF'
（粘贴 deploy_imagehub.pub 的完整内容）
EOF
chmod 600 ~/.ssh/authorized_keys
```

#### 🔒 开源仓库必读：限制 deploy key 权限

如果仓库是**开源**的，强烈建议给公钥加 `command=` 前缀，**强制该密钥只能执行 rsync 到指定目录**。这样即使密钥意外泄露，攻击者也无法用它在服务器上执行任意命令。

编辑 `~/.ssh/authorized_keys`，把那行公钥改成（单行，`command=` 和公钥之间无换行）：

```
command="rsync --server -vlogDtprze.iLsfxC --delete . /www/wwwroot/your-site/",no-pty,no-agent-forwarding,no-port-forwarding,no-X11-forwarding ssh-ed25519 AAAA...你的公钥内容... github-actions-deploy
```

- `command="..."` —— 强制连接时只能跑这个 rsync 命令（路径写死你的站点目录）
- `no-pty` 等 —— 禁止交互式 shell、端口转发等
- 效果：这个密钥**唯一的用途**就是接收 `dist/` 推送到该目录，别的什么都做不了

> 配置后用 `ssh -i ~/.ssh/deploy_imagehub root@服务器 'whoami'` 测试，应该被拒绝（返回 rsync 报错而非命令输出），说明限制生效。

### 验证连接

```bash
# 本地用私钥测试能否免密登录
ssh -i ~/.ssh/deploy_imagehub root@你的服务器IP
```

能直接登录说明配置成功。

## 三、nginx 配置

确保站点目录存在且 nginx 指向它。以宝塔面板/标准 nginx 为例：

```nginx
server {
    listen 80;
    server_name your-server.com;
    root /www/wwwroot/your-site;
    index index.html;

    # SPA 路由回退（/prompts、/prompt/:id 等前端路由需要）
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源缓存
    location /assets/ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

> ⚠️ **`try_files` 必须配置**，否则访问 `/prompts` 等前端路由刷新会 404。

## 四、首次手动部署

1. 推送代码到 GitHub（含 `.github/workflows/` 目录）
2. 到仓库 **Actions → Deploy → Run workflow** 手动触发一次
3. 查看运行日志，确认 `rsync` 步骤成功
4. 访问你的站点域名验证

## 五、日常运行

配置完成后**全自动**：

- **每天 09:00**：Fetch Prompts 自动拉取新提示词并 commit
- **Fetch 成功后**：Deploy 自动触发，构建并推送最新产物
- **无新数据时**：Deploy 不触发（Fetch workflow 检测到无变化会跳过 commit，workflow_run 仍会触发 Deploy，但产物相同，rsync `--delete` 会保持一致）

### 手动操作

| 需求 | 操作 |
|------|------|
| 立即重新部署当前代码 | Actions → Deploy → Run workflow |
| 立即拉取最新提示词并部署 | Actions → Fetch Prompts → Run workflow（成功后自动 Deploy） |
| 推送代码后自动部署 | （可选）在 deploy.yml 的 `on:` 加 `push: branches: [main]` |

## 六、故障排查

| 问题 | 排查 |
|------|------|
| `Permission denied (publickey)` | 私钥内容不完整（缺 BEGIN/END 行），或公钥未加入服务器 authorized_keys |
| `rsync: connection unexpectedly closed` | 检查 `DEPLOY_PORT`、服务器防火墙、sshd 是否运行 |
| 部署成功但页面 404 | nginx 缺少 `try_files $uri $uri/ /index.html;` |
| 部署成功但旧缓存 | nginx 对 `index.html` 加了缓存，改为 `add_header Cache-Control "no-cache";` |
| `ssh-keyscan` 找不到主机 | `DEPLOY_HOST` 填错，或 DNS 未解析 |

## 七、安全说明

- `DEPLOY_SSH_KEY` 是 GitHub 加密存储的 Secret，日志中会自动脱敏（显示为 `***`）
- 建议用**专用 deploy 密钥**，只授权写入站点目录，不要用 root 的日常密钥
- 如需进一步限制，可在服务器为 deploy key 配置 `command="rsync ..."` 前缀强制只能执行 rsync

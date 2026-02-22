# 🚀 自动部署到 GitHub Pages

## 一键部署步骤

### 1. 创建 GitHub 仓库
1. 访问 https://github.com/new
2. 仓库名称：`birthday-wish`
3. 选择 Public
4. 点击 Create repository

### 2. 在本地终端执行以下命令

打开 PowerShell，确保在 birthday-wish 目录下，然后执行：

```powershell
# 初始化 git
git init

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit"

# 连接到 GitHub（替换 yourusername 为你的 GitHub 用户名）
git remote add origin https://github.com/yourusername/birthday-wish.git

# 推送到 main 分支
git branch -M main
git push -u origin main
```

### 3. 启用 GitHub Actions 自动部署

推送代码后，GitHub Actions 会自动运行并部署网站。

等待 1-2 分钟后，访问：
```
https://yourusername.github.io/birthday-wish/
```

### 4. 后续更新（可选）

以后修改代码后，只需执行：
```powershell
git add .
git commit -m "Update website"
git push
```

GitHub Actions 会自动重新部署！

## 📝 注意事项

- 替换 `yourusername` 为你的实际 GitHub 用户名
- 确保 GitHub 仓库是 Public（公开的）
- 第一次部署可能需要 1-2 分钟

## 🎯 分享链接

部署成功后，把链接分享给朋友：
```
https://yourusername.github.io/birthday-wish/
```
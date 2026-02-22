# 🎂 生日快乐祝福网站

一个精美的、带有动画效果的生日快乐祝福网页，可以自定义名字并分享给朋友！

## ✨ 特性

- 🎨 精美的渐变背景和动画效果
- 🎈 飘动的气球和闪烁的星星
- 🎊 彩花爆炸效果
- 💝 可自定义收祝福人的名字
- 📱 完全响应式设计，支持手机访问
- 🌐 自动部署到 GitHub Pages

## 🚀 快速开始

### 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

访问 `http://localhost:5173` 查看效果

### 构建生产版本

```bash
npm run build
```

## 🌐 自动部署

本项目已配置 GitHub Actions，推送到 main 分支后会自动部署到 GitHub Pages。

### 部署步骤

1. **创建 GitHub 仓库**
   - 在 GitHub 上创建一个新仓库，命名为 `birthday-wish`

2. **推送代码**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/你的用户名/birthday-wish.git
   git push -u origin main
   ```

3. **启用 GitHub Pages**
   - 进入仓库的 Settings → Pages
   - Source 选择 "Deploy from a branch"
   - Branch 选择 "gh-pages"
   - 点击 Save

4. **等待部署**
   - 每次推送到 main 分支，GitHub Actions 会自动构建并部署
   - 部署完成后，访问 `https://你的用户名.github.io/birthday-wish/`

## 📝 自定义

### 修改祝福语

编辑 `src/App.jsx` 文件，找到祝福语文本部分进行修改：

```jsx
<motion.p className="text-xl text-white mb-6 leading-relaxed">
  愿你的每一天都充满阳光和欢笑，<br />
  愿你的每一个梦想都能实现，<br />
  愿你永远保持年轻和快乐！
</motion.p>
```

### 修改主题颜色

编辑 `src/index.css` 文件，修改渐变背景：

```css
.bg-gradient-to-br {
  background: linear-gradient(to bottom right, #你的颜色1, #你的颜色2, #你的颜色3);
}
```

## 🎨 技术栈

- React 18
- Vite
- Tailwind CSS
- Framer Motion（动画）
- Canvas Confetti（彩花效果）

## 📄 许可证

MIT License
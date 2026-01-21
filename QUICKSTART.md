# 快速开始指南

## 项目概述

这是一个用于验证 Next.js 中间件在不同版本下行为的项目，特别针对边缘平台的部署验证。

## ⚠️ 边缘平台特性

**重要说明**：
- ✅ **只支持 Edge Runtime**：边缘平台只支持 Next.js 的 Edge runtime 中间件
- ✅ **Edge Functions 打包**：会将 Next.js 的 Edge 部分打包到 Edge Functions
- ❌ **不支持 Node.js Runtime**：即使 Next.js 15+ 支持 Node.js runtime，边缘平台也不支持
- ❌ **不支持 Next.js 16**：Next.js 16 的 proxy.ts 强制使用 Node.js runtime，不适用于边缘平台

**测试范围**：
- ✅ Next.js 13.x/14.x（Edge runtime）
- ✅ Next.js 15.x（Edge runtime，不使用 Node.js runtime）
- ❌ Next.js 12.x（不测试）
- ❌ Next.js 16.x（不支持）

## 项目结构

```
nextjs-middleware-validate/
├── versions/           # 不同 Next.js 版本的示例
│   ├── v12/          # Next.js 12.x (Edge runtime)
│   ├── v13/          # Next.js 13.x/14.x (Edge runtime)
│   ├── v15/          # Next.js 15.x (Node.js runtime)
│   └── v16/          # Next.js 16.x (proxy.ts, Node.js runtime)
├── test-cases/        # 测试用例说明
├── docs/              # 详细文档
└── README.md          # 项目说明
```

## 快速开始

### 1. 选择要测试的版本

进入对应的版本目录（仅支持 Edge runtime 版本）：

```bash
cd versions/v13  # Next.js 13.x/14.x
# 或
cd versions/v15  # Next.js 15.x (Edge runtime)
```

### 2. 安装依赖

```bash
npm install
```

### 3. 运行开发服务器

```bash
npm run dev
```

### 4. 访问测试页面

打开浏览器访问 `http://localhost:3000`，查看测试页面和链接。

### 5. 测试中间件功能

#### 基础测试

1. **路径匹配测试**
   - 访问 `/api/test` - 检查响应头中是否有中间件添加的标识

2. **重定向测试**
   - 访问 `/old` (v12) 或 `/protected/*` (v13+) - 应该被重定向

3. **重写测试**
   - 访问 `/about` (v12) - URL 不变但内容来自 `/about-us`

4. **Cookie 测试**
   - 访问任意页面 - 检查是否设置了 `test-cookie`
   - 在浏览器开发者工具中查看 Cookie

5. **响应头测试**
   - 打开浏览器开发者工具 → Network 标签
   - 查看响应头中的中间件标识：
     - `x-middleware-version` 或 `x-proxy-version`
     - `x-runtime`
     - `x-forwarded-by`

#### 高级测试

1. **认证测试** (v13+)
   - 访问 `/protected/dashboard` - 无认证应重定向到 `/login`
   - 使用 curl 添加 Authorization header:
     ```bash
     curl -H "Authorization: Bearer token" http://localhost:3000/protected/dashboard
     ```

2. **Bot 检测测试**
   - 使用 curl 模拟 Bot:
     ```bash
     curl -H "User-Agent: Googlebot" http://localhost:3000/api/test
     ```
   - 检查响应头中的 `x-detected-bot`

## 部署到边缘平台

### 1. 准备项目

选择一个版本目录，确保项目可以正常构建：

```bash
cd versions/v12  # 或其他版本
npm run build
```

### 2. 推送到 Git 仓库

```bash
git init
git add .
git commit -m "Next.js middleware validation project"
git remote add origin <your-repo-url>
git push -u origin main
```

### 3. 在平台创建项目

1. 登录平台控制台
2. 创建新项目
3. 连接 Git 仓库
4. 选择对应分支
5. 配置构建设置：
   - **构建命令**: `npm run build`
   - **输出目录**: `.next`
   - **Node.js 版本**: 根据 Next.js 版本选择（参考下表）

### 4. 部署和验证

1. 触发部署
2. 等待构建完成
3. 访问部署的 URL
4. 按照上述测试步骤验证中间件功能
5. 检查平台控制台的日志

## Next.js 版本与 Node.js 版本对应

| Next.js 版本 | 推荐 Node.js 版本 | 边缘平台支持 |
|-------------|------------------|-------------------|
| 12.x | 16.x, 18.x | ✅ |
| 13.x | 18.x, 20.x | ✅ |
| 14.x | 18.x, 20.x | ✅ |
| 15.x | 18.x, 20.x | ✅ |
| 16.x | 20.x, 22.x | ⚠️ 需要验证 |

## 版本特性对比（边缘平台适用）

### v13/v14 - 增强功能
- ✅ Edge runtime（边缘平台支持）
- ✅ 增强的 matcher
- ✅ userAgent() helper
- ✅ 改进的 Cookies API
- ✅ 请求头修改
- ✅ 会被打包到 Edge Functions

### v15 - Edge Runtime（边缘平台适用）
- ✅ Edge runtime（必须使用 Edge，不能使用 Node.js）
- ✅ 增强的 matcher
- ✅ userAgent() helper
- ✅ 改进的 Cookies API
- ✅ 请求头修改
- ✅ 会被打包到 Edge Functions
- ❌ 不能使用 Node.js API（边缘平台不支持）

### 不支持的版本
- ❌ v12：不测试
- ❌ v16：不支持（强制 Node.js runtime，边缘平台不支持）

## 常见问题

### Q: 如何选择测试哪个版本？

A: 根据边缘平台特性：
- ✅ Next.js 13/14：推荐测试，功能完整
- ✅ Next.js 15（Edge runtime）：推荐测试，最新 Edge 功能
- ❌ Next.js 12：不测试
- ❌ Next.js 15（Node.js runtime）：不支持，边缘平台不支持 Node.js runtime
- ❌ Next.js 16：不支持，强制 Node.js runtime

### Q: 边缘平台支持 proxy.ts（Next.js 16）吗？

A: ❌ 不支持。Next.js 16 的 proxy.ts 强制使用 Node.js runtime，而边缘平台只支持 Edge runtime。建议使用 Next.js 13/14/15 的 Edge runtime 中间件。

### Q: 中间件不执行怎么办？

A: 检查以下几点：
1. 文件位置是否正确（根目录或 src 目录）
2. matcher 配置是否匹配当前路径
3. 构建日志是否有错误
4. 运行时日志是否有错误

### Q: 如何调试中间件？

A: 
1. 在中间件中添加 console.log（注意：在生产环境可能不显示）
2. 检查响应头中的中间件标识
3. 查看平台控制台的 **Edge Functions 执行日志**
4. 使用浏览器开发者工具的 Network 标签
5. 在平台控制台查看 Edge Functions 的性能指标和执行记录

## 测试检查清单

### 本地测试
- [ ] 项目可以正常启动
- [ ] 中间件在匹配的路径执行
- [ ] 响应头正确添加
- [ ] 重定向功能正常
- [ ] 重写功能正常
- [ ] Cookie 操作正常
- [ ] 静态资源不受影响

### 部署测试
- [ ] 项目可以正常构建
- [ ] 部署成功
- [ ] 中间件在部署环境执行
- [ ] 所有功能正常
- [ ] 性能可接受
- [ ] 日志正常

## 下一步

1. 阅读 [README.md](./README.md) 了解项目详情
2. 查看 [test-cases/README.md](./test-cases/README.md) 了解详细测试用例
3. 阅读 [docs/version-comparison.md](./docs/version-comparison.md) 了解版本差异
4. 开始测试和验证

## 贡献

如果发现问题或有改进建议，欢迎提交 Issue 或 Pull Request。

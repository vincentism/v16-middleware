# Next.js Middleware 边缘平台 测试用例清单

## 重要说明

**边缘平台特性**：
- ✅ 只支持 Next.js 的 **Edge Runtime** 中间件
- ✅ 会将 Next.js 的 Edge 部分打包到 **Edge Functions**
- ❌ 不支持 Node.js runtime 中间件（即使 Next.js 15+ 支持）
- ❌ 不支持 Next.js 16 的 proxy.ts（强制 Node.js runtime）

**测试范围**：
- ✅ Next.js 13.x/14.x（Edge runtime）
- ✅ Next.js 15.x（Edge runtime，不使用 Node.js runtime）
- ❌ Next.js 12.x（不测试）
- ❌ Next.js 16.x（不支持，强制 Node.js runtime）

---

## 使用说明

- 在每个测试用例前使用 `- [ ]` 或 `- [x]` 来标记测试状态
- 记录测试结果和遇到的问题
- 重点验证 Edge runtime 功能和 边缘平台 Edge Functions 的兼容性

---

## 测试环境信息

**测试日期**: 2026-01-20

**测试人员**: tomcomtang

**边缘平台环境**: 
- [ ] 开发环境
- [ ] 生产环境

**Next.js 版本**: 
- [ ] 13.x
- [ ] 14.x
- [ ] 15.x

**Edge Functions 版本**: 

---

## 一、Next.js 13.x/14.x Edge Runtime 测试用例

### 1.1 基础功能测试

#### 路径匹配（增强）
- [ ] **TC-13-001**: 访问 `/api/test`，验证中间件在 Edge Functions 中执行
  - 预期: 响应头包含 `x-middleware-version: v13`
  - 预期: 平台日志显示 Edge Function 执行
  - 实际结果: 

- [ ] **TC-13-002**: 访问 `/protected/dashboard`，验证中间件执行
  - 预期: 响应头包含中间件标识
  - 实际结果: 

- [ ] **TC-13-003**: 访问静态资源 `/favicon.ico`，验证中间件不执行
  - 预期: 响应头不包含中间件标识，静态资源正常加载
  - 预期: Edge Function 不执行
  - 实际结果: 

#### userAgent() Helper（Edge Functions 兼容性）
- [ ] **TC-13-004**: 使用 userAgent() helper 检测 Bot
  - 预期: 正确识别 Bot，响应头包含 `x-detected-bot`, `x-bot-name`
  - 预期: 在 Edge Functions 环境中正常工作
  - 实际结果: 

- [ ] **TC-13-005**: 使用正常浏览器访问，验证 userAgent() 正常工作
  - 预期: 响应头不包含 `x-detected-bot`
  - 实际结果: 

#### 改进的 Cookies API（Edge Functions 兼容性）
- [ ] **TC-13-006**: 使用新 API 设置 Cookie
  - 预期: Cookie 正确设置，包含 httpOnly, sameSite 等选项
  - 预期: 在 Edge Functions 环境中正常工作
  - 实际结果: 

- [ ] **TC-13-007**: 使用新 API 读取 Cookie
  - 预期: 能正确读取 Cookie 值
  - 实际结果: 

- [ ] **TC-13-008**: 使用新 API 删除 Cookie
  - 预期: Cookie 被正确删除
  - 实际结果: 

#### 请求头修改（Edge Functions 兼容性）
- [ ] **TC-13-009**: 验证请求头被修改并传递到 API 路由
  - 预期: API 路由能接收到 `x-forwarded-by: middleware-v13`
  - 预期: 请求头修改在 Edge Functions 中正常工作
  - 实际结果: 

#### 响应头设置
- [ ] **TC-13-010**: 访问 `/api/test`，验证响应头设置
  - 预期: 响应头包含 `x-middleware-version`, `x-request-path`, `x-timestamp`
  - 实际结果: 

#### 认证检查（基于 Header）
- [ ] **TC-13-011**: 访问 `/protected/dashboard` 无 Authorization header
  - 预期: 重定向到 `/login`
  - 预期: 重定向在 Edge Functions 中正常工作
  - 实际结果: 

- [ ] **TC-13-012**: 访问 `/protected/dashboard` 带 Authorization header
  - 预期: 正常访问，不被重定向
  - 实际结果: 

#### 基于 Cookie 的条件处理
- [ ] **TC-13-013**: 设置 theme cookie，验证响应头包含主题信息
  - 预期: 响应头包含 `x-theme`
  - 实际结果: 

### 1.2 增强功能测试

- [ ] **TC-13-014**: 验证增强的 matcher 配置（排除静态文件）
  - 预期: 静态文件被正确排除，中间件不执行
  - 预期: Edge Functions 不处理静态资源
  - 实际结果: 

- [ ] **TC-13-015**: 验证时间戳响应头
  - 预期: 响应头包含 `x-timestamp`，格式为 ISO 字符串
  - 实际结果: 

### 1.3 边缘平台 部署验证

- [ ] **TC-13-016**: 在 边缘平台 上构建成功
  - 预期: 构建无错误
  - 预期: Edge Functions 代码正确打包
  - 实际结果: 

- [ ] **TC-13-017**: 验证中间件被正确打包到 Edge Functions
  - 预期: 边缘平台 控制台显示 Edge Function 创建
  - 预期: 中间件代码在 Edge Functions 中执行
  - 实际结果: 

- [ ] **TC-13-018**: 验证 Edge Functions 执行日志
  - 预期: 边缘平台 日志显示中间件执行记录
  - 预期: 可以查看执行时间和错误信息
  - 实际结果: 

- [ ] **TC-13-019**: 验证所有功能在 边缘平台 上正常工作
  - 预期: 部署后所有中间件功能正常
  - 预期: 性能在可接受范围内
  - 实际结果: 

---

## 二、Next.js 15.x Edge Runtime 测试用例

### 2.1 Edge Runtime 配置验证

- [ ] **TC-15-001**: 验证使用 Edge runtime 配置
  - 预期: `config.runtime = 'edge'` 正确配置
  - 预期: 响应头包含 `x-runtime: edge`
  - 实际结果: 

- [ ] **TC-15-002**: 验证中间件版本标识
  - 预期: 响应头包含 `x-middleware-version: v15`
  - 实际结果: 

- [ ] **TC-15-003**: 验证不使用 Node.js runtime（边缘平台 不支持）
  - 预期: 配置中不包含 `runtime: 'nodejs'`
  - 预期: 不使用 Node.js API
  - 实际结果: 

### 2.2 基础功能测试（Edge Runtime）

#### 路径匹配
- [ ] **TC-15-004**: 访问 `/api/test`，验证中间件在 Edge Functions 中执行
  - 预期: 响应头包含中间件标识
  - 预期: 平台日志显示 Edge Function 执行
  - 实际结果: 

- [ ] **TC-15-005**: 访问 `/admin/dashboard`，验证中间件执行
  - 预期: 响应头包含中间件标识
  - 实际结果: 

#### 认证检查（基于 Cookie）
- [ ] **TC-15-006**: 访问 `/admin/dashboard` 无 session cookie
  - 预期: 重定向到 `/login`
  - 预期: 重定向在 Edge Functions 中正常工作
  - 实际结果: 

- [ ] **TC-15-007**: 访问 `/admin/dashboard` 带 session cookie
  - 预期: 正常访问，不被重定向
  - 实际结果: 

#### 请求头修改
- [ ] **TC-15-008**: 验证请求头被修改
  - 预期: API 路由能接收到 `x-forwarded-by: middleware-v15-edge`, `x-original-path`
  - 预期: 请求头修改在 Edge Functions 中正常工作
  - 实际结果: 

#### 安全头设置
- [ ] **TC-15-009**: 访问 `/api/*` 路径，验证安全头
  - 预期: 响应头包含 `x-content-type-options: nosniff`, `x-frame-options: DENY`
  - 实际结果: 

#### User-Agent 处理
- [ ] **TC-15-010**: 使用 userAgent() helper 检测 Bot
  - 预期: 正确识别 Bot，响应头包含 `x-detected-bot`, `x-bot-name`
  - 预期: 在 Edge Functions 环境中正常工作
  - 实际结果: 

### 2.3 Edge Runtime 限制验证

- [ ] **TC-15-011**: 验证不能使用 Node.js API（如 fs, crypto）
  - 预期: 代码中不包含 Node.js API 调用
  - 预期: 如果误用会报错或构建失败
  - 实际结果: 

- [ ] **TC-15-012**: 验证 Edge runtime 性能
  - 预期: 中间件执行时间 < 100ms
  - 预期: Edge Functions 冷启动时间可接受
  - 实际结果: 

### 2.4 边缘平台 部署验证

- [ ] **TC-15-013**: 在 边缘平台 上构建成功
  - 预期: 构建无错误
  - 预期: Edge Functions 代码正确打包
  - 实际结果: 

- [ ] **TC-15-014**: 验证中间件被正确打包到 Edge Functions
  - 预期: 边缘平台 控制台显示 Edge Function 创建
  - 预期: 中间件代码在 Edge Functions 中执行
  - 实际结果: 

- [ ] **TC-15-015**: 验证所有功能在 边缘平台 上正常工作
  - 预期: 部署后所有中间件功能正常
  - 预期: Edge runtime 功能完整可用
  - 实际结果: 

---

## 三、边缘平台 Edge Functions 特定测试

### 3.1 Edge Functions 打包验证

- [ ] **TC-EDGE-001**: 验证中间件代码被正确打包
  - 预期: 边缘平台 构建日志显示 Edge Function 打包成功
  - 预期: 中间件代码被包含在 Edge Functions 中
  - 实际结果: 

- [ ] **TC-EDGE-002**: 验证依赖项正确打包
  - 预期: 中间件使用的依赖（如 `next/server`）正确打包
  - 预期: 没有缺失的依赖
  - 实际结果: 

- [ ] **TC-EDGE-003**: 验证代码大小限制
  - 预期: Edge Function 代码大小在限制范围内
  - 预期: 没有超出 边缘平台 的限制
  - 实际结果: 

### 3.2 Edge Functions 执行验证

- [ ] **TC-EDGE-004**: 验证 Edge Function 正确执行
  - 预期: 中间件在 Edge Functions 环境中正常执行
  - 预期: 响应头正确设置
  - 实际结果: 

- [ ] **TC-EDGE-005**: 验证 Edge Function 执行时间
  - 预期: 执行时间在可接受范围内（< 100ms）
  - 预期: 不影响整体响应时间
  - 实际结果: 

- [ ] **TC-EDGE-006**: 验证 Edge Function 冷启动
  - 预期: 冷启动时间可接受
  - 预期: 不影响首次请求
  - 实际结果: 

### 3.3 Edge Functions 日志和监控

- [ ] **TC-EDGE-007**: 验证 Edge Function 执行日志
  - 预期: 边缘平台 控制台显示执行日志
  - 预期: 可以查看执行时间、错误等信息
  - 实际结果: 

- [ ] **TC-EDGE-008**: 验证错误处理和日志
  - 预期: 中间件错误被正确记录
  - 预期: 错误不会导致应用崩溃
  - 实际结果: 

- [ ] **TC-EDGE-009**: 验证性能监控
  - 预期: 可以查看 Edge Function 的性能指标
  - 预期: 执行次数、平均执行时间等数据可用
  - 实际结果: 

### 3.4 Edge Functions 兼容性测试

- [ ] **TC-EDGE-010**: 验证 Next.js API 在 Edge Functions 中可用
  - 预期: `NextResponse`, `NextRequest` 等 API 正常工作
  - 预期: `userAgent()` helper 正常工作
  - 实际结果: 

- [ ] **TC-EDGE-011**: 验证 Cookies API 在 Edge Functions 中可用
  - 预期: `cookies.get()`, `cookies.set()`, `cookies.delete()` 正常工作
  - 实际结果: 

- [ ] **TC-EDGE-012**: 验证 Headers API 在 Edge Functions 中可用
  - 预期: 请求头和响应头操作正常工作
  - 实际结果: 

---

## 四、跨版本对比测试（Edge Runtime）

### 4.1 功能一致性测试

- [ ] **TC-CROSS-001**: 对比 v13/14 和 v15 的路径匹配行为
  - 预期: 功能一致，配置方式相同
  - 实际结果: 

- [ ] **TC-CROSS-002**: 对比 v13/14 和 v15 的重定向行为
  - 预期: 功能一致，在 Edge Functions 中正常工作
  - 实际结果: 

- [ ] **TC-CROSS-003**: 对比 v13/14 和 v15 的 Cookie 操作
  - 预期: 功能一致，API 相同
  - 实际结果: 

- [ ] **TC-CROSS-004**: 对比 v13/14 和 v15 的 userAgent() helper
  - 预期: 功能一致，行为相同
  - 实际结果: 

### 4.2 Edge Functions 性能对比

- [ ] **TC-CROSS-005**: 对比 v13/14 和 v15 在 Edge Functions 中的性能
  - 预期: 性能差异在可接受范围内
  - 预期: 记录各版本的平均执行时间
  - 实际结果: 

- [ ] **TC-CROSS-006**: 对比各版本的 Edge Function 打包大小
  - 预期: 记录各版本的打包大小
  - 预期: 大小差异合理
  - 实际结果: 

---

## 五、边缘平台 平台特定测试

### 5.1 构建和部署

- [ ] **TC-PLATFORM-001**: 验证构建命令正确
  - 预期: `npm run build` 成功执行
  - 预期: Edge Functions 代码正确生成
  - 实际结果: 

- [ ] **TC-PLATFORM-002**: 验证输出目录配置
  - 预期: `.next` 目录正确生成
  - 预期: Edge Functions 代码包含在输出中
  - 实际结果: 

- [ ] **TC-PLATFORM-003**: 验证 Node.js 版本选择
  - 预期: 选择的 Node.js 版本与 Next.js 版本兼容
  - 预期: 构建环境正确
  - 实际结果: 

### 5.2 运行时验证

- [ ] **TC-PLATFORM-004**: 验证中间件在 边缘平台 上执行
  - 预期: 中间件正常执行，响应头正确
  - 预期: Edge Functions 正常工作
  - 实际结果: 

- [ ] **TC-PLATFORM-005**: 验证静态资源不受中间件影响
  - 预期: 静态资源正常加载，中间件不执行
  - 预期: Edge Functions 不处理静态资源
  - 实际结果: 

- [ ] **TC-PLATFORM-006**: 验证 API 路由与中间件协作
  - 预期: API 路由正常工作，能接收到中间件修改的请求头
  - 预期: Edge Functions 和 API 路由正确协作
  - 实际结果: 

### 5.3 日志和监控

- [ ] **TC-PLATFORM-007**: 检查构建日志
  - 预期: 无错误或警告
  - 预期: Edge Functions 打包信息正确
  - 实际结果: 

- [ ] **TC-PLATFORM-008**: 检查运行时日志
  - 预期: Edge Function 执行日志正常
  - 预期: 可以查看详细的执行信息
  - 实际结果: 

- [ ] **TC-PLATFORM-009**: 验证错误处理
  - 预期: 中间件错误不会导致应用崩溃
  - 预期: 错误被正确记录和报告
  - 实际结果: 

### 5.4 性能测试

- [ ] **TC-PLATFORM-010**: 测试中间件对页面加载速度的影响
  - 预期: 影响在可接受范围内（< 100ms）
  - 预期: Edge Functions 执行快速
  - 实际结果: 

- [ ] **TC-PLATFORM-011**: 测试中间件对 API 响应时间的影响
  - 预期: 影响在可接受范围内（< 50ms）
  - 预期: Edge Functions 不显著影响性能
  - 实际结果: 

- [ ] **TC-PLATFORM-012**: 测试 Edge Functions 并发处理能力
  - 预期: 能正确处理并发请求
  - 预期: 性能稳定
  - 实际结果: 

---

## 六、边界情况和错误处理测试

### 6.1 异常情况

- [ ] **TC-EDGE-ERR-001**: 测试无效的 matcher 配置
  - 预期: 构建时或运行时给出错误提示
  - 预期: 边缘平台 构建失败或警告
  - 实际结果: 

- [ ] **TC-EDGE-ERR-002**: 测试中间件中抛出错误
  - 预期: 错误被正确处理，不影响应用
  - 预期: 错误被记录到 边缘平台 日志
  - 实际结果: 

- [ ] **TC-EDGE-ERR-003**: 测试超长路径
  - 预期: 中间件能正常处理
  - 预期: Edge Functions 不因路径过长而失败
  - 实际结果: 

- [ ] **TC-EDGE-ERR-004**: 测试特殊字符路径
  - 预期: 中间件能正常处理
  - 预期: Edge Functions 正确处理 URL 编码
  - 实际结果: 

### 6.2 并发测试

- [ ] **TC-EDGE-ERR-005**: 测试并发请求
  - 预期: 中间件能正确处理并发请求
  - 预期: Edge Functions 并发处理正常
  - 实际结果: 

- [ ] **TC-EDGE-ERR-006**: 测试高并发场景
  - 预期: Edge Functions 能处理高并发
  - 预期: 性能稳定，无错误
  - 实际结果: 

---

## 七、测试总结

### 测试统计

- **总测试用例数**: 
- **通过**: 
- **失败**: 
- **跳过**: 
- **通过率**: %

### 问题汇总

| 问题编号 | 测试用例 | 问题描述 | 严重程度 | 状态 |
|---------|---------|---------|---------|------|
| | | | | |
| | | | | |

### 版本兼容性总结

| Next.js 版本 | 边缘平台 支持 | Edge Functions 打包 | 主要问题 | 建议 |
|-------------|-------------------|-------------------|---------|------|
| 13.x | | | | |
| 14.x | | | | |
| 15.x (Edge) | | | | |

### Edge Functions 性能总结

| 版本 | 平均执行时间 | 打包大小 | 冷启动时间 | 备注 |
|------|------------|---------|-----------|------|
| 13.x | | | | |
| 14.x | | | | |
| 15.x | | | | |

### 结论

**测试结论**: 

**边缘平台 Edge Functions 兼容性**: 

**建议**: 

**备注**: 

---

## 附录：测试工具和命令

### 本地测试命令

```bash
# 进入对应版本目录
cd versions/v13  # 或 v15

# 安装依赖
npm install

# 运行开发服务器
npm run dev

# 构建测试
npm run build
```

### 测试工具

- **浏览器开发者工具**: 检查响应头、Cookie、网络请求
- **curl**: 测试 API 和自定义请求头
  ```bash
  # 测试 API
  curl http://localhost:3000/api/test
  
  # 测试带自定义 header
  curl -H "Authorization: Bearer token" http://localhost:3000/protected/dashboard
  
  # 测试 Bot User-Agent
  curl -H "User-Agent: Googlebot" http://localhost:3000/api/test
  ```
- **边缘平台 控制台**: 查看 Edge Functions 执行日志和性能指标

### 边缘平台 部署检查清单

- [ ] Git 仓库已连接
- [ ] 构建命令已配置（`npm run build`）
- [ ] 输出目录已配置（`.next`）
- [ ] Node.js 版本已选择
- [ ] 中间件使用 Edge runtime（不是 Node.js runtime）
- [ ] 环境变量已配置（如有需要）
- [ ] 自定义域名已配置（如有需要）

### Edge Functions 验证清单

- [ ] 中间件代码被正确打包到 Edge Functions
- [ ] Edge Functions 在 边缘平台 控制台可见
- [ ] Edge Functions 执行日志正常
- [ ] 性能指标在可接受范围内
- [ ] 错误处理和日志记录正常

---

**文档版本**: 2.0  
**最后更新**: 2026-01-20  
**适用范围**: 边缘平台 Edge Functions 环境

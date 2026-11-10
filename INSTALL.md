# 安装

## 通过 DSH 插件页（推荐）

打开 DSH → 左侧 **插件** → **添加插件**，填入：

```text
github:Asukabye/dsh-balance-ui
```

或：

```text
https://github.com/Asukabye/dsh-balance-ui
```

安装后刷新页面。

## 通过 CLI

```bash
dsh plugin --profile web add github:Asukabye/dsh-balance-ui
```

自定义 profile 时把 `web` 换成实际 profile 名。安装后重新启动 DSH。

## 通过本地 tarball

```bash
dsh plugin --profile web add "/absolute/path/to/local-dsh-balance-ui-1.0.0.tgz"
```

tarball 可在本地用 `npm pack` 生成，或从其他设备复制。安装前建议完全退出 DSH，安装后重新启动。

## 验证

- 输入框下方应出现「本次会话 ¥x.xxxx」，点击可展开明细。
- 侧栏账号入口上方应出现余额条，显示充值 + 赠送的合计。
- 账户余额需要目标设备已登录 DeepSeek 账号。

## 卸载

```bash
dsh plugin --profile web remove @local/dsh-balance-ui
```

或在插件页的「已安装插件」中移除。

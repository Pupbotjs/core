<div align="center">
  <a href="https://pupbot.cn/" target="_blank">
    <img width="160" src="https://www.pupbot.cn/logo.png" alt="logo" style="">
  </a>
  <h1 id="pupbot"><a href="https://pupbot.cn/" target="_blank">PupBot</a></h1>
  
[![downloads](https://img.shields.io/npm/dm/@pupbot/core?style=flat-square)](https://www.npmjs.com/package/@pupbot/core)
[![npm](https://img.shields.io/npm/v/@pupbot/core?style=flat-square)](https://www.npmjs.com/package/@pupbot/core)
[![GitHub](https://img.shields.io/github/license/Pupbotjs/core?style=flat-square)](https://github.com/Pupbotjs/core/blob/master/LICENSE)

</div>

`PupBot` 是使用 [TypeScript](https://www.typescriptlang.org/) 语言编写的**轻量**、**优雅**、**跨平台**、**开发者友好**的 QQ 机器人框架。

框架完全开源，可扩展性强，插件开发简单，核心底层协议使用 [oicq](https://github.com/takayama-lily/oicq) v2，API 众多，功能强大。另外，框架使用 [node](https://nodejs.org/) 驱动，得益于 node 及其高效的 v8 引擎，PupBot 的性能可观。

### 特性

-  **轻量**: 无需运行 UI，内存占用低。

-  **高效**: 框架依赖少，执行效率高。

-  **跨平台**: Windows, Linux,  Android 等都能运行。

-  **多协议**: 支持安卓手机、安卓平板、iPad、安卓手表和 MacOS 协议。

-  **注重体验**: 使用 消息指令 执行操作、启用或升级插件。

-  **极速开发**: 学习门槛低，只需几行 JS/TS 代码就能编写插件。

-  **开发者友好**: 插件支持热重载，拥有友好的Plugin API。

### 开箱即用

框架提供了状态监控、插件管理、管理员机制、消息通知、请求处理功能，开箱即用。

### 插件示例

仅需编写少量 JavaScript 代码即可实现丰富功能，参考下面的 demo。

::: tip 请注意
框架仍处于**测试阶段**，插件的 API 会不断完善，请留意文档更新。
:::

```js
const { PupPlugin, segment } = require('@pupbot/core')
const plugin = new PupPlugin('demo', '0.1.0')
plugin.onMounted(() => {
  plugin.onMessage(event => {
    const { raw_message } = event
    if (raw_message === 'hello') {
      const msgs = [segment.face(66), 'world']
      event.reply(msgs)
    }
  })
})
module.exports = { plugin }
```

详细插件 `API` 说明请参阅 [`PupPlugin API`](https://pupbot.cn/)<br>
详细Bot `API` 说明请参阅 [`Bot API`](https://pupbot.cn/)

## 快速起步

[前往文档](https://www.pupbot.cn/)

## 使用协议

Pupbot 使用 [MIT](./LICENSE) 协议开源，维护良好的开源生态从我做起 (*>ω<)φ

Copyright © 2023-RENCENT @Pupbotjs/core

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FPupbotjs%2Fcore.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2FPupbotjs%2Fcore?ref=badge_large)

## 更多

PupBot 由整个开源社区维护，并不是属于某个个体的作品，所有贡献者都享有其作品的著作权。

本项目开发初衷在于提高群活跃氛围、方便群管理，仅供个人娱乐、学习和交流使用，**不得将本项目用于任何非法用途**。

- [贡献指南](./CONTRIBUTING.md)
- [参与讨论](https://pupbot.cn/more.html)
- [支持项目](https://www.pupbot.cn/more.html#%E6%94%AF%E6%8C%81%E9%A1%B9%E7%9B%AE)

# Web Framework

A component-based orchestration web framework

# pnpm monorepo

## 模块之间依赖

```
pnpm add @krill/xxx -Dw
// for exp
pnpm add @krill/web-framework-utils -Dw
```

## husky 配置

```
husky install

# pre-commit
npx --no-install lint-staged

#commit-msg
npx --no-install commitlint --edit ""
```

# 开发配置

1. 开发时需配置 config.json，方式：从 packages/container/config.default.json copy 一份出来，并在其内加上如下内容：

```
{
  "server": {
    "port": 8888
  },
  "webSocketServer": {
    "enabled": true,
    "port": 9999,
    "reloadAsPluginUpdated": true
  },
  "plugins": {
    "component": ["/home/ximenchuixue/work/web-framework-plugins/components/*/dist"],
    "library": ["/home/ximenchuixue/work/web-framework-plugins/libraries/*/dist"]
  },
  "storyboards": ["/home/ximenchuixue/work/web-storyboards/console/storyborad.json"]
}
```

2 运行`pnpm build`
3 运行 `pnpm start`

# 发布

pnpm monorepo 默认的能力是：依赖安装、运行、构建。
缺失的能力是版本管理，其可用 changeset 补充
使用文档：https://pnpm.io/zh/using-changesets

```
$ pnpm add -DW @changesets/cli
$ pnpm changeset init
```

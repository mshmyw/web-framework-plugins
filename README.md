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

#!/bin/bash

set -e

echo "🚀 快速发布到NPM..."

# 基本检查
if [ "$(git branch --show-current)" != "main" ]; then
    echo "❌ 请在main分支上发布"
    exit 1
fi

if [ -n "$(git status --porcelain)" ]; then
    echo "❌ 请先提交所有更改"
    exit 1
fi

# 安装、测试、构建
npm install
npm run lint
npm run test
npm run build

# 发布
npm publish --access public

echo "✅ 发布完成！"
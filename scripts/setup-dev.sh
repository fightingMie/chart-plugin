#!/bin/bash

set -e

echo "🔧 设置React Metric Chart Plugin开发环境"
echo "========================================"

# 安装主项目依赖
echo "📦 安装主项目依赖..."
if command -v pnpm &> /dev/null; then
    pnpm install
else
    npm install
fi

# 设置示例项目
echo "📋 设置示例项目..."

# 基础示例
echo "  - 设置基础示例"
cd examples/basic
npm install
cd ../..

# 自定义数据源示例
echo "  - 设置自定义数据源示例"
cd examples/custom-datasource
npm install
cd ../..

# 过滤器示例
echo "  - 设置过滤器示例"
cd examples/with-filters
npm install
cd ../..

# 设置脚本权限
echo "🔐 设置脚本权限..."
chmod +x scripts/dev.sh
chmod +x scripts/setup-dev.sh

echo "✅ 开发环境设置完成！"
echo ""
echo "🚀 启动开发环境:"
echo "   npm run dev:start    # 启动组件库构建监听"
echo ""
echo "📋 启动示例项目:"
echo "   npm run example:basic     # 基础示例 (端口3001)"
echo "   npm run example:custom    # 自定义数据源 (端口3002)"
echo "   npm run example:filters   # 过滤器示例 (端口3003)"
echo ""
echo "🔧 开发工具:"
echo "   npm run test:watch   # 测试监听"
echo "   npm run lint         # 代码检查"
echo "   npm run type-check   # 类型检查"
#!/bin/bash

set -e

echo "🚀 启动React Metric Chart Plugin开发环境"
echo "=========================================="

# 检查Node.js版本
node_version=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$node_version" -lt 16 ]; then
    echo "❌ 需要Node.js 16或更高版本"
    exit 1
fi

# 安装依赖
echo "📦 安装主项目依赖..."
if command -v pnpm &> /dev/null; then
    pnpm install
else
    npm install
fi

# 构建组件库（开发模式）
echo "🔨 启动组件库构建监听..."
npm run dev &
BUILD_PID=$!

# 等待构建完成
echo "⏳ 等待初始构建完成..."
sleep 5

# 检查dist目录是否存在
if [ ! -d "dist" ]; then
    echo "⚠️  等待构建完成..."
    sleep 5
fi

echo "✅ 组件库构建已启动"
echo "📁 构建输出: ./dist/"
echo "👀 监听文件变化: ./src/"
echo ""
echo "🎯 现在可以在另一个终端中启动示例项目:"
echo "   cd examples/basic && npm run dev"
echo "   cd examples/custom-datasource && npm run dev"
echo "   cd examples/with-filters && npm run dev"
echo ""
echo "按 Ctrl+C 停止开发服务器"

# 等待用户中断
wait $BUILD_PID
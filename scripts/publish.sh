#!/bin/bash

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 React Metric Chart Plugin 发布脚本${NC}"
echo -e "${BLUE}=====================================\n${NC}"

# 检查是否在main分支
current_branch=$(git branch --show-current)
if [ "$current_branch" != "main" ]; then
    echo -e "${RED}❌ 错误: 请在main分支上进行发布${NC}"
    echo -e "${YELLOW}💡 提示: git checkout main${NC}"
    exit 1
fi

# 检查工作目录是否干净
if [ -n "$(git status --porcelain)" ]; then
    echo -e "${RED}❌ 错误: 工作目录不干净，请先提交所有更改${NC}"
    echo -e "${YELLOW}💡 提示: git add . && git commit -m 'your message'${NC}"
    exit 1
fi

# 拉取最新代码
echo -e "${YELLOW}📥 拉取最新代码...${NC}"
git pull origin main

# 检查是否有package-lock.json，如果有则删除（使用pnpm）
if [ -f "package-lock.json" ]; then
    echo -e "${YELLOW}🗑️  删除 package-lock.json (使用pnpm)...${NC}"
    rm package-lock.json
fi

# 安装依赖
echo -e "${YELLOW}📦 安装依赖...${NC}"
if command -v pnpm &> /dev/null; then
    pnpm install
else
    npm install
fi

# 运行代码检查
echo -e "${YELLOW}🔍 运行代码检查...${NC}"
npm run lint
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ 代码检查失败${NC}"
    exit 1
fi

# 运行类型检查
echo -e "${YELLOW}🔧 运行类型检查...${NC}"
npm run type-check
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ 类型检查失败${NC}"
    exit 1
fi

# 运行测试
echo -e "${YELLOW}🧪 运行测试...${NC}"
npm run test
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ 测试失败${NC}"
    exit 1
fi

# 构建项目
echo -e "${YELLOW}🔨 构建项目...${NC}"
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ 构建失败${NC}"
    exit 1
fi

# 检查dist目录
if [ ! -d "dist" ]; then
    echo -e "${RED}❌ 构建失败: dist目录不存在${NC}"
    exit 1
fi

# 获取当前版本
current_version=$(node -p "require('./package.json').version")
echo -e "\n${BLUE}📋 当前版本: ${current_version}${NC}"

# 询问版本类型
echo -e "\n${YELLOW}❓ 请选择版本更新类型:${NC}"
echo "1) patch (修复bug: ${current_version} -> $(npm version patch --dry-run 2>/dev/null | sed 's/v//'))"
echo "2) minor (新功能: ${current_version} -> $(npm version minor --dry-run 2>/dev/null | sed 's/v//'))"
echo "3) major (破坏性更改: ${current_version} -> $(npm version major --dry-run 2>/dev/null | sed 's/v//'))"
echo "4) 自定义版本"
echo "5) 跳过版本更新，直接发布当前版本"
read -p "请输入选择 (1-5): " version_choice

case $version_choice in
    1)
        version_type="patch"
        ;;
    2)
        version_type="minor"
        ;;
    3)
        version_type="major"
        ;;
    4)
        read -p "请输入版本号 (例如: 1.2.3): " custom_version
        if [[ ! $custom_version =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
            echo -e "${RED}❌ 无效的版本号格式${NC}"
            exit 1
        fi
        version_type=$custom_version
        ;;
    5)
        echo -e "${YELLOW}⏭️  跳过版本更新${NC}"
        version_type="skip"
        ;;
    *)
        echo -e "${RED}❌ 无效选择${NC}"
        exit 1
        ;;
esac

# 更新版本
if [ "$version_type" != "skip" ]; then
    echo -e "${YELLOW}📝 更新版本...${NC}"
    if [ "$version_choice" = "4" ]; then
        npm version $version_type --no-git-tag-version
    else
        npm version $version_type --no-git-tag-version
    fi
    
    new_version=$(node -p "require('./package.json').version")
    echo -e "${GREEN}✅ 版本已更新到: ${new_version}${NC}"
else
    new_version=$current_version
    echo -e "${GREEN}✅ 使用当前版本: ${new_version}${NC}"
fi

# 确认发布
echo -e "\n${YELLOW}❓ 确认发布版本 ${new_version} 到 NPM? (y/N)${NC}"
read -p "请输入: " confirm
if [[ ! $confirm =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}❌ 发布已取消${NC}"
    exit 0
fi

# 检查NPM登录状态
echo -e "${YELLOW}🔐 检查NPM登录状态...${NC}"
npm whoami > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ 未登录NPM，请先运行: npm login${NC}"
    exit 1
fi

# 发布到NPM
echo -e "${YELLOW}📤 发布到NPM...${NC}"
npm publish --access public
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ NPM发布失败${NC}"
    exit 1
fi

# 如果版本有更新，提交更改并创建标签
if [ "$version_type" != "skip" ]; then
    echo -e "${YELLOW}💾 提交版本更改...${NC}"
    git add package.json
    git commit -m "chore: release v${new_version}"
    
    echo -e "${YELLOW}🏷️  创建Git标签...${NC}"
    git tag "v${new_version}"
    
    echo -e "${YELLOW}📤 推送到远程仓库...${NC}"
    git push origin main
    git push origin "v${new_version}"
fi

echo -e "\n${GREEN}🎉 发布成功！${NC}"
echo -e "${GREEN}📦 版本 v${new_version} 已发布到 NPM${NC}"
echo -e "${GREEN}🔗 NPM链接: https://www.npmjs.com/package/react-metric-chart-plugin${NC}"
echo -e "\n${BLUE}📋 安装命令:${NC}"
echo -e "${YELLOW}npm install react-metric-chart-plugin${NC}"
echo -e "${YELLOW}pnpm add react-metric-chart-plugin${NC}"
echo -e "${YELLOW}yarn add react-metric-chart-plugin${NC}"
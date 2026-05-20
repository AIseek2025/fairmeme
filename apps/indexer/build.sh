#!/bin/bash

echo "开始构建和运行 Node.js 服务..."

# 确保 pnpm 已安装
if ! command -v pnpm &> /dev/null
then
    echo "pnpm 未安装，正在安装..."
    npm install -g pnpm
fi

# 更新依赖
echo "正在更新依赖..."
pnpm install

# 打包项目
echo "正在打包项目..."
pnpm run build

# 运行服务
echo "正在启动服务..."
pnpm start

echo "服务已启动，请查看控制台输出。"
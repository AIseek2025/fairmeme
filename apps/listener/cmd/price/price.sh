#!/bin/bash

# 使用nohup在后台启动你的服务
nohup ./price &

# 你可以添加其他的日志记录或通知代码
echo "price 已经在后台启动，使用了nohup"
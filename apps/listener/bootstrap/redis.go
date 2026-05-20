package bootstrap

import (
	"github.com/fair-meme/fairmeme/apps/listener/global"
	"fmt"
	"github.com/go-redis/redis/v8"
)

func InitializeRedis() error {
	// 配置Redis连接字符串
	// 这里假设您的全局配置中包含了Redis的配置信息

	connectString := fmt.Sprintf("%s:%s", global.App.Config.Redis.Host, global.App.Config.Redis.Port)

	// 创建Redis客户端
	// 这里使用go-redis的NewClient来创建客户端
	// 请根据您的Redis配置调整以下选项，例如密码、数据库索引等
	client := redis.NewClient(&redis.Options{
		Addr:     connectString,               // Redis服务器地址和端口
		Password: global.App.Config.Redis.Pwd, // 密码，如果有的话
		DB:       global.App.Config.Redis.Db,  // 使用的数据库索引，默认为0
	})

	// 如果连接成功，将Redis客户端设置到全局变量中
	global.App.RedisClient = client
	return nil
}

package main

import (
	"github.com/fair-meme/fairmeme/apps/listener/bootstrap"
	"github.com/fair-meme/fairmeme/apps/listener/models"
	"fmt"
)

// 先从数据中读取表的信息
// 从数据库中读数据
// 如果数据数量不够 就等待 如果够了 就计算
// 1分钟的
// 5分钟的
// 1小时的
func main() {
	//初始化配置
	bootstrap.InitializeConfig()

	//init mysql
	err := bootstrap.InitializeMysql()
	if err != nil {
		panic(err)
	}
	fmt.Println("mysql init success!")

}
func GetTokenList() ([]models.Token, error) {
	return models.GetTokenList()

	//tokenList
}

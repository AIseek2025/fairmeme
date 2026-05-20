package bootstrap

import (
	"github.com/fair-meme/fairmeme/apps/listener/global"
	"database/sql"
	"fmt"
	_ "github.com/ClickHouse/clickhouse-go/v2"
	"log"
)

// func InitializeClickHouse(ctx context.Context) {
func InitializeClickHouseBack() error {
	// 配置ClickHouse连接字符串
	//connectString := "http://43.133.58.143:9000/default?username=default&password="
	//connectString := fmt.Sprintf("tcp://%s:%s?username=%s&password=%s&database=%s", global.App.Config.ClickHouse.Host, global.App.Config.ClickHouse.Port, global.App.Config.ClickHouse.User, global.App.Config.ClickHouse.Pwd, global.App.Config.ClickHouse.Dbname)
	connectString := fmt.Sprintf("tcp://%s:%s?username=%s&password=%s", global.App.Config.ClickHouse.Host, global.App.Config.ClickHouse.Port, global.App.Config.ClickHouse.User, global.App.Config.ClickHouse.Pwd)
	fmt.Println("hhhh")
	//connectString := "tcp://host:port?username=user&password=qwerty&database=yourdb"

	//connectionString := "tcp://user:qwerty@host:port/yourdb?debug=true"

	clickdb, err := sql.Open("clickhouse", connectString)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("hhhh1")
	// 连接到ClickHouse
	//db, err := sql.Open("clickhouse", connectString)
	if err != nil {
		//log.Fatal("Failed to connect to ClickHouse:", err)
		return fmt.Errorf("failed to open ClickHouse connection: %w", err)
	}
	fmt.Println("hhhh12")
	// 测试连接
	//err = clickdb.Ping()
	//if err != nil {
	//	return fmt.Errorf("failed to ping ClickHouse: %w", err)
	//}
	//fmt.Println("hhhh123")
	global.App.ClickHouseDb = clickdb
	return nil
}

func InitializeClickHouse() error {
	// 配置ClickHouse连接字符串
	connectString := fmt.Sprintf("tcp://%s:%s?username=%s&password=%s",
		global.App.Config.ClickHouse.Host, global.App.Config.ClickHouse.Port,
		global.App.Config.ClickHouse.User, global.App.Config.ClickHouse.Pwd)

	// 使用正确的驱动名称 "clickhouse"
	clickdb, err := sql.Open("clickhouse", connectString)
	if err != nil {
		return fmt.Errorf("failed to open ClickHouse connection: %w", err)
	}
	//defer clickdb.Close() // 确保在函数结束时关闭数据库连接

	global.App.ClickHouseDb = clickdb
	return nil
}

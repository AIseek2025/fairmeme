package bootstrap

import (
	"fmt"
	"github.com/fair-meme/fairmeme/apps/listener/global"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/schema"
)

func InitializeMysql() error {
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local&timeout=%s",
		global.App.Config.Mysql.User,
		global.App.Config.Mysql.Pwd,
		global.App.Config.Mysql.Host,
		global.App.Config.Mysql.Port,
		global.App.Config.Mysql.Dbname,
		"10s",
	)

	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{
		//SkipDefaultTransaction: true, //跳过事务提升性能
		NamingStrategy: schema.NamingStrategy{
			TablePrefix:   "fairmeme_", //表名前缀
			SingularTable: true,        //是否单数表明 默认users 现在user
			//NoLowerCase:   true, //不小写表名
		},
		//Logger: logger.Default.LogMode(logger.Info), //设置日志等级 这样运行就会显示日志 这会显示很多一般不用
	})
	if err != nil {
		return err
	}
	//第二种显示日志的方法
	//db.Session(&gorm.Session{
	//	Logger: logger.Default.LogMode(logger.Info),
	//})
	//第三种 使用他的时候就会有debug日志操作
	//db = db.Debug()

	global.App.MysqlDb = db
	return nil
}

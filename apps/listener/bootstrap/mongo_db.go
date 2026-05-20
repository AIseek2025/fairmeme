package bootstrap

import (
	"context"
	"github.com/fair-meme/fairmeme/apps/listener/global"
	"fmt"
	"go.mongodb.org/mongo-driver/mongo"
	m_options "go.mongodb.org/mongo-driver/mongo/options"
	"go.uber.org/zap"
)

const dbPrefix = "mongodb://"

func InitializeMongodb(ctx context.Context) {
	var err error
	//global.App.MongoClient, err = mongo.Connect(ctx, m_options.Client().ApplyURI(dbPrefix+global.App.Config.Mongodb.User+":"+global.App.Config.Mongodb.Pwd+"@"+global.App.Config.Mongodb.Host+":"+global.App.Config.Mongodb.Port).SetMaxPoolSize(20))
	global.App.MongoClient, err = mongo.Connect(ctx, m_options.Client().ApplyURI(dbPrefix+global.App.Config.Mongodb.Host+":"+global.App.Config.Mongodb.Port).SetMaxPoolSize(50))
	if err != nil {
		fmt.Println("mongodb connect failed, err:", zap.Any("err", err))
	}
	global.App.Mongodb = global.App.MongoClient.Database(global.App.Config.Mongodb.Dbname)
}

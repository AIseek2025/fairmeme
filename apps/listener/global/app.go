package global

import (
	"github.com/fair-meme/fairmeme/apps/listener/config"
	"database/sql"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/ethereum/go-ethereum/ethclient"
	"github.com/gagliardetto/solana-go/rpc"
	"github.com/go-redis/redis/v8"
	"github.com/spf13/viper"
	"go.mongodb.org/mongo-driver/mongo"
	"gorm.io/gorm"
)

type Application struct {
	ConfigViper     *viper.Viper
	Config          config.Configuration
	ClickHouseDb    *sql.DB
	MongoClient     *mongo.Client
	Mongodb         *mongo.Database
	MysqlDb         *gorm.DB
	EthRPCClient    *ethclient.Client
	ChainLinkClient *ethclient.Client
	MarketAbi       *abi.ABI
	MultiCallAbi    *abi.ABI
	SolRPC          *rpc.Client
	//SolWss          *ws.Client
	RedisClient *redis.Client
	S3Server    *s3.S3
}

var App = new(Application)

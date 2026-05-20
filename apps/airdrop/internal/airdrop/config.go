package airdrop

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/go-redis/redis/v8"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"

	"github.com/BurntSushi/toml"
)

var (
	GlobalDB    *gorm.DB
	GlobalRedis *redis.Client
)

type ChainInfo struct {
	Name    string `toml:"name"`
	ChainID uint64 `toml:"chain-id"`
	RpcUrl  string `toml:"rpc-url"`
}

type RedisConfig struct {
	Addr     string `toml:"addr"`
	Password string `toml:"password"`
	DB       int    `toml:"db"`
}

type DBConfig struct {
	Host     string `toml:"host"`
	Name     string `toml:"name"`
	Password string `toml:"password"`
	User     string `toml:"user"`
	Port     string `toml:"port"`
	SslMode  string `toml:"sslMode"`
}

type Config struct {
	Chains             []ChainInfo `toml:"chains"`
	ServerPort         string      `toml:"port"`
	SnapshotTime       int64       `toml:"snapshot-time"`
	SnapshotSlotChange int64       `toml:"snapshot-slot-change"`
	Redis              RedisConfig `toml:"redis"`
	DB                 DBConfig    `toml:"db"`
}

func LoadConfig(path string) (*Config, error) {
	var config Config
	if _, err := toml.DecodeFile(path, &config); err != nil {
		return nil, err
	}
	if err := config.Validate(); err != nil {
		return nil, err
	}
	return &config, nil
}

func (db DBConfig) Validate() error {
	if db.Host == "" {
		return errors.New("missing database host")
	}
	if db.User == "" {
		return errors.New("missing database user")
	}
	if db.Password == "" {
		return errors.New("missing database password")
	}
	if db.Name == "" {
		return errors.New("missing database name")
	}
	if db.Port == "" {
		return errors.New("missing database port")
	}
	if db.SslMode == "" {
		return errors.New("missing database sslMode")
	}
	return nil
}

func (r RedisConfig) Validate() error {
	if r.Addr == "" {
		return errors.New("missing redis address")
	}
	//if r.Password == "" {
	//	return errors.New("missing redis password")
	//}
	return nil
}

func (c Config) Validate() error {
	if c.ServerPort == "" {
		return errors.New("missing server-port")
	}
	if c.SnapshotTime == 0 {
		return errors.New("missing snapshot-time")
	}
	if c.SnapshotSlotChange == 0 {
		return errors.New("missing snapshot-slot-change")
	}
	if err := c.Redis.Validate(); err != nil {
		return err
	}
	if err := c.DB.Validate(); err != nil {
		return err
	}
	return nil
}

func InitGorm(dbConfig DBConfig) error {
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=%s TimeZone=UTC",
		dbConfig.Host, dbConfig.User, dbConfig.Password, dbConfig.Name, dbConfig.Port, dbConfig.SslMode)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		return err
	}

	GlobalDB = db
	return nil
}

func InitRedis(ctx context.Context, redisConfig RedisConfig) error {
	client := redis.NewClient(&redis.Options{
		Addr:     redisConfig.Addr,
		Password: redisConfig.Password,
		DB:       redisConfig.DB,
	})
	ctx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()
	if _, err := client.Ping(ctx).Result(); err != nil {
		return err
	}
	GlobalRedis = client
	return nil
}

func GetGormDB() *gorm.DB {
	return GlobalDB
}
func GetRedisClient() *redis.Client {
	return GlobalRedis
}

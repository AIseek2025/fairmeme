package db

import (
	"context"
	"fmt"
	"log/slog"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	gormlogger "gorm.io/gorm/logger"
)

type Database struct {
	logger *slog.Logger
	gormDB *gorm.DB
}

type Options struct {
	Logger   *slog.Logger
	Host     string
	Name     string
	Password string
	User     string
	Port     string
	SslMode  string
}

func Open(ctx context.Context, opts Options) (*Database, error) {
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=%s TimeZone=UTC",
		opts.Host, opts.User, opts.Password, opts.Name, opts.Port, opts.SslMode)
	gormConfig := gorm.Config{
		// The indexer will explicitly manage the transactions
		SkipDefaultTransaction: true,

		// The postgres parameter counter for a given query is represented with uint16,
		// resulting in a parameter limit of 65535. In order to avoid reaching this limit
		// we'll utilize a batch size of 3k for inserts, well below the limit as long as
		// the number of columns < 20.
		CreateBatchSize: 3_000,

		Logger: gormlogger.Default.LogMode(gormlogger.Silent),
	}

	gormDB, err := gorm.Open(postgres.Open(dsn), &gormConfig)
	if err != nil {
		return nil, fmt.Errorf("failed to connect to database: %w", err)
	}
	// Auto migrations
	if err := AutoMigrate(gormDB); err != nil {
		return nil, fmt.Errorf("auto migrate failed: %w", err)
	}
	return &Database{
		logger: opts.Logger,
		gormDB: gormDB,
	}, nil
}

func AutoMigrate(gormDB *gorm.DB) error {
	return gormDB.AutoMigrate(
		&UpstreamState{},
		&UpstreamBalanceChange{},
		&BackfillBalanceChange{},
		&UserAirdrop{},
		&Token{},
	)
}

func (d *Database) Close() error {
	d.logger.Info("closing database")
	sql, err := d.gormDB.DB()
	if err != nil {
		return err
	}

	return sql.Close()
}

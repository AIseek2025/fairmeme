package internal

import (
	"github.com/fair-meme/fairmeme/apps/api/internal/model"
	"github.com/fair-meme/fairmeme/apps/api/internal/service"
	"fmt"
)

func example() {

	//clickhouse
	ch := model.GetClickHouse()
	ch.Query("SELECT COUNT(*) FROM `stock_min_data_5`")

	//aws
	s3Server := service.GetS3()
	fmt.Println(s3Server)
}

package controllers

import (
	"context"
	"github.com/fair-meme/fairmeme/apps/listener/global"
	"github.com/fair-meme/fairmeme/apps/listener/utils"
	"fmt"
	"strconv"
	"time"
)

func SetSolPriceToRedis() {
	solPrice, err := utils.FormatSolPrice()
	if err != nil {
		fmt.Println("FormatSolPrice err:", err)
	}
	fmt.Println("价格:", fmt.Sprintf("%.2f", solPrice))
	global.App.RedisClient.Set(context.Background(), "solPrice", fmt.Sprintf("%.2f", solPrice), 0)
	go func() {
		for {
			solPrice, err = utils.FormatSolPrice()
			if err != nil {
				fmt.Println("FormatSolPrice err:", err)
			}
			global.App.RedisClient.Set(context.Background(), "solPrice", fmt.Sprintf("%.2f", solPrice), 0)
			time.Sleep(500 * time.Millisecond)
		}
	}()
}

func GetSolPriceByRedis() (float64, error) {
	val, err := global.App.RedisClient.Get(context.Background(), "solPrice").Result()
	if err != nil {
		fmt.Println("获取失败:", err)
		return -1, err
	}
	solPrice, err := strconv.ParseFloat(val, 64)
	if err != nil {
		return -1, err
	}
	return solPrice, nil

}

func SetSlotToRedis() {
	nowSlot, err := global.App.SolRPC.GetSlot(context.Background(), "")
	if err != nil {
		fmt.Println("GetSlot err:", err)
	}
	fmt.Println("now slot:", nowSlot)
	global.App.RedisClient.Set(context.Background(), "slot", nowSlot, 0)
	go func() {
		for {
			nowSlot, err = global.App.SolRPC.GetSlot(context.Background(), "")
			if err != nil {
				fmt.Println("GetSlot err:", err)
			}

			global.App.RedisClient.Set(context.Background(), "slot", nowSlot, 0)
			time.Sleep(300 * time.Millisecond)
		}
	}()

}
func GetSlotByRedis() (int64, error) {
	val, err := global.App.RedisClient.Get(context.Background(), "slot").Result()
	if err != nil {
		fmt.Println("获取失败:", err)
		return -1, err
	}
	slot, err := strconv.ParseInt(val, 10, 64)
	if err != nil {
		return -1, err
	}
	return slot, nil

}

func SetTokenPrice(tokenAddress, price string) {
	global.App.RedisClient.Set(context.Background(), tokenAddress, price, 0)
}

func GetTokenPrice(tokenAddress string) (float64, error) {
	val, err := global.App.RedisClient.Get(context.Background(), "tokenAddress").Result()
	if err != nil {
		fmt.Println("获取失败:", err)
		return -1, err
	}
	price, err := strconv.ParseFloat(val, 64)
	if err != nil {
		return -1, err
	}
	return price, nil
}

package controllers

import (
	"github.com/fair-meme/fairmeme/apps/listener/models"
	"fmt"
	"time"
)

func LoopReadTrade() {
	for true {
		tradeList, err := models.GetTradeByStatus(0)
		if err != nil {
			continue
		}
		//fmt.Println("获取长度:", len(*tradeList))
		for _, trade := range *tradeList {
			err = models.UpdateSolAmount(trade)
			if err != nil {
				fmt.Println("UpdateSolAmount err:", err)
			}
		}
		time.Sleep(5 * time.Second)
	}
}

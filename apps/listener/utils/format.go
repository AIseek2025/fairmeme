package utils

import (
	"github.com/fair-meme/fairmeme/apps/listener/contract"
	"errors"
	"fmt"
	"math/big"
	"time"
)

func FormatDuration(d int64) string {
	minute := d / 60
	if minute < 1 {
		return fmt.Sprintf("%ds", d)
	}
	hour := minute / 60
	if hour < 1 {
		return fmt.Sprintf("%dm", minute)
	}

	day := hour / 24
	if day < 1 {
		return fmt.Sprintf("%dh", hour)
	}
	year := day / 365

	if year < 1 {
		return fmt.Sprintf("%dd", day)
	} else {
		return fmt.Sprintf("%dy", year)
	}
}
func FormatSolPrice() (*big.Float, error) {
	decimalSolPrice, err := contract.GetSolPriceByChainLink()
	if err != nil {
		return nil, errors.New("GetSolPriceByChainLink err:" + err.Error())
	}
	solPrice := new(big.Float).Quo(new(big.Float).SetInt(decimalSolPrice), new(big.Float).SetInt64(100000000))
	return solPrice, nil
}
func FormatUnit(value *big.Float) string {
	k := new(big.Float).Quo(value, new(big.Float).SetFloat64(1000))
	if k.Cmp(new(big.Float).SetFloat64(1)) == -1 {
		return fmt.Sprintf("%.2f", value)
	}
	m := new(big.Float).Quo(k, new(big.Float).SetFloat64(1000))
	if m.Cmp(new(big.Float).SetFloat64(1)) == -1 {
		return fmt.Sprintf("%.2fk", k)
	} else {
		return fmt.Sprintf("%.2fm", m)
	}
}
func FormatFloatUnit(value float64) string {
	k := value / 1000
	if k < 1 {
		return fmt.Sprintf("%v", value)
	}
	m := k / 1000
	if m < 1 {
		return fmt.Sprintf("%.2fk", k)
	} else {
		return fmt.Sprintf("%.2fm", m)
	}
}

func FormatScale(value *big.Float) string {
	if value.Cmp(new(big.Float).SetFloat64(0)) > 0 {
		return fmt.Sprintf("+%.2f", value) + "%"
	} else {
		return fmt.Sprintf("%.2f", value) + "%"
	}

}

// calculateTimestampForHoursAgo 根据当前slot编号和slot持续时间计算n小时前的时间戳
func CalculateTimestampForHoursAgo(currentSlot int64, slotDurationSeconds int64, hoursAgo int64) int64 {
	// 将小时转换为秒
	secondsAgo := int64(hoursAgo) * 60 * 60

	// 计算n小时前所在的slot编号
	slotsAgo := secondsAgo / slotDurationSeconds

	// 计算n小时前所在的slot的开始时间（如果slotDurationSeconds不能整除secondsAgo，需要特殊处理）
	remainingSeconds := secondsAgo % slotDurationSeconds

	// 计算n小时前所在的slot编号
	slotAgo := currentSlot - slotsAgo

	// 如果剩余秒数不为0，说明n小时前的slot已经开始了一段时间，需要减去剩余的秒数对应的slot内时间
	if remainingSeconds > 0 {
		slotAgo--
	}

	// 如果slotAgo小于0，说明计算结果超出了slot编号的范围，可能需要特殊处理
	if slotAgo < 0 {
		slotAgo = 0
	}

	// 获取当前时间的时间戳（秒）
	currentTimestamp := time.Now().Unix()

	// 计算n小时前的时间戳
	timestampAgo := currentTimestamp - int64(slotAgo*slotDurationSeconds)

	return timestampAgo
}

package utils

import "github.com/shopspring/decimal"

func Float64Add(x float64, y float64) float64 {
	sum := x
	decimalValue := decimal.NewFromFloat(sum)
	decimalTemp := decimal.NewFromFloat(y)
	decimalValue = decimalValue.Add(decimalTemp)
	sum, _ = decimalValue.Float64()
	return sum
}

// Float64Mod x%y
func Float64Mod(x float64, y float64) float64 {
	res := x
	decimalValue := decimal.NewFromFloat(res)
	decimalTemp := decimal.NewFromFloat(y)
	decimalValue = decimalValue.Mod(decimalTemp)
	res, _ = decimalValue.Float64()
	return res
}

// Float64Div x/y
func Float64Div(x float64, y float64) float64 {
	res := x
	decimalValue := decimal.NewFromFloat(res)
	decimalTemp := decimal.NewFromFloat(y)
	decimalValue = decimalValue.Div(decimalTemp)
	res, _ = decimalValue.Float64()
	return res
}

// Float64Mul x*y
func Float64Mul(x float64, y float64) float64 {
	res := x
	decimalValue := decimal.NewFromFloat(res)
	decimalTemp := decimal.NewFromFloat(y)
	decimalValue = decimalValue.Mul(decimalTemp)
	res, _ = decimalValue.Float64()
	return res
}

// Float64Sub x-y
func Float64Sub(x float64, y float64) float64 {
	res := x
	decimalValue := decimal.NewFromFloat(res)
	decimalTemp := decimal.NewFromFloat(y)
	decimalValue = decimalValue.Sub(decimalTemp)
	res, _ = decimalValue.Float64()
	return res
}

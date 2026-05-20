package types

type GetPriceResponse struct {
	TokenAddress string `json:"tokenAddress"`
	SolAmount    string `json:"solAmount"`
	TokenAmount  string `json:"tokenAmount"`
	Price        string `json:"price"`
}

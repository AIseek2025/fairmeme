package config

// https://www.printlove.cn/tools/yaml2go
// 使用工具转换

type App struct {
	Env     string `mapstructure:"app" json:"app" yaml:"env"`
	Port    string `mapstructure:"port" json:"port" yaml:"port"`
	AppName string `mapstructure:"app_name" json:"app_name" yaml:"app_name"`
	AppUrl  string `mapstructure:"app_url" json:"app_url" yaml:"app_url"`
}

package config

type Configuration struct {
	App        App         `mapstructure:"app" json:"app" yaml:"app"`
	Mongodb    Mongodb     `mapstructure:"mongodb" json:"mongodb" yaml:"mongodb"`
	Mysql      Mysql       `mapstructure:"mysql" json:"mysql" yaml:"mysql"`
	ClickHouse ClickHouse  `mapstructure:"clickHouse" json:"clickHouse" yaml:"clickHouse"`
	Redis      RedisClient `mapstructure:"redis" json:"redis" yaml:"redis"`
	AwsS3      AwsS3       `mapstructure:"awss3" json:"awss3" yaml:"awss3"`
	Chains     Chains      `mapstructure:"chains" json:"chains" yaml:"chains"`
}
type Mongodb struct {
	Host   string `mapstructure:"host" json:"host" yaml:"host"`
	Port   string `mapstructure:"port" json:"port" yaml:"port"`
	Dbname string `mapstructure:"dbname" json:"dbname" yaml:"dbname"`
	User   string `mapstructure:"user" json:"user" yaml:"user"`
	Pwd    string `mapstructure:"pwd" json:"pwd" yaml:"pwd"`
}
type ClickHouse struct {
	Host   string `mapstructure:"host" json:"host" yaml:"host"`
	Port   string `mapstructure:"port" json:"port" yaml:"port"`
	Dbname string `mapstructure:"dbname" json:"dbname" yaml:"dbname"`
	User   string `mapstructure:"user" json:"user" yaml:"user"`
	Pwd    string `mapstructure:"pwd" json:"pwd" yaml:"pwd"`
}
type Mysql struct {
	Host   string `mapstructure:"host" json:"host" yaml:"host"`
	Port   string `mapstructure:"port" json:"port" yaml:"port"`
	Dbname string `mapstructure:"dbname" json:"dbname" yaml:"dbname"`
	User   string `mapstructure:"user" json:"user" yaml:"user"`
	Pwd    string `mapstructure:"pwd" json:"pwd" yaml:"pwd"`
}
type RedisClient struct {
	Host string `mapstructure:"host" json:"host" yaml:"host"`
	Port string `mapstructure:"port" json:"port" yaml:"port"`
	Db   int    `mapstructure:"db" json:"db" yaml:"db"`
	User string `mapstructure:"user" json:"user" yaml:"user"`
	Pwd  string `mapstructure:"pwd" json:"pwd" yaml:"pwd"`
}
type AwsS3 struct {
	AccessKeyID     string `mapstructure:"access_key_id" json:"access_key_id" yaml:"access_key_id"`
	SecretAccessKey string `mapstructure:"secret_access_key" json:"secret_access_key" yaml:"secret_access_key"`
	BucketName      string `mapstructure:"bucket_name" json:"bucket_name" yaml:"bucket_name"`
	Region          string `mapstructure:"region" json:"region" yaml:"region"`
}

type Chains struct {
	EthereumRPC  string `mapstructure:"ethereum_rpc" json:"ethereum_rpc" yaml:"ethereum_rpc"`
	ChainlinkRPC string `mapstructure:"chainlink_rpc" json:"chainlink_rpc" yaml:"chainlink_rpc"`
	SolanaRPC    string `mapstructure:"solana_rpc" json:"solana_rpc" yaml:"solana_rpc"`
	SolanaWS     string `mapstructure:"solana_ws" json:"solana_ws" yaml:"solana_ws"`
}

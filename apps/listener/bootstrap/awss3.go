package bootstrap

import (
	"github.com/fair-meme/fairmeme/apps/listener/global"
	"fmt"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
)

func InitAwsS3() {
	// 配置 S3 session
	sess, err := session.NewSession(&aws.Config{
		Region: aws.String(global.App.Config.AwsS3.Region), // 替换为你的 S3 存储桶所在区域
		Credentials: credentials.NewStaticCredentials(
			global.App.Config.AwsS3.AccessKeyID,
			global.App.Config.AwsS3.SecretAccessKey,
			"",
		),
	})
	if err != nil {
		fmt.Println("Failed to create session,", err)
		return
	}

	global.App.S3Server = s3.New(sess)
}

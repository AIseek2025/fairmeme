package service

import (
	"github.com/fair-meme/fairmeme/apps/api/internal/config"
	"fmt"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
	"sync"
)

var (
	s3Server *s3.S3
	once     sync.Once
)

func InitAwsS3() {
	// 配置 S3 session
	sess, err := session.NewSession(&aws.Config{
		Region: aws.String(config.Get().AwsS3.Region), // 替换为你的 S3 存储桶所在区域
		Credentials: credentials.NewStaticCredentials(
			config.Get().AwsS3.AccessKeyID,
			config.Get().AwsS3.SecretAccessKey,
			"",
		),
	})
	if err != nil {
		fmt.Println("Failed to create session,", err)
		return
	}

	s3Server = s3.New(sess)
}

// GetS3 get s3
func GetS3() *s3.S3 {
	if s3Server == nil {
		once.Do(func() {
			InitAwsS3()
		})
	}

	return s3Server
}

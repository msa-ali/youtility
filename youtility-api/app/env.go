package app

import (
	"fmt"
	"os"

	"github.com/Altamashattari/youtility/logger"
	"github.com/joho/godotenv"
)

type Environment int

const (
	DEVELOPMENT = iota
	PRODUCTION
)

const (
	YOUTUBE_DATA_API_KEY = "YOUTUBE_DATA_API_KEY"
	ALLOWED_ORIGIN       = "ALLOWED_ORIGIN"
)

var config map[string]string
var mode Environment

func loadEnv() {
	err := godotenv.Load(".env")
	if err != nil {
		logger.Error("error while loading env vars. Err: %s" + err.Error())
		os.Exit(1)
	}
	if os.Getenv("WEBSITE_SITE_NAME") == "" {
		mode = DEVELOPMENT
	} else {
		mode = PRODUCTION
	}
	sanityCheck()
}

func sanityCheck() {
	// if mode == DEVELOPMENT {
	// 	config = map[string]string{
	// 		YOUTUBE_DATA_API_KEY: "YOUTUBE_DATA_API_KEY",
	// 		ALLOWED_ORIGIN:       "ALLOWED_ORIGIN",
	// 	}
	// } else {
	// 	config = map[string]string{
	// 		YOUTUBE_DATA_API_KEY: "APPSETTING_YOUTUBE_DATA_API_KEY",
	// 		ALLOWED_ORIGIN:       "APPSETTING_ALLOWED_ORIGIN",
	// 	}
	// }
	config = map[string]string{
		YOUTUBE_DATA_API_KEY: "YOUTUBE_DATA_API_KEY",
		ALLOWED_ORIGIN:       "ALLOWED_ORIGIN",
	}
	for _, value := range config {
		logger.Info(fmt.Sprintf("Checking if Env variable is defined for '%s'", value))
		if os.Getenv(value) == "" {
			logger.Error(fmt.Sprintf("Environmental variable for '%s' is not defined", value))
			os.Exit(1)
		}
	}
}

func getEnvironment() string {
	if mode == DEVELOPMENT {
		return "dev"
	} else {
		return "prod"
	}
}

package main

import (
	"github.com/Altamashattari/youtility/app"
	"github.com/Altamashattari/youtility/logger"
)

func main() {
	logger.Info("Initiating the server...")
	app.Start()
}

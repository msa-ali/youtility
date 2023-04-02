package service

import (
	"errors"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"os"

	"github.com/Altamashattari/youtility/logger"
	ytd "github.com/kkdai/youtube/v2"
	"google.golang.org/api/googleapi/transport"
	"google.golang.org/api/youtube/v3"
)

type YoutubeVideoDetail struct {
	VideoId    string `json:"videoId"`
	Title      string `json:"title"`
	Thumbnail  string `json:"thumbnail"`
	Definition string `json:"definition"`
	Duration   string `json:"duration"`
}

func getYoutubeService() (*youtube.Service, error) {
	youtubeDataApiKey := os.Getenv("YOUTUBE_DATA_API_KEY")
	httpClient := &http.Client{
		Transport: &transport.APIKey{
			Key: youtubeDataApiKey,
		},
	}
	service, err := youtube.New(httpClient)
	if err != nil {
		return nil, err
	}
	return service, nil
}

type YoutubeService struct {
	service *youtube.Service
}

func NewYoutubeService() (*YoutubeService, error) {
	service, err := getYoutubeService()
	if err != nil {
		return nil, err
	}
	return &YoutubeService{service}, nil
}

func extractVideoIdFromURL(videoURL string) (videoId string, err error) {
	u, err := url.Parse(videoURL)
	if err != nil {
		return "", err
	}
	videoId = u.Query().Get("v")
	return
}

func getVideoDetails(data *youtube.VideoListResponse) (*[]YoutubeVideoDetail, error) {
	// videos := make([]YoutubeVideoDetail, len(data.Items))
	var videos []YoutubeVideoDetail
	if len(data.Items) == 0 {
		return nil, errors.New("content not found")
	}
	for _, video := range data.Items {
		videos = append(videos, YoutubeVideoDetail{
			VideoId:    video.Id,
			Title:      video.Snippet.Title,
			Definition: video.ContentDetails.Definition,
			Thumbnail:  video.Snippet.Thumbnails.Medium.Url,
			Duration:   video.ContentDetails.Duration,
		})
	}
	return &videos, nil
}

func (ytService *YoutubeService) GetYoutubeVideoDetails(videoURL string, part []string) (*[]YoutubeVideoDetail, error) {
	// parse video id from the URL
	videoId, err := extractVideoIdFromURL(videoURL)
	if err != nil {
		return nil, err
	}
	data, err := ytService.service.Videos.List(part).Id(videoId).Do()
	if err != nil {
		return nil, err
	}
	videos, err := getVideoDetails(data)
	if err != nil {
		return nil, err
	}
	return videos, nil
}

func DownloadYoutubeVideo(w http.ResponseWriter, videoURL string) error {

	errHandler := func(err error) error {
		logger.Error("Error copying video data: %v" + err.Error())
		return err
	}

	client := ytd.Client{}
	videoId, err := extractVideoIdFromURL(videoURL)
	if err != nil {
		logger.Error("Error while extracting video id from url: " + err.Error())
		return err
	}
	video, err := client.GetVideo(videoId)

	if err != nil {
		return errHandler(err)
	}
	formats := video.Formats.WithAudioChannels()
	stream, _, err := client.GetStream(video, &formats[0])

	if err != nil {
		return errHandler(err)
	}
	w.Header().Set("Content-Type", "video/mp4")
	w.Header().Set("Content-Disposition", fmt.Sprintf("attachment; filename=%s.mp4", video.Title))

	bufferSize := 1024 * 1000 // 2MB buffer size
	buffer := make([]byte, bufferSize)

	_, err = io.CopyBuffer(w, stream, buffer)
	if err != nil {
		return errHandler(err)
	}

	logger.Info("Video downloaded successfully!\n")
	return nil
}

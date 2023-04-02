package service

import (
	"errors"
	"net/http"
	"net/url"
	"os"

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
			Thumbnail:  video.Snippet.Thumbnails.Default.Url,
			Duration:   video.ContentDetails.Duration,
		})
	}
	return &videos, nil
}

func (ytService *YoutubeService) GetYoutubeVideoDetails(videoURL string, part []string) (*[]YoutubeVideoDetail, error) {
	// parse video id from the URL
	u, err := url.Parse(videoURL)
	if err != nil {
		return nil, err
	}
	videoId := u.Query().Get("v")
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

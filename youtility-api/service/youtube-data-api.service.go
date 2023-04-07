package service

import (
	"errors"
	"net/http"
	"os"
	"sync"

	ytd "github.com/kkdai/youtube/v2"
	"google.golang.org/api/googleapi/transport"
	"google.golang.org/api/youtube/v3"
)

func getYoutubeDataAPIService() (*youtube.Service, error) {
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

func NewYoutubeService() (*YoutubeService, error) {
	service, err := getYoutubeDataAPIService()
	if err != nil {
		return nil, err
	}
	return &YoutubeService{service}, nil
}

func getVideoDetails(data *youtube.VideoListResponse) (*[]YoutubeVideoDetail, error) {
	var videos []YoutubeVideoDetail
	if len(data.Items) == 0 {
		return nil, errors.New("content not found")
	}
	client := ytd.Client{}
	for _, video := range data.Items {
		formats, _ := getAvailableFormats(video.Id, client)
		videos = append(videos, YoutubeVideoDetail{
			VideoId:   video.Id,
			Title:     video.Snippet.Title,
			Thumbnail: video.Snippet.Thumbnails.Medium.Url,
			Duration:  0, //video.ContentDetails.Duration,
			Formats:   formats,
		})
	}
	return &videos, nil
}

func (ytService *YoutubeService) GetYoutubeVideoDetailsUsingYoutubeDataAPI(videoURL string) (*[]YoutubeVideoDetail, error) {
	// parse video id from the URL
	videoId, err := extractVideoIdFromURL(videoURL, "v")
	if err != nil {
		return nil, err
	}
	data, err := ytService.service.Videos.List([]string{"snippet", "contentDetails"}).Id(videoId).Do()
	if err != nil {
		return nil, err
	}
	videos, err := getVideoDetails(data)
	if err != nil {
		return nil, err
	}
	return videos, nil
}

func (ytService *YoutubeService) GetYoutubePlaylistDetailsUsingYoutubeDataAPI(playlistUrl string) (*[]YoutubeVideoDetail, error) {
	playlistId, err := extractVideoIdFromURL(playlistUrl, "list")
	if err != nil {
		return nil, err
	}
	playlistItemsCall := ytService.
		service.
		PlaylistItems.
		List([]string{"snippet"}).
		PlaylistId(playlistId).
		MaxResults(50)

	var allVideos []*youtube.PlaylistItem

	for {
		playlistItemsResponse, err := playlistItemsCall.Do()
		if err != nil {
			panic(err)
		}
		allVideos = append(allVideos, playlistItemsResponse.Items...)
		nextPageToken := playlistItemsResponse.NextPageToken
		if nextPageToken == "" {
			break
		}
		playlistItemsCall.PageToken(nextPageToken)
	}
	var wg sync.WaitGroup
	var res []YoutubeVideoDetail
	for _, item := range allVideos {
		wg.Add(1)
		func(item *youtube.PlaylistItem) {
			defer wg.Done()
			videoResponse, err := ytService.service.Videos.
				List([]string{"snippet", "contentDetails"}).
				Id(item.Snippet.ResourceId.VideoId).Do()
			if err != nil {
				return
			}
			data, err := getVideoDetails(videoResponse)
			if err != nil {
				return
			}
			res = append(res, *data...)
		}(item)
	}
	wg.Wait()
	return &res, nil
}

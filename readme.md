# Youtility

<img src="preview.jpeg"  width="600" height="300">

Youtility is a web application built with Next.JS and Golang that provides a simple UI interface to download YouTube videos or playlists by URL. It provides support for multiple video qualities and audio as well.

## Getting Started

To run Youtility on your machine, you need to have Node.js and Golang installed. Then, follow these steps:

### Clone this repository:

`git clone https://github.com/msa-ali/youtility.git`

### Setup Backend API

- cd `youtility-api`
- Create `.env` file and add these contents:

```.env
YOUTUBE_DATA_API_KEY=[Your_Youtube_Data_API_Key]
SERVER_ADDRESS=0.0.0.0 
SERVER_PORT=80
ALLOWED_ORIGIN=http://localhost:3000,http://localhost:3001
```

- `go run main.go`

- If you want to use docker, make sure `docker-desktop` is running in your machine, then run:

`make build`
`make run`

### Setup Frontend App

- cd `youtility-web-app`
- Install the dependencies.
- Open <http://localhost:3000> with your browser to see the app.

## Usage

To download a YouTube video or playlist, simply copy its URL and paste it in the input field on the home page of Youtility. Then, select the format you want to download the video in, and click the "Download" button. The app will start processing your request, and start downloading the media file.

## Features

- Download YouTube videos and playlists by URL
- Support for multiple formats such as video and audio.
- User-friendly interface

## Contributing

If you want to contribute to Youtility, feel free to open an issue or submit a pull request. We welcome any contributions that can improve the app and make it more useful for users.

## License

Youtility is licensed under the [MIT License](https://opensource.org/license/mit/).

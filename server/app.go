package main

import (
	"log"
	"net/http"
	"os"

	"github.com/BurntSushi/toml"
)

func main() {
	// hello world
	http.HandleFunc("/", helloworld)

	// pong
	http.HandleFunc("/api/ping", pingpong)

	// get last10 posts
	http.HandleFunc("/api/posts", getlast10posts)

	// get post
	http.HandleFunc("/api/post/", getpost)

	// add post
	http.HandleFunc("/api/post/new", addpost)

	// add post
	http.HandleFunc("/api/post/edit", updatepost)

	// add subscriber
	http.HandleFunc("/api/subscribe/new", addSubscriber)

	// handle image uploads
	http.HandleFunc("/api/multiple", handleUpload)

	// recaptcha confirmation
	http.HandleFunc("/api/apply", recaptchaconfirmation)

	// signup and subscribe customer
	http.HandleFunc("/api/user/new", subscribeuser)

	http.HandleFunc("/api/current/user", getuser)

	// listen on socket
	port := os.Getenv("PORT")
	if port == "" {
		port = "8000" // Setting a Default port to 8000 to be used locally
	}

	http.ListenAndServe(":"+port, nil)

}
func (c *Config) Read() {
	if _, err := toml.DecodeFile("./config/config.toml", &c); err != nil {
		log.Fatal(err)
	}
}

var config = Config{}

func init() {
	config.Read()
}
package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/BurntSushi/toml"
)

var stripesecretkey = ""
var sendgridkey = ""

func main() {

	for _, element := range os.Environ() {
		variable := strings.Split(element, "=")
		if variable[0] == "APP_ENV" {
			fmt.Println(len(variable[1]))
			if variable[1] == "local " {
				stripesecretkey = config.StripeLocalSecretKey
				sendgridkey = config.SendgridLocalKey
			} else if variable[1] == "local" {
				stripesecretkey = config.StripeLocalSecretKey
				sendgridkey = config.SendgridLocalKey
			} else if variable[1] == "dev " {
				stripesecretkey = config.StripeDevSecretKey
				sendgridkey = config.SendgridDevKey
			} else if variable[1] == "dev" {
				stripesecretkey = config.StripeDevSecretKey
				sendgridkey = config.SendgridDevKey
			} else if variable[1] == "prod " {
				stripesecretkey = config.StripeProdSecretKey
				sendgridkey = config.SendgridProdKey
			} else if variable[1] == "prod" {
				stripesecretkey = config.StripeProdSecretKey
				sendgridkey = config.SendgridProdKey
			} else {
				fmt.Println("NO APP_ENV found!")
			}
		}
	}

	http.HandleFunc("/", helloworld)

	http.HandleFunc("/api/analytics/", googleanalyticsproxy)

	// pong
	http.HandleFunc("/api/ping", pingpong)

	// get last10 posts
	http.HandleFunc("/api/posts", getlast10posts)

	// get post
	http.HandleFunc("/api/post/", getpost)

	// add post
	http.HandleFunc("/api/post/new", addpost)

	// edit post
	http.HandleFunc("/api/post/edit", updatepost)

	// add email address to firestore for an email list
	http.HandleFunc("/api/subscribe/new", addSubscriber)

	// recaptcha confirmation
	http.HandleFunc("/api/recaptcha", recaptchaconfirmation)

	// This creates user in Stripe, Creates their Payment Method
	// Adds user to Plan
	http.HandleFunc("/api/user/new", subscribeuser)

	http.HandleFunc("/api/accounts/create", accountcreate)

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

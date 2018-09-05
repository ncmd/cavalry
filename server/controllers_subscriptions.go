package main

import (
	"context"
	"encoding/json"
	"log"
	"net/http"

	firebase "firebase.google.com/go"
	"google.golang.org/api/option"
)

// add email subscribers
func addSubscriber(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST,OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	sa := option.WithCredentialsFile("./firestore.json")
	app, err := firebase.NewApp(context.Background(), nil, sa)
	if err != nil {
		log.Fatalln(err)
	}
	client, err := app.Firestore(context.Background())
	if err != nil {
		log.Fatalln(err)
	}
	defer client.Close()

	var subscribe Subscriber
	decoder := json.NewDecoder(r.Body)
	decoder.Decode(&subscribe)
	if err != nil {
		panic(err)
	}

	log.Println("Received Request!")
	if r.Method != "OPTIONS" {
		client.Collection("subscribers").Add(context.Background(), map[string]interface{}{
			"email": subscribe.Email,
		})
		log.Println("Subscribed Email:", subscribe.Email)
	}
}

// subscribe user
func subscribeuser(w http.ResponseWriter, r *http.Request) {
	w.Header().Add("Access-Control-Allow-Origin", "*")
	w.Header().Add("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Add("Access-Control-Allow-Headers", "Content-Type")

	if r.Method != "OPTIONS" {
		var user User

		log.Println("Response Body:", r.Method)
		decoder := json.NewDecoder(r.Body)
		decoder.Decode(&user)
		log.Println("User:", user)
		log.Println("User Email:", user.Email)
		newSubscriber(createCustomer(user.Email, createSource(user.Email)))
	}
}

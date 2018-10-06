package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	firebase "firebase.google.com/go"
	"google.golang.org/api/option"
)

func c_requests_fetch_last_10_requests_from_firestore(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET,OPTIONS")
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

	if r.Method != "OPTIONS" {
		dsnap, err := client.Collection("aggregation").Doc("requests").Get(context.Background())
		if err != nil {
			fmt.Printf("Error: %#v\n", err)
		}
		m := dsnap.Data()

		last100 := m["last100"]

		js, err := json.MarshalIndent(last100, "", "    ")
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.Write(js)
	}
}

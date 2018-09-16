package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strings"

	"cloud.google.com/go/firestore"
	firebase "firebase.google.com/go"
	"google.golang.org/api/option"
)

// get last 10 posts
func getlast10posts(w http.ResponseWriter, r *http.Request) {
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
		dsnap, err := client.Collection("aggregation").Doc("posts").Get(context.Background())
		if err != nil {
			fmt.Printf("Error: %#v\n", err)
		}
		m := dsnap.Data()

		last10 := m["last10"]

		js, err := json.MarshalIndent(last10, "", "    ")
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.Write(js)
	}
}

func getpost(w http.ResponseWriter, r *http.Request) {
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
		var post Post

		log.Println("Response Body:", r.Method)
		decoder := json.NewDecoder(r.Body)
		decoder.Decode(&post)

		var postID = strings.Split(r.URL.Path, "/")

		dsnap, err := client.Collection("posts").Doc(postID[3]).Get(context.Background())
		if err != nil {
			fmt.Printf("Error: %#v\n", err)
		}
		m := dsnap.Data()
		fmt.Println(m)

		// last10 := m["last10"]
		//
		js, err := json.MarshalIndent(m, "", "    ")
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.Write(js)
	}
}

// get last 10 posts
func addpost(w http.ResponseWriter, r *http.Request) {
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

	var post Post
	decoder := json.NewDecoder(r.Body)
	decoder.Decode(&post)
	if err != nil {
		panic(err)
	}
	log.Println("Received Request!")
	if r.Method != "OPTIONS" {
		ref := client.Collection("posts").NewDoc()
		_, err := ref.Set(context.Background(), map[string]interface{}{
			"id":          ref.ID,
			"title":       post.Title,
			"description": post.Description,
			"tags":        post.Tags,
			"objectives":  post.Objectives,
		})
		if err != nil {
			fmt.Println(err)
		}
		log.Println("Added Post!")
	}

}

func updatepost(w http.ResponseWriter, r *http.Request) {
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

	var post Post
	decoder := json.NewDecoder(r.Body)
	decoder.Decode(&post)
	if err != nil {
		panic(err)
	}
	log.Println("Received Request!")
	if r.Method != "OPTIONS" {
		// Get a new write batch.
		batch := client.Batch()

		// Set the value
		ref := client.Collection("posts").Doc(post.Id)
		batch.Set(ref, map[string]interface{}{
			"id":          post.Id,
			"title":       post.Title,
			"description": post.Description,
			"tags":        post.Tags,
			"objectives":  post.Objectives,
		}, firestore.MergeAll)

		// Commit the batch.
		_, err := batch.Commit(context.Background())
		if err != nil {
			return
		}
		log.Println("Updated Post!")
	}
}
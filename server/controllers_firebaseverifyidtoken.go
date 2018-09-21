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

// https://firebase.google.com/docs/auth/admin/verify-id-tokens
func controllers_firebaseverifyidtoken_handle_verify_token_with_firebase(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST,OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	sa := option.WithCredentialsFile("./firestore.json")
	app, err := firebase.NewApp(context.Background(), nil, sa)
	if err != nil {
		log.Fatalln(err)
	}

	client, err := app.Auth(context.Background())
	if err != nil {
		log.Fatalf("error getting Auth client: %v\n", err)
	}

	if r.Method != "OPTIONS" {
		var verifytoken VerifyToken
		decoder := json.NewDecoder(r.Body)
		decoder.Decode(&verifytoken)

		fmt.Println("VerifyToken =", verifytoken)
		token, err := client.VerifyIDToken(context.Background(), verifytoken.Token)
		if err != nil {
			log.Fatalf("error verifying ID token: %v\n", err, verifytoken.Token)
			response := FailedToken{"failed"}
			js, err := json.Marshal(response)
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			w.Write(js)
		}
		js, err := json.Marshal(token)
		w.Write(js)
		log.Printf("Verified ID token: %v\n", token)
	}

}

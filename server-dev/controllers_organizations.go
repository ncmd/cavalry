package main

import (
	"fmt"
	"net/http"
)

// hello world
func controllers_organizations_create(w http.ResponseWriter, r *http.Request) {
	w.Header().Add("Access-Control-Allow-Origin", "*")
	w.Header().Add("Access-Control-Allow-Methods", "GET,OPTIONS")
	w.Header().Add("Access-Control-Allow-Headers", "Content-Type")
	fmt.Fprintln(w, "Hello, World!")
}

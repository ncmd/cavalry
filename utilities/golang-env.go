package main

import "os"

import "fmt"

func main() {

	// To set a key/value pair, use `os.Setenv`. To get a
	// value for a key, use `os.Getenv`. This will return
	// an empty string if the key isn't present in the
	// environment.
	// os.Setenv("SENDGRID_API_KEY", )
	fmt.Println("SENDGRID_API_KEY:", os.Getenv("SENDGRID_API_KEY"))
}

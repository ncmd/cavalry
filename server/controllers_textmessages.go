package main

import (
	"log"
	"net/smtp"
)

// <<<<<<<<<<<< Phone >>>>>>>>>>>>>
func sendNotification(phone string) {
	from := config.Email
	pass := config.Password
	to := phone

	msg := "From: " + from + "\n" +
		"To: " + to + "\n" +
		"Subject: Customer Request!\n\n" +
		"A Customer made a Request for something!"

	err := smtp.SendMail("smtp.gmail.com:587",
		smtp.PlainAuth("", from, pass, "smtp.gmail.com"),
		from, []string{to}, []byte(msg))

	if err != nil {
		log.Println("smtp error: %s", err)
		return
	}

	log.Print("Texted: ", to)
}

func send(phone string) {
	from := config.Email
	pass := config.Password
	to := phone

	msg := "From: " + from + "\n" +
		"To: " + to + "\n" +
		"Subject: Hello from Jidoka!\n\n" +
		"Thank you for your interest in my services! I will reach out to you soon! -Charles"

	err := smtp.SendMail("smtp.gmail.com:587",
		smtp.PlainAuth("", from, pass, "smtp.gmail.com"),
		from, []string{to}, []byte(msg))

	if err != nil {
		log.Println("smtp error: %s", err)
		return
	}

	log.Print("Texted: ", to)
}

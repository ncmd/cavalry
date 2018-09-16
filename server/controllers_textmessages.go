package main

import (
	"log"
	"net/smtp"
)

var phoneProviders [8]string

// <<<<<<<<<<<< Phone >>>>>>>>>>>>>
func sendNotification(phone string) {

	phoneProviders[0] = "@message.alltel.com"
	phoneProviders[1] = "@txt.att.net"
	phoneProviders[2] = "@myboostmobile.com"
	phoneProviders[3] = "@tmomail.net"
	phoneProviders[4] = "@mms.cricketwireless.net"
	phoneProviders[5] = "@vtext.com"
	phoneProviders[6] = "@vmobl.com"
	phoneProviders[7] = "@msg.fi.google.com"

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
		log.Println("smtp error:", err)
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
		log.Println("smtp error:", err)
		return
	}

	log.Print("Texted: ", to)
}

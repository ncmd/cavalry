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
var stripeproduct = ""
var stripe1monthplan = ""
var stripe12monthsplan = ""
var stripebetaplan = ""

func main() {

	// Determines which stripe and sendgrid key to use from 'APP_ENV'
	for _, element := range os.Environ() {
		variable := strings.Split(element, "=")
		if variable[0] == "APP_ENV" {
			fmt.Println(len(variable[1]))
			if variable[1] == "local " {
				stripesecretkey = config.StripeLocalSecretKey
				stripeproduct = config.StripeTestProduct
				stripe1monthplan = config.StripeTestPlan1Month
				stripe12monthsplan = config.StripeTestPlan12Months
				stripebetaplan = config.StripeTestPlanBeta
				sendgridkey = config.SendgridLocalKey
			} else if variable[1] == "local" {
				stripesecretkey = config.StripeLocalSecretKey
				stripeproduct = config.StripeTestProduct
				stripe1monthplan = config.StripeTestPlan1Month
				stripe12monthsplan = config.StripeTestPlan12Months
				stripebetaplan = config.StripeTestPlanBeta
				sendgridkey = config.SendgridLocalKey
			} else if variable[1] == "dev " {
				stripesecretkey = config.StripeDevSecretKey
				stripeproduct = config.StripeTestProduct
				stripe1monthplan = config.StripeTestPlan1Month
				stripe12monthsplan = config.StripeTestPlan12Months
				stripebetaplan = config.StripeTestPlanBeta
				sendgridkey = config.SendgridDevKey
			} else if variable[1] == "dev" {
				stripesecretkey = config.StripeDevSecretKey
				stripeproduct = config.StripeTestProduct
				stripe1monthplan = config.StripeTestPlan1Month
				stripe12monthsplan = config.StripeTestPlan12Months
				stripebetaplan = config.StripeTestPlanBeta
				sendgridkey = config.SendgridDevKey
			} else if variable[1] == "prod " {
				stripesecretkey = config.StripeProdSecretKey
				stripeproduct = config.StripeLiveProduct
				stripe1monthplan = config.StripeLivePlan1Month
				stripe12monthsplan = config.StripeLivePlan12Months
				stripebetaplan = config.StripeLivePlanBeta
				sendgridkey = config.SendgridProdKey
			} else if variable[1] == "prod" {
				stripesecretkey = config.StripeProdSecretKey
				stripeproduct = config.StripeLiveProduct
				stripe1monthplan = config.StripeLivePlan1Month
				stripe12monthsplan = config.StripeLivePlan12Months
				stripebetaplan = config.StripeLivePlanBeta
				sendgridkey = config.SendgridProdKey
			} else {
				fmt.Println("NO APP_ENV found!")
			}
		}
	}

	// hello world /
	http.HandleFunc("/", helloworld)

	// handle proxy all analytics to heroku backend -> google-analytics.com
	http.HandleFunc("/api/analytics/", controllers_googleanalyticsproxy_handle_google_analytics_requests)
	http.HandleFunc("/api/analytics/r/", controllers_googleanalyticsproxy_handle_google_analytics_requests)
	http.HandleFunc("/api/analytics/r/collect", controllers_googleanalyticsproxy_handle_google_analytics_requests)
	http.HandleFunc("/api/analytics/collect", controllers_googleanalyticsproxy_handle_google_analytics_requests)

	// response pong
	http.HandleFunc("/api/ping", pingpong)

	// verify jwt firebase Token
	http.HandleFunc("/api/verify", controllers_firebaseverifyidtoken_handle_verify_token_with_firebase)

	// get last10 posts
	http.HandleFunc("/api/posts", controllers_posts_fetch_last_10_posts_from_firestore)
	http.HandleFunc("/api/post/", controllers_posts_fetch_selected_post_from_firestore)
	http.HandleFunc("/api/post/new", controllers_posts_create_post_in_firestore)
	http.HandleFunc("/api/post/edit", controllers_posts_edit_post_in_firestore)

	// add request
	http.HandleFunc("/api/request/new", controllers_requests_create_request_in_firestore)

	// add email address to firestore for an email list
	http.HandleFunc("/api/subscribe/new", controllers_subscriptions_create_document_to_subscribers_collection_in_firestore)

	// recaptcha confirmation
	http.HandleFunc("/api/recaptcha", controllers_recaptcha_verify_recaptcha_requests_from_signup_page)

	// This creates user in Stripe, Creates their Payment Method
	// Adds user to Plan
	http.HandleFunc("/api/user/new", controllers_stripe_generate_password_subscribe_user_to_plan_sendgrid_email_password)
	http.HandleFunc("/api/user/customerid", get_stripe_customerId_from_emailaddress)
	http.HandleFunc("/api/user/unsubscribe", get_stripe_subscriptionid_from_customerid)

	// new
	http.HandleFunc("/api/account/unsubscribe", c_stripe_unsubscribe_account_in_stripe)
	http.HandleFunc("/api/account/create", c_accounts_create_user_account_in_firebase)
	http.HandleFunc("/api/account/get", c_accounts_get_user_account_information_in_firestore)
	http.HandleFunc("/api/account/invite", c_accounts_invite_user_create_account_in_firebase)

	http.HandleFunc("/api/organization/create", c_organizations_create_orgnaization_in_firebase)
	http.HandleFunc("/api/organization/check", c_organizations_check_if_organization_exists_in_firebase)
	http.HandleFunc("/api/organization/join", c_organizations_account_add_organization_in_firebase)
	http.HandleFunc("/api/organization/leave", c_organizations_account_leave_organization_in_firebase)

	// depreciate
	http.HandleFunc("/api/accounts/update", update_stripe_customer_information_to_accounts_firestore)
	http.HandleFunc("/api/accounts/create", controllers_accounts_create_user_account_in_firestore)

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

package main

type PingPong struct {
	Message string
}

type FailedToken struct {
	Message string
}

type Data struct {
	Name      string `json:"name"`
	Phone     string `json:"phone"`
	Email     string `json:"email"`
	Recaptcha string `json:"recaptcha"`
}

type VerifyToken struct {
	Token string `json:"token"`
}

type Account struct {
	ID    string `json:"accountid"`
	Plan  string `json:"plan"`
	Email string `json:"email"`
}

type Response struct {
	Success     bool   `json:"success"`
	ChallengeTS string `json:"challenge_ts"`
	Hostname    string `json:"hostname"`
}

type Post struct {
	Id          string        `json:"id"`
	Title       string        `json:"title"`
	Description string        `json:"description"`
	Tags        []interface{} `json:"tags"`
	Objectives  []interface{} `json:"objectives"`
}

type RequestRunbook struct {
	Id          string        `json:"id"`
	Description string        `json:"description"`
	Tags        []interface{} `json:"tags"`
}

type Subscriber struct {
	Email string `json:"email"`
}

type User struct {
	Email    string `json:"email"`
	Plan     string `json:"plan"`
	Source   string `json:"source"`
	Password string `json:"password"`
}

// Configuration file
type Config struct {
	Server                    string
	Port                      int
	Email                     string
	Password                  string
	Captchasecret             string
	StripeLocalPublishableKey string
	StripeLocalSecretKey      string
	StripeDevPublishableKey   string
	StripeDevSecretKey        string
	StripeProdPublishableKey  string
	StripeProdSecretKey       string
	SendgridLocalKey          string
	SendgridDevKey            string
	SendgridProdKey           string
}

type Runbook struct {
	Title       string `json:"title"`
	Description string `json:"description"`
	Cost        int    `json:"cost"`
	Executions  int    `json:"executions"`
	Rank        int    `json:"rank"`
	Time        int    `json:"time"`
}

type Product struct {
	Title       string `json:"title"`
	Description string `json:"description"`
	Topics      string `json:"topics"`
	Cost        int    `json:"cost"`
	Executions  int    `json:"executions"`
	Rank        int    `json:"rank"`
	Time        int    `json:"time"`
	GitUser     string `json:"gitUser"`
	GitRepo     string `json:"gitRepo"`
	Stars       int    `json:"stars"`
}

type Solution struct {
	Id           string `json:"id"`
	Title        string `json:"title"`
	Expanded     bool   `json:"expanded"`
	Security     string `json:"security"`
	Maintainence string `json:"maintainence"`
	Description  string `json:"description"`
	Image        string `json:"image"`
	Deployment   string `json:"deployment"`
	Resources    string `json:"resources"`
	Performance  string `json:"performance"`
	Automation   string `json:"automation"`
	Techdebt     int    `json:"techdebt"`
}

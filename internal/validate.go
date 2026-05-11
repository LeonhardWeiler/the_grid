package internal

import "regexp"

var clientIDRegex = regexp.MustCompile(
	`^[a-zA-Z0-9\-]{1,64}$`,
)

func ValidCoords(x, y int) bool {
	return x >= 0 &&
		x < GridSize &&
		y >= 0 &&
		y < GridSize
}

func ValidColor(color string) bool {
	return AllowedColors[color]
}

func ValidClientID(id string) bool {
	return clientIDRegex.MatchString(id)
}

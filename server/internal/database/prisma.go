package database

import (
	"context"
	"fmt"
	"log"

	"lifequest-server/internal/db"
)

var Client *db.PrismaClient

func Connect() {
	client := db.NewClient()
	
	// Connect to the database
	if err := client.Prisma.Connect(); err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	Client = client
	fmt.Println("Connected to PostgreSQL database via Prisma")
}

func Disconnect() {
	if Client != nil {
		if err := Client.Prisma.Disconnect(); err != nil {
			log.Printf("Error disconnecting from database: %v", err)
		}
	}
}

func GetClient() *db.PrismaClient {
	return Client
}

// Test connection
func TestConnection(ctx context.Context) error {
	// Try to count users as a simple test
	_, err := Client.User.FindMany().Exec(ctx)
	return err
}
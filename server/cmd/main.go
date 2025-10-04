package main

import (
	"log"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"

	"lifequest-server/internal/database"
	"lifequest-server/internal/handlers"
	"lifequest-server/internal/middleware"
)

func main() {
	// Load environment variables
	err := godotenv.Load()
	if err != nil {
		log.Println("Warning: .env file not found")
	}

	// Connect to database
	database.Connect()
	defer database.Disconnect()

	// Initialize Gin router
	r := gin.Default()

	// Configure CORS
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"http://localhost:5173", "http://localhost:5174"} // Vite dev server
	config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}
	config.AllowHeaders = []string{"*"}
	config.AllowCredentials = true
	r.Use(cors.New(config))

	// Health check endpoint
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok", "service": "lifequest-api"})
	})

	// API routes
	api := r.Group("/api")
	{
		// Auth routes (protected by middleware)
		auth := api.Group("/auth")
		auth.Use(middleware.AuthMiddleware())
		{
			auth.GET("/me", handlers.GetCurrentUser)
			auth.PUT("/me", handlers.UpdateCurrentUser)
		}

		// Folders routes
		folders := api.Group("/folders")
		folders.Use(middleware.AuthMiddleware())
		{
			folders.GET("", handlers.GetFolders)
			folders.POST("", handlers.CreateFolder)
			folders.GET("/:id", handlers.GetFolder)
			folders.PUT("/:id", handlers.UpdateFolder)
			folders.DELETE("/:id", handlers.DeleteFolder)
		}

		// Projects routes
		projects := api.Group("/projects")
		projects.Use(middleware.AuthMiddleware())
		{
			projects.GET("", handlers.GetProjects)
			projects.POST("", handlers.CreateProject)
			projects.GET("/:id", handlers.GetProject)
			projects.PUT("/:id", handlers.UpdateProject)
			projects.DELETE("/:id", handlers.DeleteProject)
		}

		// Tasks routes
		tasks := api.Group("/tasks")
		tasks.Use(middleware.AuthMiddleware())
		{
			tasks.GET("", handlers.GetTasks)
			tasks.POST("", handlers.CreateTask)
			tasks.GET("/:id", handlers.GetTask)
			tasks.PUT("/:id", handlers.UpdateTask)
			tasks.DELETE("/:id", handlers.DeleteTask)
			tasks.POST("/:id/complete", handlers.CompleteTask)
		}

		// Pomodoro sessions routes
		pomodoro := api.Group("/pomodoro")
		pomodoro.Use(middleware.AuthMiddleware())
		{
			pomodoro.GET("/sessions", handlers.GetPomodoroSessions)
			pomodoro.POST("/sessions", handlers.CreatePomodoroSession)
			pomodoro.PUT("/sessions/:id", handlers.UpdatePomodoroSession)
			pomodoro.POST("/sessions/:id/complete", handlers.CompletePomodoroSession)
		}

		// Sprints routes
		sprints := api.Group("/sprints")
		sprints.Use(middleware.AuthMiddleware())
		{
			sprints.GET("", handlers.GetSprints)
			sprints.POST("", handlers.CreateSprint)
			sprints.GET("/:id", handlers.GetSprint)
			sprints.PUT("/:id", handlers.UpdateSprint)
			sprints.DELETE("/:id", handlers.DeleteSprint)
			sprints.POST("/:id/tasks", handlers.AddTaskToSprint)
			sprints.DELETE("/:id/tasks/:taskId", handlers.RemoveTaskFromSprint)
		}
	}

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server starting on port %s", port)
	log.Fatal(r.Run(":" + port))
}
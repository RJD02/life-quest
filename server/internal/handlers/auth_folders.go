package handlers

import (
	"context"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"

	"lifequest-server/internal/database"
	"lifequest-server/internal/db"
)

// Auth handlers
func GetCurrentUser(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}

	ctx := context.Background()
	client := database.GetClient()

	user, err := client.User.FindUnique(
		db.User.ID.Equals(userID.(string)),
	).Exec(ctx)

	if err != nil {
		if db.IsErrNotFound(err) {
			c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	c.JSON(http.StatusOK, user)
}

func UpdateCurrentUser(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}

	var updateData struct {
		FirstName *string `json:"firstName"`
		LastName  *string `json:"lastName"`
		Avatar    *string `json:"avatar"`
	}

	if err := c.ShouldBindJSON(&updateData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ctx := context.Background()
	client := database.GetClient()

	// Build update params
	params := []db.UserSetParam{}
	if updateData.FirstName != nil {
		params = append(params, db.User.FirstName.SetOptional(updateData.FirstName))
	}
	if updateData.LastName != nil {
		params = append(params, db.User.LastName.SetOptional(updateData.LastName))
	}
	if updateData.Avatar != nil {
		params = append(params, db.User.Avatar.SetOptional(updateData.Avatar))
	}
	params = append(params, db.User.UpdatedAt.Set(time.Now()))

	user, err := client.User.FindUnique(
		db.User.ID.Equals(userID.(string)),
	).Update(params...).Exec(ctx)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update user"})
		return
	}

	c.JSON(http.StatusOK, user)
}

// Folder handlers
func GetFolders(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}

	ctx := context.Background()
	client := database.GetClient()

	folders, err := client.Folder.FindMany(
		db.Folder.UserID.Equals(userID.(string)),
	).Exec(ctx)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	c.JSON(http.StatusOK, folders)
}

func CreateFolder(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}

	var folderData struct {
		Name        string  `json:"name" binding:"required"`
		Description *string `json:"description"`
		Color       *string `json:"color"`
		Icon        *string `json:"icon"`
	}

	if err := c.ShouldBindJSON(&folderData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ctx := context.Background()
	client := database.GetClient()

	params := []db.FolderSetParam{}

	if folderData.Description != nil {
		params = append(params, db.Folder.Description.SetOptional(folderData.Description))
	}
	if folderData.Color != nil {
		params = append(params, db.Folder.Color.Set(*folderData.Color))
	}
	if folderData.Icon != nil {
		params = append(params, db.Folder.Icon.Set(*folderData.Icon))
	}

	folder, err := client.Folder.CreateOne(
		db.Folder.Name.Set(folderData.Name),
		db.Folder.User.Link(
			db.User.ID.Equals(userID.(string)),
		),
		params...,
	).Exec(ctx)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create folder"})
		return
	}

	c.JSON(http.StatusCreated, folder)
}

func GetFolder(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}

	folderID := c.Param("id")
	ctx := context.Background()
	client := database.GetClient()

	folder, err := client.Folder.FindFirst(
		db.Folder.ID.Equals(folderID),
		db.Folder.UserID.Equals(userID.(string)),
	).With(
		db.Folder.Projects.Fetch(),
	).Exec(ctx)

	if err != nil {
		if db.IsErrNotFound(err) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Folder not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	c.JSON(http.StatusOK, folder)
}

func UpdateFolder(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}

	folderID := c.Param("id")

	var updateData struct {
		Name        *string `json:"name"`
		Description *string `json:"description"`
		Color       *string `json:"color"`
		Icon        *string `json:"icon"`
	}

	if err := c.ShouldBindJSON(&updateData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ctx := context.Background()
	client := database.GetClient()

	// Build update params
	params := []db.FolderSetParam{
		db.Folder.UpdatedAt.Set(time.Now()),
	}
	if updateData.Name != nil {
		params = append(params, db.Folder.Name.Set(*updateData.Name))
	}
	if updateData.Description != nil {
		params = append(params, db.Folder.Description.SetOptional(updateData.Description))
	}
	if updateData.Color != nil {
		params = append(params, db.Folder.Color.Set(*updateData.Color))
	}
	if updateData.Icon != nil {
		params = append(params, db.Folder.Icon.Set(*updateData.Icon))
	}

	result, err := client.Folder.FindMany(
		db.Folder.ID.Equals(folderID),
		db.Folder.UserID.Equals(userID.(string)),
	).Update(params...).Exec(ctx)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update folder"})
		return
	}

	if result.Count == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Folder not found"})
		return
	}

	// Fetch the updated folder
	updatedFolder, err := client.Folder.FindFirst(
		db.Folder.ID.Equals(folderID),
		db.Folder.UserID.Equals(userID.(string)),
	).Exec(ctx)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch updated folder"})
		return
	}

	c.JSON(http.StatusOK, updatedFolder)
}

func DeleteFolder(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}

	folderID := c.Param("id")
	ctx := context.Background()
	client := database.GetClient()

	result, err := client.Folder.FindMany(
		db.Folder.ID.Equals(folderID),
		db.Folder.UserID.Equals(userID.(string)),
	).Delete().Exec(ctx)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete folder"})
		return
	}

	if result.Count == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Folder not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Folder deleted successfully"})
}
package models

import (
	"time"

	"gorm.io/gorm"
	"lifequest-server/internal/utils"
)

type User struct {
	ID        string    `json:"id" gorm:"primaryKey"`
	Email     string    `json:"email" gorm:"unique;not null"`
	FirstName string    `json:"firstName"`
	LastName  string    `json:"lastName"`
	Level     int       `json:"level" gorm:"default:1"`
	XP        int       `json:"xp" gorm:"default:0"`
	TotalXP   int       `json:"totalXp" gorm:"default:0"`
	Streak    int       `json:"streak" gorm:"default:0"`
	Avatar    *string   `json:"avatar"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`

	// Relationships
	Folders          []Folder          `json:"folders" gorm:"foreignKey:UserID"`
	Projects         []Project         `json:"projects" gorm:"foreignKey:UserID"`
	Tasks            []Task            `json:"tasks" gorm:"foreignKey:UserID"`
	PomodoroSessions []PomodoroSession `json:"pomodoroSessions" gorm:"foreignKey:UserID"`
	Sprints          []Sprint          `json:"sprints" gorm:"foreignKey:UserID"`
}

type Folder struct {
	ID           string    `json:"id" gorm:"primaryKey"`
	UserID       string    `json:"userId" gorm:"not null"`
	Name         string    `json:"name" gorm:"not null"`
	Description  *string   `json:"description"`
	Color        string    `json:"color" gorm:"default:#3b82f6"`
	Icon         string    `json:"icon" gorm:"default:📁"`
	ProjectCount int       `json:"projectCount" gorm:"default:0"`
	CreatedAt    time.Time `json:"createdAt"`
	UpdatedAt    time.Time `json:"updatedAt"`

	// Relationships
	User     User      `json:"user" gorm:"foreignKey:UserID"`
	Projects []Project `json:"projects" gorm:"foreignKey:FolderID"`
}

type Project struct {
	ID                string     `json:"id" gorm:"primaryKey"`
	UserID            string     `json:"userId" gorm:"not null"`
	FolderID          string     `json:"folderId" gorm:"not null"`
	Name              string     `json:"name" gorm:"not null"`
	Description       *string    `json:"description"`
	Status            string     `json:"status" gorm:"default:active"` // active, completed, on-hold, cancelled
	Priority          string     `json:"priority" gorm:"default:medium"` // low, medium, high
	DueDate           *time.Time `json:"dueDate"`
	TaskCount         int        `json:"taskCount" gorm:"default:0"`
	CompletedTaskCount int       `json:"completedTaskCount" gorm:"default:0"`
	XPEarned          int        `json:"xpEarned" gorm:"default:0"`
	CreatedAt         time.Time  `json:"createdAt"`
	UpdatedAt         time.Time  `json:"updatedAt"`

	// Relationships
	User             User              `json:"user" gorm:"foreignKey:UserID"`
	Folder           Folder            `json:"folder" gorm:"foreignKey:FolderID"`
	Tasks            []Task            `json:"tasks" gorm:"foreignKey:ProjectID"`
	PomodoroSessions []PomodoroSession `json:"pomodoroSessions" gorm:"foreignKey:ProjectID"`
}

type Task struct {
	ID                  string     `json:"id" gorm:"primaryKey"`
	UserID              string     `json:"userId" gorm:"not null"`
	ProjectID           string     `json:"projectId" gorm:"not null"`
	Title               string     `json:"title" gorm:"not null"`
	Description         *string    `json:"description"`
	Status              string     `json:"status" gorm:"default:todo"` // todo, in-progress, completed
	Priority            string     `json:"priority" gorm:"default:medium"` // low, medium, high
	XPValue             int        `json:"xpValue" gorm:"default:25"`
	EstimatedPomodoros  int        `json:"estimatedPomodoros" gorm:"default:1"`
	ActualPomodoros     int        `json:"actualPomodoros" gorm:"default:0"`
	DueDate             *time.Time `json:"dueDate"`
	CompletedAt         *time.Time `json:"completedAt"`
	CreatedAt           time.Time  `json:"createdAt"`
	UpdatedAt           time.Time  `json:"updatedAt"`

	// Relationships
	User             User              `json:"user" gorm:"foreignKey:UserID"`
	Project          Project           `json:"project" gorm:"foreignKey:ProjectID"`
	PomodoroSessions []PomodoroSession `json:"pomodoroSessions" gorm:"foreignKey:TaskID"`
	SprintTasks      []SprintTask      `json:"sprintTasks" gorm:"foreignKey:TaskID"`
}

type PomodoroSession struct {
	ID        string     `json:"id" gorm:"primaryKey"`
	UserID    string     `json:"userId" gorm:"not null"`
	TaskID    *string    `json:"taskId"`
	ProjectID *string    `json:"projectId"`
	Duration  int        `json:"duration"` // in minutes
	Type      string     `json:"type"`     // work, short-break, long-break
	Status    string     `json:"status"`   // active, paused, completed, cancelled
	StartTime time.Time  `json:"startTime"`
	EndTime   *time.Time `json:"endTime"`
	XPEarned  int        `json:"xpEarned" gorm:"default:0"`
	CreatedAt time.Time  `json:"createdAt"`

	// Relationships
	User    User     `json:"user" gorm:"foreignKey:UserID"`
	Task    *Task    `json:"task" gorm:"foreignKey:TaskID"`
	Project *Project `json:"project" gorm:"foreignKey:ProjectID"`
}

type Sprint struct {
	ID          string    `json:"id" gorm:"primaryKey"`
	UserID      string    `json:"userId" gorm:"not null"`
	Name        string    `json:"name" gorm:"not null"`
	Description *string   `json:"description"`
	StartDate   time.Time `json:"startDate"`
	EndDate     time.Time `json:"endDate"`
	Status      string    `json:"status" gorm:"default:planned"` // planned, active, completed
	GoalXP      int       `json:"goalXp" gorm:"default:0"`
	EarnedXP    int       `json:"earnedXp" gorm:"default:0"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`

	// Relationships
	User        User         `json:"user" gorm:"foreignKey:UserID"`
	SprintTasks []SprintTask `json:"sprintTasks" gorm:"foreignKey:SprintID"`
}

type SprintTask struct {
	ID       string `json:"id" gorm:"primaryKey"`
	SprintID string `json:"sprintId" gorm:"not null"`
	TaskID   string `json:"taskId" gorm:"not null"`

	// Relationships
	Sprint Sprint `json:"sprint" gorm:"foreignKey:SprintID"`
	Task   Task   `json:"task" gorm:"foreignKey:TaskID"`
}

// BeforeCreate hook to generate UUIDs
func (u *User) BeforeCreate(tx *gorm.DB) error {
	if u.ID == "" {
		u.ID = generateUUID()
	}
	return nil
}

func (f *Folder) BeforeCreate(tx *gorm.DB) error {
	if f.ID == "" {
		f.ID = generateUUID()
	}
	return nil
}

func (p *Project) BeforeCreate(tx *gorm.DB) error {
	if p.ID == "" {
		p.ID = generateUUID()
	}
	return nil
}

func (t *Task) BeforeCreate(tx *gorm.DB) error {
	if t.ID == "" {
		t.ID = generateUUID()
	}
	return nil
}

func (ps *PomodoroSession) BeforeCreate(tx *gorm.DB) error {
	if ps.ID == "" {
		ps.ID = generateUUID()
	}
	return nil
}

func (s *Sprint) BeforeCreate(tx *gorm.DB) error {
	if s.ID == "" {
		s.ID = generateUUID()
	}
	return nil
}

func (st *SprintTask) BeforeCreate(tx *gorm.DB) error {
	if st.ID == "" {
		st.ID = generateUUID()
	}
	return nil
}

// Helper function to generate UUID
func generateUUID() string {
	return utils.GenerateUUID()
}
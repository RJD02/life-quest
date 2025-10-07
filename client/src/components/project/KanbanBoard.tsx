import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import {
    Plus,
    MoreHorizontal,
    Calendar,
    Clock,
    User,
    MessageSquare,
    Flag,
    Zap,
    Bug,
    BookOpen,
    Target
} from 'lucide-react'
import { useProjectStore, type Task, type TaskList } from '../../stores/projectStore'

interface KanbanBoardProps {
  projectId: string
}

interface TaskCardProps {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (taskId: string) => void
}

interface TaskListColumnProps {
  list: TaskList
  tasks: Task[]
  onAddTask: (listId: string) => void
  onEditTask: (task: Task) => void
  onDeleteTask: (taskId: string) => void
  onMoveTask: (taskId: string, newListId: string, newPosition: number) => void
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'task',
    item: { id: task.id, listId: task.listId },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'highest': return 'text-red-600 bg-red-50'
      case 'high': return 'text-red-500 bg-red-50'
      case 'medium': return 'text-yellow-500 bg-yellow-50'
      case 'low': return 'text-green-500 bg-green-50'
      case 'lowest': return 'text-gray-500 bg-gray-50'
      default: return 'text-gray-500 bg-gray-50'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'story': return <BookOpen className="w-3 h-3" />
      case 'bug': return <Bug className="w-3 h-3 text-red-500" />
      case 'epic': return <Zap className="w-3 h-3 text-purple-500" />
      case 'subtask': return <Target className="w-3 h-3 text-blue-500" />
      default: return <Target className="w-3 h-3" />
    }
  }

  const getPriorityIcon = (priority: string) => {
    const baseClass = "w-3 h-3"
    switch (priority) {
      case 'highest': return <Flag className={`${baseClass} text-red-600`} />
      case 'high': return <Flag className={`${baseClass} text-red-500`} />
      case 'medium': return <Flag className={`${baseClass} text-yellow-500`} />
      case 'low': return <Flag className={`${baseClass} text-green-500`} />
      case 'lowest': return <Flag className={`${baseClass} text-gray-500`} />
      default: return <Flag className={`${baseClass} text-gray-500`} />
    }
  }

  return (
    <motion.div
      ref={drag}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`bg-white rounded-lg border border-gray-200 p-3 cursor-pointer hover:shadow-md transition-all group ${
        isDragging ? 'opacity-50 rotate-1 scale-105' : ''
      }`}
      onClick={() => onEdit(task)}
    >
      {/* Task Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-2">
          {getTypeIcon(task.type)}
          <span className="text-xs text-gray-500 uppercase font-medium">
            {task.type}
          </span>
        </div>
        
        <div className="flex items-center space-x-1">
          {getPriorityIcon(task.priority)}
          <button className="p-1 opacity-0 group-hover:opacity-100 hover:bg-gray-100 rounded transition-all">
            <MoreHorizontal className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Task Title */}
      <h4 className="font-medium text-gray-900 text-sm mb-2 line-clamp-2">
        {task.title}
      </h4>

      {/* Task Description */}
      {task.description && (
        <p className="text-xs text-gray-600 mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Labels */}
      {task.labels.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {task.labels.slice(0, 3).map((label) => (
            <span
              key={label}
              className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded-full"
            >
              {label}
            </span>
          ))}
          {task.labels.length > 3 && (
            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
              +{task.labels.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Task Metadata */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center space-x-2">
          {/* Story Points */}
          {task.storyPoints && (
            <div className="flex items-center space-x-1">
              <Target className="w-3 h-3" />
              <span>{task.storyPoints}</span>
            </div>
          )}
          
          {/* Time Tracking */}
          {task.timeSpent > 0 && (
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>{task.timeSpent}h</span>
            </div>
          )}
          
          {/* Comments Count */}
          <div className="flex items-center space-x-1">
            <MessageSquare className="w-3 h-3" />
            <span>0</span>
          </div>
        </div>

        {/* Due Date */}
        {task.dueDate && (
          <div className={`flex items-center space-x-1 ${
            new Date(task.dueDate) < new Date() ? 'text-red-500' : ''
          }`}>
            <Calendar className="w-3 h-3" />
            <span>{new Date(task.dueDate).toLocaleDateString()}</span>
          </div>
        )}
      </div>

      {/* Assignee */}
      {task.assigneeId && (
        <div className="flex items-center mt-2 pt-2 border-t border-gray-100">
          <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
            <User className="w-3 h-3 text-white" />
          </div>
          <span className="ml-2 text-xs text-gray-600">Assigned</span>
        </div>
      )}
    </motion.div>
  )
}

const TaskListColumn: React.FC<TaskListColumnProps> = ({
  list,
  tasks,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onMoveTask
}) => {
  const [{ isOver }, drop] = useDrop({
    accept: 'task',
    drop: (item: { id: string; listId: string }) => {
      if (item.listId !== list.id) {
        onMoveTask(item.id, list.id, tasks.length)
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  })

  return (
    <div
      ref={drop}
      className={`flex-shrink-0 w-80 bg-gray-50 rounded-lg p-4 ${
        isOver ? 'bg-blue-50 border-2 border-blue-300 border-dashed' : ''
      }`}
    >
      {/* List Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: list.color }}
          />
          <h3 className="font-semibold text-gray-900">{list.name}</h3>
          <span className="px-2 py-1 text-xs bg-gray-200 text-gray-600 rounded-full">
            {tasks.length}
          </span>
        </div>
        
        <div className="flex items-center space-x-1">
          <button
            onClick={() => onAddTask(list.id)}
            className="p-1 hover:bg-gray-200 rounded transition-colors"
          >
            <Plus className="w-4 h-4 text-gray-600" />
          </button>
          <button className="p-1 hover:bg-gray-200 rounded transition-colors">
            <MoreHorizontal className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* List Description */}
      {list.description && (
        <p className="text-sm text-gray-600 mb-4">{list.description}</p>
      )}

      {/* Tasks */}
      <div className="space-y-3 min-h-[200px]">
        <AnimatePresence>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
            />
          ))}
        </AnimatePresence>
        
        {/* Add Task Placeholder */}
        {tasks.length === 0 && (
          <div className="text-center py-8">
            <Plus className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500 mb-2">No tasks yet</p>
            <button
              onClick={() => onAddTask(list.id)}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Add first task
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ projectId }) => {
  const {
    getTaskListsByProject,
    getTasksByList,
    moveTask,
    addTask,
    updateTask,
    deleteTask
  } = useProjectStore()

  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [showTaskModal, setShowTaskModal] = useState(false)

  const taskLists = getTaskListsByProject(projectId)

  const handleMoveTask = (taskId: string, newListId: string, newPosition: number) => {
    moveTask(taskId, newListId, newPosition)
  }

  const handleAddTask = (listId: string) => {
    // For now, create a simple task - in real app, this would open a form
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: 'New Task',
      projectId,
      listId,
      status: 'todo',
      priority: 'medium',
      type: 'task',
      timeSpent: 0,
      assigneeId: 'current-user',
      reporterId: 'current-user',
      labels: [],
      xpValue: 25,
      estimatedPomodoros: 1,
      actualPomodoros: 0,
      position: getTasksByList(listId).length,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    addTask(newTask)
  }

  const handleEditTask = (task: Task) => {
    setSelectedTask(task)
    setShowTaskModal(true)
  }

  const handleDeleteTask = (taskId: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      deleteTask(taskId)
    }
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-full overflow-x-auto">
        <div className="flex space-x-6 p-6 min-w-max">
          {taskLists.map((list) => {
            const tasks = getTasksByList(list.id)
            return (
              <TaskListColumn
                key={list.id}
                list={list}
                tasks={tasks}
                onAddTask={handleAddTask}
                onEditTask={handleEditTask}
                onDeleteTask={handleDeleteTask}
                onMoveTask={handleMoveTask}
              />
            )
          })}
          
          {/* Add New List */}
          <div className="flex-shrink-0 w-80 h-fit">
            <button className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors">
              <Plus className="w-6 h-6 mx-auto mb-2" />
              <span className="block text-sm">Add another list</span>
            </button>
          </div>
        </div>
      </div>
    </DndProvider>
  )
}
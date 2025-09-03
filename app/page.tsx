"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Trash2, Plus, Tag, Clock, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface Task {
  id: string
  text: string
  completed: boolean
  tags: string[]
  reminder?: Date
}

export default function TodoApp() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState("")
  const [newTag, setNewTag] = useState("")
  const [showTagInput, setShowTagInput] = useState<string | null>(null)
  const [showReminderInput, setShowReminderInput] = useState<string | null>(null)
  const [reminderDateTime, setReminderDateTime] = useState("")

  // Check for due reminders
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date()
      tasks.forEach((task) => {
        if (task.reminder && task.reminder <= now && !task.completed) {
          alert(`Reminder: ${task.text}`)
          // Remove the reminder after alerting
          setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, reminder: undefined } : t)))
        }
      })
    }, 60000) // Check every minute

    return () => clearInterval(interval)
  }, [tasks])

  const addTask = () => {
    if (newTask.trim()) {
      const task: Task = {
        id: Date.now().toString(),
        text: newTask.trim(),
        completed: false,
        tags: [],
      }
      setTasks([...tasks, task])
      setNewTask("")
    }
  }

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  const toggleTask = (id: string) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))
  }

  const addTag = (taskId: string) => {
    if (newTag.trim()) {
      setTasks(tasks.map((task) => (task.id === taskId ? { ...task, tags: [...task.tags, newTag.trim()] } : task)))
      setNewTag("")
      setShowTagInput(null)
    }
  }

  const removeTag = (taskId: string, tagToRemove: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, tags: task.tags.filter((tag) => tag !== tagToRemove) } : task,
      ),
    )
  }

  const setReminder = (taskId: string) => {
    if (reminderDateTime) {
      const reminderDate = new Date(reminderDateTime)
      setTasks(tasks.map((task) => (task.id === taskId ? { ...task, reminder: reminderDate } : task)))
      setReminderDateTime("")
      setShowReminderInput(null)
    }
  }

  const removeReminder = (taskId: string) => {
    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, reminder: undefined } : task)))
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-8 text-center">Simple To-Do</h1>

        {/* Add Task Input */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex gap-2">
              <Input
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Add a new task..."
                onKeyPress={(e) => e.key === "Enter" && addTask()}
                className="flex-1"
              />
              <Button onClick={addTask} className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Task List */}
        <div className="space-y-3">
          {tasks.map((task) => (
            <Card key={task.id} className="transition-all duration-200 hover:shadow-md">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Checkbox checked={task.completed} onCheckedChange={() => toggleTask(task.id)} className="mt-1" />

                  <div className="flex-1 min-w-0">
                    <p
                      className={cn(
                        "text-sm font-medium break-words",
                        task.completed && "line-through text-muted-foreground",
                      )}
                    >
                      {task.text}
                    </p>

                    {/* Tags */}
                    {task.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {task.tags.map((tag, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                            onClick={() => removeTag(task.id, tag)}
                          >
                            {tag} <X className="h-3 w-3 ml-1" />
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Reminder Display */}
                    {task.reminder && (
                      <div className="flex items-center gap-1 mt-2">
                        <Clock className="h-3 w-3 text-accent" />
                        <span className="text-xs text-muted-foreground">{task.reminder.toLocaleString()}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeReminder(task.id)}
                          className="h-4 w-4 p-0 ml-1"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    )}

                    {/* Tag Input */}
                    {showTagInput === task.id && (
                      <div className="flex gap-2 mt-2">
                        <Input
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          placeholder="Enter tag..."
                          onKeyPress={(e) => e.key === "Enter" && addTag(task.id)}
                          className="text-xs h-7"
                          autoFocus
                        />
                        <Button onClick={() => addTag(task.id)} size="sm" className="h-7 px-2">
                          Add
                        </Button>
                      </div>
                    )}

                    {/* Reminder Input */}
                    {showReminderInput === task.id && (
                      <div className="flex gap-2 mt-2">
                        <Input
                          type="datetime-local"
                          value={reminderDateTime}
                          onChange={(e) => setReminderDateTime(e.target.value)}
                          className="text-xs h-7"
                          autoFocus
                        />
                        <Button onClick={() => setReminder(task.id)} size="sm" className="h-7 px-2">
                          Set
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setShowTagInput(showTagInput === task.id ? null : task.id)
                        setShowReminderInput(null)
                      }}
                      className="h-8 w-8 p-0"
                    >
                      <Tag className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setShowReminderInput(showReminderInput === task.id ? null : task.id)
                        setShowTagInput(null)
                      }}
                      className="h-8 w-8 p-0"
                    >
                      <Clock className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteTask(task.id)}
                      className="h-8 w-8 p-0 hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {tasks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No tasks yet. Add one above to get started!</p>
          </div>
        )}
      </div>
    </div>
  )
}

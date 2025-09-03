"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Trash2, Plus, Play, Pause, Square } from "lucide-react"
import { cn } from "@/lib/utils"

interface Task {
  id: string
  text: string
  completed: boolean
  timeSpent: number // in seconds
  isTimerRunning: boolean
  timerStartTime?: number
}

export default function TodoApp() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState("")

  useEffect(() => {
    const interval = setInterval(() => {
      setTasks((prevTasks) =>
        prevTasks.map((task) => {
          if (task.isTimerRunning && task.timerStartTime) {
            const now = Date.now()
            const additionalTime = Math.floor((now - task.timerStartTime) / 1000)
            return {
              ...task,
              timeSpent: task.timeSpent + additionalTime,
              timerStartTime: now,
            }
          }
          return task
        }),
      )
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const addTask = () => {
    if (newTask.trim()) {
      const task: Task = {
        id: Date.now().toString(),
        text: newTask.trim(),
        completed: false,
        timeSpent: 0,
        isTimerRunning: false,
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

  const startTimer = (taskId: string) => {
    setTasks(
      tasks.map(
        (task) =>
          task.id === taskId
            ? { ...task, isTimerRunning: true, timerStartTime: Date.now() }
            : { ...task, isTimerRunning: false }, // Stop other timers
      ),
    )
  }

  const pauseTimer = (taskId: string) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === taskId && task.isTimerRunning && task.timerStartTime) {
          const now = Date.now()
          const additionalTime = Math.floor((now - task.timerStartTime) / 1000)
          return {
            ...task,
            isTimerRunning: false,
            timeSpent: task.timeSpent + additionalTime,
            timerStartTime: undefined,
          }
        }
        return task
      }),
    )
  }

  const resetTimer = (taskId: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, timeSpent: 0, isTimerRunning: false, timerStartTime: undefined } : task,
      ),
    )
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-semibold text-center mb-8">Todo</h1>

        <div className="flex gap-2 mb-8">
          <Input
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add task..."
            onKeyPress={(e) => e.key === "Enter" && addTask()}
            className="flex-1"
          />
          <Button onClick={addTask} size="sm">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-3">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
            >
              <Checkbox checked={task.completed} onCheckedChange={() => toggleTask(task.id)} />

              <div className="flex-1 min-w-0">
                <p className={cn("text-sm", task.completed && "line-through text-muted-foreground")}>{task.text}</p>

                <div className="flex items-center gap-2 mt-1">
                  <span
                    className={cn("text-xs font-mono", task.isTimerRunning ? "text-primary" : "text-muted-foreground")}
                  >
                    {formatTime(task.timeSpent)}
                  </span>

                  <div className="flex gap-1">
                    {!task.isTimerRunning ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => startTimer(task.id)}
                        className="h-6 w-6 p-0"
                        disabled={task.completed}
                      >
                        <Play className="h-3 w-3" />
                      </Button>
                    ) : (
                      <Button variant="ghost" size="sm" onClick={() => pauseTimer(task.id)} className="h-6 w-6 p-0">
                        <Pause className="h-3 w-3" />
                      </Button>
                    )}

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => resetTimer(task.id)}
                      className="h-6 w-6 p-0"
                      disabled={task.timeSpent === 0}
                    >
                      <Square className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteTask(task.id)}
                className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        {tasks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-sm">No tasks yet</p>
          </div>
        )}
      </div>
    </div>
  )
}

import { Dialog, DialogTitle, DialogHeader, DialogContent } from "@/components/ui/dialog"
import instance from "@/server/api"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import React, { useEffect, useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Edit2, MoonIcon, PlusIcon, SearchIcon, Trash2, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { INote } from '@/models/note.taype'

export const NotesPage = () => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)
  const [darkMode, setDarkMode] = useState<boolean>(false)
  const [data, setData] = useState<INote[]>([])
  const [searchQuery, setSearchQuery] = useState<string>("")

  const [titleValue, setTitleValue] = useState<string>("")
  const [descValue, setDescValue] = useState<string>("")
  const [isChecked, setIsChecked] = useState<boolean>(false)
  const [selectedId, setSelectedId] = useState<string>("")

  const [isEdit, setIsEdit] = useState<boolean>(false)

  const getTodos = async () => {
    try {
      const todos = await instance.get("/todos")
      setData(todos.data)
      console.log(todos)
    } catch (error) {
      console.log(error)
    }
  }

  const searchTodos = async (query: string) => {
    try {
      if (query.trim() === "") {
        // If search is empty, get all todos
        getTodos()
        return
      }
      
      const todos = await instance.get(`/todos/search?q=${encodeURIComponent(query)}`)
      setData(todos.data)
    } catch (error) {
      console.log("Search error:", error)
      // If the search endpoint fails, fall back to client-side filtering
      const todos = await instance.get("/todos")
      const filteredTodos = todos.data.filter((todo: INote) => 
        todo.title.toLowerCase().includes(query.toLowerCase()) ||
        todo.description.toLowerCase().includes(query.toLowerCase())
      )
      setData(filteredTodos)
    }
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    searchTodos(query)
  }

  const clearSearch = () => {
    setSearchQuery("")
    getTodos()
  }

  const editNote = (id: string): void => {
    setIsEdit(true)
    const note = data.find((d) => d._id === id)
    if (note) {
      setTitleValue(note.title)
      setDescValue(note.description)
      setIsChecked(note.completed)
      setSelectedId(note._id)
    }
    setIsDialogOpen(true)
  }

  const deleteNote = (id: string): void => {
    const confirmed = confirm("Are you sure you want to delete?")
    if (confirmed) {
      instance.delete(`/todos/${id}`).then(() => {
        getTodos()
      })
    }
  }

  useEffect(() => {
    getTodos()
  }, [])

  const addTodo = () => {
    setIsEdit(false)
    setTitleValue("")
    setDescValue("")
    setIsChecked(false)
    setIsDialogOpen(true)
  }

  const submitAddedTodo = (): void => {
    instance
      .post("/todos", {
        title: titleValue,
        description: descValue,
        completed: false,
      })
      .then((data) => {
        if (data.status === 201) {
          setIsDialogOpen(false)
          getTodos()
        }
      })
  }

  const submitEditTodo = (): void => {
    instance
      .put(`/todos/${selectedId}`, {
        title: titleValue,
        description: descValue,
        completed: isChecked,
      })
      .then((data) => {
        if (data.status === 200) {
          setIsDialogOpen(false)
          getTodos()
        }
      })
  }

  const toggleCompleted = (id: string, currentStatus: boolean): void => {
    const note = data.find((d) => d._id === id)
    if (note) {
      instance
        .put(`/todos/${id}`, {
          title: note.title,
          description: note.description,
          completed: !currentStatus,
        })
        .then((data) => {
          if (data.status === 200) {
            getTodos()
          }
        })
    }
  }

  return (
    <div className={cn("bg-[#f7f7f7] flex flex-row justify-center w-full min-h-screen", darkMode && "bg-[#252525]")}>
      <div className={cn("bg-white w-full max-w-[1400px] min-h-[710px]", darkMode && "bg-[#333333]")}>
        <div className="min-h-[710px]">
          <div className="relative w-full min-h-[710px]">
            <div className="mx-auto w-[750px] min-h-[710px] pb-20">
              <div className="pt-10 flex flex-col items-center gap-[18px]">
                <h1
                  className={cn(
                    "font-medium text-black text-[26px] [font-family:'Kanit',Helvetica]",
                    darkMode && "text-white",
                  )}
                >
                  TODO LIST
                </h1>

                <header className="flex w-full items-start gap-4 bg-transparent">
                  <div className="flex w-[494px] h-[38px] items-center relative rounded-[5px] border border-solid border-[#6c63ff]">
                    <Input
                      className={cn(
                        "h-full border-none [font-family:'Inter',Helvetica] font-medium text-[#c3c1e5] text-base",
                        darkMode && "bg-[#444444]",
                      )}
                      placeholder="Search note..."
                      value={searchQuery}
                      onChange={handleSearchChange}
                    />
                    {searchQuery ? (
                      <button
                        onClick={clearSearch}
                        className="absolute right-10 w-[21px] h-[21px] text-[#c3c1e5] hover:text-[#6c63ff]"
                      >
                        <X size={18} />
                      </button>
                    ) : null}
                    <SearchIcon className="absolute right-4 w-[21px] h-[21px] text-[#c3c1e5]" />
                  </div>

                  <Button className="h-[38px] bg-[#6c63ff] hover:bg-[#5a52e0] rounded-[5px] [font-family:'Kanit',Helvetica] font-medium text-white text-lg">
                    ENG
                    <svg
                      width="7"
                      height="4"
                      viewBox="0 0 7 4"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="ml-2"
                    >
                      <path d="M3.5 0L7 4H0L3.5 0Z" fill="white" />
                    </svg>
                  </Button>

                  <Button className="h-[38px] bg-[#6c63ff] hover:bg-[#5a52e0] rounded-[5px] [font-family:'Kanit',Helvetica] font-medium text-white text-lg">
                    ALL
                    <svg
                      width="7"
                      height="4"
                      viewBox="0 0 7 4"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="ml-2"
                    >
                      <path d="M3.5 0L7 4H0L3.5 0Z" fill="white" />
                    </svg>
                  </Button>

                  <Button
                    className="w-[38px] h-[38px] p-0 bg-[#6c63ff] hover:bg-[#5a52e0] rounded-[5px]"
                    onClick={() => setDarkMode(!darkMode)}
                  >
                    <MoonIcon className="w-[22px] h-[22px]" />
                  </Button>
                </header>
              </div>

              <div className="mt-[30px] mx-auto w-[520px]">
                {searchQuery && (
                  <div className={cn("mb-6 text-center", darkMode ? "text-white" : "text-black")}>
                    {data.length === 0 ? (
                      <p>No results found for "{searchQuery}"</p>
                    ) : (
                      <p>Found {data.length} results for "{searchQuery}"</p>
                    )}
                  </div>
                )}
                
                {data.length > 0 ? (
                  data.map((note) => (
                    <React.Fragment key={note._id}>
                      <div className="flex items-center h-[26px] mb-[34px]">
                        <div className="relative">
                          <Checkbox
                            id={`note-${note._id}`}
                            checked={note.completed}
                            className={cn(
                              "w-[26px] h-[26px] rounded-sm border border-solid border-[#6c63ff]",
                              note.completed ? "bg-[#6c63ff]" : "",
                            )}
                            onCheckedChange={() => toggleCompleted(note._id, note.completed)}
                          />
                          {note.completed && (
                            <div className="absolute w-[7px] h-3.5 top-1 left-2.5 border-t-2 [border-top-style:solid] border-l-2 [border-left-style:solid] border-white rotate-[-135.56deg]" />
                          )}
                        </div>
                        <label
                          htmlFor={`note-${note._id}`}
                          className={cn(
                            "ml-[17px] [font-family:'Kanit',Helvetica] flex-1",
                            note.completed ? "font-normal text-[#25252580] line-through" : "font-medium text-black",
                            darkMode && !note.completed && "text-white",
                          )}
                        >
                          {note.title}
                        </label>

                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-[#6c63ff]"
                            onClick={() => editNote(note._id)}
                          >
                            <Edit2 size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500"
                            onClick={() => deleteNote(note._id)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </div>
                      <Separator className={cn("w-full h-px mb-[34px]", darkMode && "bg-[#444444]")} />
                    </React.Fragment>
                  ))
                ) : (
                  <div className={cn("text-center py-10", darkMode ? "text-white" : "text-gray-500")}>
                    {searchQuery ? "No matching todos found." : "No todos found. Add a new one!"}
                  </div>
                )}
              </div>

              <div className="flex justify-center items-center mt-10">
                <div className="flex items-center space-x-2">
                  <p className={cn("text-base font-medium", darkMode && "text-white")}>Dark Mode</p>
                  <Switch
                    checked={darkMode}
                    onCheckedChange={setDarkMode}
                    className="data-[state=checked]:bg-[#6c63ff]"
                  />
                </div>
              </div>
            </div>

            <Button
              className="absolute w-[50px] h-[50px] bottom-[32px] right-[32px] p-0 bg-[#6c63ff] hover:bg-[#5a52e0] rounded-[25px] shadow-[0px_0px_10px_0px_rgba(108,99,255,0.5)]"
              onClick={addTodo}
            >
              <PlusIcon className="w-6 h-6" />
            </Button>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogContent className={cn("w-[500px] rounded-2xl p-0", darkMode && "bg-[#333333] border-[#444444]")}>
                <DialogHeader className="pt-[30px] pb-6">
                  <DialogTitle
                    className={cn(
                      "text-center [font-family:'Kanit',Helvetica] font-medium text-black text-2xl",
                      darkMode && "text-white",
                    )}
                  >
                    {isEdit ? "EDIT NOTE" : "NEW NOTE"}
                  </DialogTitle>
                </DialogHeader>

                <div className="px-[30px] pb-[30px] space-y-4">
                  <Input
                    className={cn(
                      "h-[38px] px-4 py-2 [font-family:'Inter',Helvetica] font-medium text-[#c3c1e5] text-base border border-solid border-[#6c63ff] rounded-[5px]",
                      darkMode && "bg-[#444444] border-[#555555]",
                    )}
                    placeholder="Input your note..."
                    onChange={(e) => setTitleValue(e.target.value)}
                    value={titleValue}
                  />

                  <Textarea
                    value={descValue}
                    className={cn(
                      "h-20 px-4 py-2 [font-family:'Inter',Helvetica] font-medium text-[#c3c1e5] text-base border border-solid border-[#6c63ff] rounded-[5px]",
                      darkMode && "bg-[#444444] border-[#555555]",
                    )}
                    placeholder="Input your description..."
                    onChange={(e) => setDescValue(e.target.value)}
                  />

                  {isEdit && (
                    <div className="flex justify-between items-center">
                      <span
                        className={cn(
                          "[font-family:'Inter',Helvetica] font-medium text-[#c3c1e5] text-base",
                          darkMode && "text-white",
                        )}
                      >
                        Completed
                      </span>
                      <Switch
                        checked={isChecked}
                        onCheckedChange={setIsChecked}
                        className="data-[state=checked]:bg-[#6c63ff]"
                      />
                    </div>
                  )}

                  <div className="flex justify-between pt-4">
                    <Button
                      variant="outline"
                      className={cn(
                        "border border-solid border-[#6c63ff] [font-family:'Kanit',Helvetica] font-medium text-[#6c63ff] text-lg",
                        darkMode && "border-white text-white hover:bg-[#444444] hover:text-white",
                      )}
                      onClick={() => setIsDialogOpen(false)}
                    >
                      CANCEL
                    </Button>

                    <Button
                      className="bg-[#6c63ff] hover:bg-[#5a52e0] [font-family:'Kanit',Helvetica] font-medium text-white text-lg"
                      onClick={isEdit ? submitEditTodo : submitAddedTodo}
                      disabled={!titleValue.trim()}
                    >
                      APPLY
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  )
}
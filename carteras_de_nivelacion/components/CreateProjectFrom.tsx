'use client'

import { createProject } from '../lib/actions/project'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Label } from './ui/label'


export function CreateProjectForm() {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    await createProject(formData)
    alert('Project created successfully!')
  }

  return (
    <form onSubmit={handleSubmit}>
      <Label htmlFor="name">Project Name:</Label>
      <Input type="text" name="name" id="name" required />
      <Button type="submit">Create</Button>
    </form>
  )
}

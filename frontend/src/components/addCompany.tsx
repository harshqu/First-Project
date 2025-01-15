import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import axios from 'axios'
import { useToast } from '@/hooks/use-toast'

interface AdminCompanyAddProps {
  onClose: () => void
}

export default function AdminCompanyAdd({ onClose}: AdminCompanyAddProps) {
  const [formData, setFormData] = useState({
    name: '',
    salary: '',
    description: '',
    jobRole: '',
    criteria: '',
  })

  const {toast} = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await axios.post('http://localhost:3000/addCompanies', {
        name: formData.name,
        salary: parseInt(formData.salary),
        description: formData.description,
        jobRole: formData.jobRole,
        criteria: parseInt(formData.criteria),
      }, {
        withCredentials: true
      })

      if(response.status === 200) {
        toast({
            title:"Company Added Successfully"
        })
      }
    console.log(response);
      onClose();
    } catch (error) {
      console.error('Error adding company:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Company Name</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="salary">Salary</Label>
        <Input
          id="salary"
          name="salary"
          type="number"
          value={formData.salary}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="jobRole">Job Role</Label>
        <Input
          id="jobRole"
          name="jobRole"
          value={formData.jobRole}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="criteria">GPA Criteria</Label>
        <Input
          id="criteria"
          name="criteria"
          type="number"
          step="1"
          min="0"
          max="10"
          value={formData.criteria}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">Add Company</Button>
      </div>
    </form>
  )
}


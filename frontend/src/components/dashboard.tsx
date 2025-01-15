import { useState, useEffect } from 'react'
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { ChevronDown, Search } from 'lucide-react'
import axios from 'axios'
import Cookies from 'js-cookie'
import { useAuth } from './context/AuthProvider'
import { LogOut, Plus } from 'lucide-react'
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import AdminCompanyAdd from './addCompany'

interface Company {
  id: string
  name: string
  salary: number
  description: string
  jobRole: string
  criteria: number
}


export default function Dashboard() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddCompanyOpen, setIsAddCompanyOpen] = useState(false)
  const [sortConfig, setSortConfig] = useState<{ key: keyof Company; direction: 'ascending' | 'descending' } | null>(null)
  const {setUser} = useAuth();
  const admin = Cookies.get('admin');
    
  useEffect(() => {
    const filteredCompanies = async() => {
        const response = await axios.get('http://localhost:3000/fetchData',{
            withCredentials:true
        })
        
        setCompanies(response.data)
    }

    filteredCompanies();
  }, [companies])

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.jobRole.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const sortCompanies = (key: keyof Company) => {
    let direction: 'ascending' | 'descending' = 'ascending'
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending'
    }
    setSortConfig({ key, direction })
  }

  const sortedCompanies = [...filteredCompanies].sort((a, b) => {
    if (!sortConfig) return 0
    const { key, direction } = sortConfig
    if (a[key] < b[key]) return direction === 'ascending' ? -1 : 1
    if (a[key] > b[key]) return direction === 'ascending' ? 1 : -1
    return 0
  })

  const handleLogout = () => {
    Cookies.remove('user');
    Cookies.remove('token');
    Cookies.remove('admin');
    setUser(null);
  }

  return (
    <div className="container mx-auto p-4">
        <div className="flex justify-end mb-4 gap-4">
        { admin !== 'false' && (
          <Dialog open={isAddCompanyOpen} onOpenChange={setIsAddCompanyOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <AdminCompanyAdd onClose={() => setIsAddCompanyOpen(false)} />
            </DialogContent>
          </Dialog>
        )}

            <Button onClick={handleLogout} variant="outline">
              <LogOut/>
            </Button>
      </div>
      <h1 className="text-2xl font-bold mb-4">Company Dashboard</h1>
      <div className="flex justify-between items-center mb-4">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search companies or job roles..."
            value={searchTerm}
            onChange={handleSearch}
            className="pl-8 pr-4 py-2 w-64"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Sort By <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Sort Options</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => sortCompanies('name')}>Company Name</DropdownMenuItem>
            <DropdownMenuItem onClick={() => sortCompanies('salary')}>Salary</DropdownMenuItem>
            <DropdownMenuItem onClick={() => sortCompanies('jobRole')}>Job Role</DropdownMenuItem>
            <DropdownMenuItem onClick={() => sortCompanies('criteria')}>GPA Criteria</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Table>
        <TableCaption>A list of companies and their job offerings.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Company Name</TableHead>
            <TableHead>Job Role</TableHead>
            <TableHead>Salary</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>GPA Criteria</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedCompanies.map((company) => (
            <TableRow key={company.id}>
              <TableCell className="font-medium">{company.name}</TableCell>
              <TableCell>{company.jobRole}</TableCell>
              <TableCell>${company.salary.toLocaleString()}</TableCell>
              <TableCell>{company.description}</TableCell>
              <TableCell>{company.criteria.toFixed(1)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}


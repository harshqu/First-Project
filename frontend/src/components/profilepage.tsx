import { motion } from 'framer-motion'
import { Github, Twitter, Phone,  GraduationCap, MapPin,UserRoundPen } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useEffect, useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import axios from 'axios'

const profileData = {
  name: 'John Doe',
  image: '/placeholder.svg?height=200&width=200',
  address: 'New York, NY',
  github: 'https://github.com/johndoe',
  twitter: 'https://twitter.com/johndoe',
  gpa: 3.8,
  college: 'University of Technology',
  appliedCompanies: ['Google', 'Amazon', 'Microsoft', 'Apple', 'Meta'],
  contactNumber: '+1 (555) 123-4567'
}

export default function Profile() {
    const [appliedCompanies,setAppliedCompanies] = useState<String[]>([]);
    const [name,setName] = useState<String>("")
    const [gpa,setGpa] = useState<Number>()
    const {toast} = useToast();

    useEffect(() => {

        const getUserDetails = async() => {
            try {
                const response = await axios.get('http://localhost:3000/getUserDetails',{
                    withCredentials:true
                })
                
                setAppliedCompanies(response.data.companies);
                setName(response.data.username);
                setGpa(response.data.gpa);
            } catch (error) {
                toast({
                    title: 'Error in fetching user details',
                    variant:'destructive'
                })
            }
        }
        getUserDetails()
    },[])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-4">
        <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full max-w-3xl overflow-hidden">
        <CardHeader className="flex flex-col items-center bg-gradient-to-r from-purple-500 to-pink-500 pb-6 pt-10 sm:flex-row sm:items-end sm:justify-between">
          <motion.div
            className="mb-4 rounded-full border-4 border-white bg-white shadow-xl sm:mb-0 sm:mr-4"
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <UserRoundPen width={120} height={120} className='rounded-full' />
          </motion.div>
          <CardTitle className="text-center text-3xl font-bold text-white sm:text-left">
            {name}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <InfoItem icon={<MapPin className="h-5 w-5" />} text={profileData.address} />
            <InfoItem
              icon={<Github className="h-5 w-5" />}
              text="GitHub"
              link={profileData.github}
            />
            <InfoItem
              icon={<Twitter className="h-5 w-5" />}
              text="Twitter"
              link={profileData.twitter}
            />
            <InfoItem
              icon={<GraduationCap className="h-5 w-5" />}
              text={`${profileData.college} (GPA: ${gpa})`}
            />
            <InfoItem icon={<Phone className="h-5 w-5" />} text={profileData.contactNumber} />
          </div>
          <div className="mt-6">
            <h3 className="text-lg font-semibold">Applied Companies</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {appliedCompanies.map((company, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Badge variant="secondary" className="text-sm">
                    {company}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
    </div>
  )
}

function InfoItem({ icon, text, link }: { icon: React.ReactNode; text: string; link?: string }) {
  return (
    <motion.div
      className="flex items-center gap-2"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      {icon}
      {link ? (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          {text}
        </a>
      ) : (
        <span>{text}</span>
      )}
    </motion.div>
  )
}


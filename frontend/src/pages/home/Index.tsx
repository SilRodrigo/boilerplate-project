import { useNavigate } from 'react-router-dom'
import { Button } from "@/components/ui/button"

export default function HomePage() {
  const navigate = useNavigate()

  const handleClick = (path: string) => {
    navigate(path)
  }

  return (
    <>
      <div><Button onClick={() => handleClick('/eldritch')}>Eldritch Horror</Button></div>
      <div><Button onClick={() => handleClick('/mansions')}>Mansions of Madness</Button></div>
    </>
  )
}

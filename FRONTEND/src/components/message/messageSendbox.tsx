import { Button } from "../ui/button"
import { Input } from "../ui/input"

interface MessageSendboxProps {
  className?: string
}

function MessageSendbox({className}: MessageSendboxProps) {
  return (
    <div className={`w-10/12 h-15 rounded-3xl ${className}`}>
        <Input placeholder="Send Anything" className="w-10/12 self-start h-full rounded-l-3xl"  />
        <Button className="rounded-3xl "/>
    </div>
  )
}

export default MessageSendbox
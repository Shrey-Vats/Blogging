import MessageSendbox from '@/components/message/messageSendbox'
import React from 'react'

function MessagePage() {
  return (
    <div className='w-full h-full flex flex-col'>
        <MessageSendbox  className='self-baseline'/>
    </div>
  )
}

export default MessagePage
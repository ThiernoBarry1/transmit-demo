import { router } from "@inertiajs/react";
import React, {useRef, useState} from "react";
import {getCsrfToken} from "~/utils";

export default function Home() {
  const [username, setUsername] = useState('')
  const [channel, setChannel] = useState('')
  const formRef = useRef<HTMLFormElement | null>(null)
  const csrfTokenInput = getCsrfToken()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!username || !channel) {
      alert('please chose username and chanel');
    }

    try {
      const values = new FormData(e.currentTarget)
      values.append('channel', channel)

      const response = await fetch(`/channel/${channel}/join`, {
        method: 'POST',
        body: values
      });
      
      if (response.ok) {
        localStorage.setItem('username', username)
        router.visit(`/channel/${channel}`);
      } else {
        console.error('Error on request joined channel ', response.statusText)
      }
    } catch (error) {
      console.error('Error on form send', error)
    }
  }

  const handleChannelSelection = (channel: string) => {
    setChannel(channel)
  }

  return (
    <>
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-16">
          <form ref={formRef} onSubmit={(e) => handleSubmit(e)}
                className="flex flex-col items-center gap-16 p-10 rounded-md shadow-md">
            <div dangerouslySetInnerHTML={{__html: csrfTokenInput}}/>
            <div className="flex items-center gap-10">
              <label htmlFor="username" className="text-lg font-medium">Pseudo</label>
              <input
                id="username"
                type="text"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="flex items-center gap-10">
              <h1>Canaux</h1>
              <button
                onClick={() => handleChannelSelection('general')}
                className="rounded-md text-zinc-950 bg-slate-300 hover:bg-slate-100 p-2 "
              >
                #general
              </button>
              <button
                onClick={() => handleChannelSelection('tech')}
                className="rounded-md text-zinc-950 bg-slate-300 hover:bg-slate-100 p-2"
              >
                #tech
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

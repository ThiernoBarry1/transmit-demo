import {InferPageProps} from "@adonisjs/inertia/types";
import ChannelsController from "#controllers/channels_controller";
import React, {useEffect, useRef, useState} from "react";
import {getCsrfToken} from "~/utils";
import { useTransmit } from "~/app/transmitContext";
import { Subscription } from "@adonisjs/transmit-client";

export default function Channel(props: InferPageProps<ChannelsController, 'channel'>) {
  const {channel} = props;
  const [messageList, setMessageList] = useState(['You joined the channel']);
  const [newMessage, setNewMessage] = useState('');
  const formRef = useRef<HTMLFormElement | null>(null)
  const csrfTokenInput = getCsrfToken()
  const username = localStorage.getItem('username') || 'Guest';
  const transmit = useTransmit();

  useEffect(() =>{
    let subscription: Subscription;
    const setupSubcrition = async ()=>{
      try {
        subscription = transmit.subscription(`channels/${channel}`)
        await subscription.create()

        subscription.onMessage(({message, type}: {message : string, type: string}) => {
          console.log(message)
          if (type === 'join' || type === 'message') {
            setMessageList(prevMessages => [...prevMessages, message])
          }
        })
      } catch (error) {
        console.log(`error ${error}`)
      }
    }
    setupSubcrition();
    return () =>{
      if (subscription) {
        void subscription.delete();
      }
    }
  }, [transmit]);
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!newMessage.trim()) {
      return 
    }

    try {
      const  values = new FormData(e.currentTarget);
      values.append('channel', channel)
      values.append('username', username)

      const response = await fetch(`/channel/${channel}/message`, {
        method: 'POST',
        body: values
      })
      setNewMessage('')
      if (!response || !response.ok) {
        console.error('failed to send message');
      }
    } catch (error) {
      console.error('error occured while sending message', error);
    }
  };

  return (
    <div className="p-10 flex flex-col h-screen gap-5">
      <div className="flex">
        <a href={'/'} className="w-2.5">{"<-"}</a>
        <h1 className="w-full text-center">#{channel}</h1>
      </div>

      <div className="flex flex-col grow justify-end bg-zinc-900">
        {messageList.map((value, index) => (
          <div key={index}>{value}</div>
        ))}
      </div>

      <form className="flex w-full" ref={formRef} onSubmit={(e) => handleSubmit(e)}>
        <div dangerouslySetInnerHTML={{__html: csrfTokenInput}}/>
        <input
          name={"message"}
          className="w-full"
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button
          type={"submit"}
          className="rounded-md text-zinc-950 bg-slate-300 p-2"
        >
          Envoyer
        </button>
      </form>
    </div>
  );
}

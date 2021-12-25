import React, {useContext, useState, useEffect, useRef} from 'react'
import { Redirect } from 'react-router-dom';
import { AppContext } from '../Context/AppContext';
import styles from './style.module.css'

const Room = () => {
    const [state] = useContext(AppContext);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const scrollRef = useRef()
    const sendMessage = () => {
        state.socket.emit("send message",{
            message: message,
        })

        setMessage("")
    }

    useEffect(()=>{
        if(state.connected){
            state.socket.emit("join_room",{
                username: state.user,
                room: state.currentRoom
            })
            state.socket.on("receive message",data=>{
                console.log("data",data)
                console.log("messages", messages)
                setMessages( prev=>[ ...prev, data ] )
            }) 
        }
        return ()=>{
            state?.socket?.emit("leave room")
        }
    },[state.socket])

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth"});
      }, []);

    if(!state.connected){
        return <Redirect to={"/"}/>
    }
    return (
        <div className={styles.main}>
            <div className={styles.heading}> Chat room </div>
            <br />
            <br />
            <div className={styles.chatBody}>
                {messages.map((item, index)=>
                <div ref={scrollRef} className={styles.bodyPart} key={index}>
                <div className={styles.userName}>{item.username}</div>
                <div className={styles.message}> {item.message} </div>
                </div>
                )}
            </div>
            <br/>
            <div className={styles.msgBtn}>
                <input type="text" value={message} onChange={e=>setMessage(e.target.value)} placeholder="Type a message"/>
                <button type="submit" onClick={sendMessage} >
                    Send
                </button>
            </div>
        </div>
    )
}

export default Room

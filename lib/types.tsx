import { ReactNode } from "react"

export interface HomeCardProps {
    className: string,
    img: string,
    title: string,
    description: string
    handleClick: () => void
}

export interface MeetingModalProps {
    isOpen: boolean,
    onClose: ()=>void ,
    title: string,
    className?: string,
    buttonText?: string,
    handleClick: () => void,
    image?:string,
    buttonIcon?:string,
    children?:ReactNode
}
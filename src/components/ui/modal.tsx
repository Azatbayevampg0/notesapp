import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./dialog"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[500px] p-0 rounded-2xl">
        {title && (
          <DialogHeader className="pt-[30px] pb-0">
            <DialogTitle className="text-center font-['Kanit',Helvetica] font-medium text-black text-2xl">
              {title}
            </DialogTitle>
          </DialogHeader>
        )}
        {children}
      </DialogContent>
    </Dialog>
  )
}
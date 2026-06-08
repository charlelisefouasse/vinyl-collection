"use client"

import * as React from "react"
import { useMediaQuery } from "@/hooks/use-media-query"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

const ModalContext = React.createContext<{ isDesktop: boolean }>({ isDesktop: true })

export function Modal({
  shouldScaleBackground = true,
  ...props
}: React.ComponentProps<typeof Dialog> & React.ComponentProps<typeof Drawer>) {
  const isDesktop = useMediaQuery("(min-width: 768px)")

  return (
    <ModalContext.Provider value={{ isDesktop }}>
      {isDesktop ? (
        <Dialog {...props} />
      ) : (
        <Drawer shouldScaleBackground={shouldScaleBackground} {...props} />
      )}
    </ModalContext.Provider>
  )
}

export function ModalTrigger(props: React.ComponentProps<typeof DialogTrigger> & React.ComponentProps<typeof DrawerTrigger>) {
  const { isDesktop } = React.useContext(ModalContext)
  if (isDesktop) {
    return <DialogTrigger {...props} />
  }
  return <DrawerTrigger {...props} />
}

export function ModalContent({
  className,
  children,
  showCloseButton,
  ...props
}: React.ComponentProps<typeof DialogContent> & React.ComponentProps<typeof DrawerContent> & { showCloseButton?: boolean }) {
  const { isDesktop } = React.useContext(ModalContext)
  if (isDesktop) {
    return (
      <DialogContent className={className} showCloseButton={showCloseButton} {...props}>
        {children}
      </DialogContent>
    )
  }
  return (
    <DrawerContent className={className} {...props}>
      {children}
    </DrawerContent>
  )
}

export function ModalHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { isDesktop } = React.useContext(ModalContext)
  if (isDesktop) {
    return <DialogHeader className={className} {...props} />
  }
  return <DrawerHeader className={className} {...props} />
}

export function ModalTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogTitle> & React.ComponentProps<typeof DrawerTitle>) {
  const { isDesktop } = React.useContext(ModalContext)
  if (isDesktop) {
    return <DialogTitle className={className} {...props} />
  }
  return <DrawerTitle className={className} {...props} />
}

export function ModalDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogDescription> & React.ComponentProps<typeof DrawerDescription>) {
  const { isDesktop } = React.useContext(ModalContext)
  if (isDesktop) {
    return <DialogDescription className={className} {...props} />
  }
  return <DrawerDescription className={className} {...props} />
}

export function ModalFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { isDesktop } = React.useContext(ModalContext)
  if (isDesktop) {
    return <DialogFooter className={className} {...props} />
  }
  return <DrawerFooter className={className} {...props} />
}

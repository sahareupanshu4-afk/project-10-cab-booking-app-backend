'use client'

import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { clsx } from 'clsx'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  showClose?: boolean
}

const sizes = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-4xl',
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
  showClose = true,
}: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog as="div" className="relative z-50" onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel
                  className={clsx(
                    'w-full transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all',
                    sizes[size]
                  )}
                >
                  {(title || showClose) && (
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        {title && (
                          <Dialog.Title
                            as="h3"
                            className="text-lg font-semibold leading-6 text-gray-900"
                          >
                            {title}
                          </Dialog.Title>
                        )}
                        {description && (
                          <p className="text-sm text-gray-500 mt-1">{description}</p>
                        )}
                      </div>
                      {showClose && (
                        <button
                          type="button"
                          className="rounded-full p-1 text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors"
                          onClick={onClose}
                        >
                          <X className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  )}
                  {children}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  )
}

interface ModalActionsProps {
  children: React.ReactNode
  className?: string
}

export function ModalActions({ children, className }: ModalActionsProps) {
  return (
    <div className={clsx('mt-6 flex items-center justify-end gap-3', className)}>
      {children}
    </div>
  )
}
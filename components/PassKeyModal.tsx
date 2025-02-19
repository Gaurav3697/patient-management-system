"use client"

import React, { useEffect, useState } from 'react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp"

import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { decryptKey, encryptKey } from '@/lib/utils';

const PassKeyModal = () => {
    const router = useRouter();
    const [open, setOpen] = useState(true);
    const [passKey, setPassKey] = useState('');
    const [error, setError] = useState('');
    const path = usePathname();

    // window object is a global object in web browsers that represents the browser window
    const encryptedKey =typeof window !== "undefined"? window.localStorage.getItem("accessKey"): null;

    useEffect(() => {
        console.log(encryptedKey)
        const accessKey = encryptedKey && decryptKey(encryptedKey);
        if (path)
            if (accessKey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY!.toString()) {
                setOpen(false);
                router.push("/admin");
            } else {
                setOpen(open);
            }
    }, [encryptedKey]);


    const validatePassKey = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        if (passKey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY) {
            const encryptedKey = encryptKey(passKey);
            localStorage.setItem('accessKey', encryptedKey);
            setOpen(false);
        } else {
            setError('Invalid passKey. Please try again.')
        }
    }

    const closeModal = () => {
        setOpen(false);
        router.push('/')
    }

    return (
        <div>
            <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogContent className='shad-alert-dialog'>
                    <AlertDialogHeader>
                        <AlertDialogTitle className='flex items-start justify-between'>
                            Admin Access Verification
                            <Image
                                src='/assets/icons/close.svg'
                                alt='close'
                                width={20}
                                height={20}
                                onClick={() => closeModal()}
                                className='cursor-pointer'
                            />

                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            To access the admin page ,please enter the passkey
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    {/* Input otp */}
                    <div>
                        <InputOTP maxLength={6} onChange={(value) => setPassKey(value)}>
                            <InputOTPGroup className='shad-otp'>
                                <InputOTPSlot className='shad-otp-slot' index={0} />
                                <InputOTPSlot className='shad-otp-slot' index={1} />
                                <InputOTPSlot className='shad-otp-slot' index={2} />
                            </InputOTPGroup>
                            <InputOTPSeparator />
                            <InputOTPGroup>
                                <InputOTPSlot className='shad-otp-slot' index={3} />
                                <InputOTPSlot className='shad-otp-slot' index={4} />
                                <InputOTPSlot className='shad-otp-slot' index={5} />
                            </InputOTPGroup>
                        </InputOTP>

                        {
                            error && <p className="shad-error text-14-regular mt-4 flex justify-center">
                                {error}
                            </p>
                        }

                    </div>

                    <AlertDialogFooter>
                        <AlertDialogAction onClick={(e) => validatePassKey(e)} className='shad-primary-btn w-full'>
                            Enter Admin Passkey
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

export default PassKeyModal

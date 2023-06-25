"use client"

import { signIn } from 'next-auth/react'
import { AiFillGithub } from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';
import { useState } from 'react';
import {
    FieldValues,
    SubmitHandler,
    useForm
} from 'react-hook-form';

import useRegisterModel from '@/app/hooks/useRegisterModel';
import useLoginModel from '@/app/hooks/useLoginModel';

import Model from './Model';
import Heading from '../Heading';
import Input from '../Inputs/Input';
import { toast } from 'react-hot-toast';
import Button from '../Button';
import { useRouter } from 'next/navigation';

const LoginModel = () => {
    const router = useRouter();
    const registerModel = useRegisterModel();
    const loginModel = useLoginModel();
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: {
            errors,
        }
    } = useForm<FieldValues>({
        defaultValues: {
            email: '',
            password: ''
        }
    });

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true);

        signIn('credentials', {
            ...data,
            redirect: false,
        })
        .then((callback) => {
            setIsLoading(false);

            if(callback?.ok) {
                toast.success("Logged In");
                router.refresh();
                loginModel.onClose();
            }

            if(callback?.error){
                toast.error(callback.error);
            }
        })
    }

    const toggle = () => {
        registerModel.onOpen();
        loginModel.onClose();
    }

    const bodyContent = (
        <div className='flex flex-col gap-4'>
            <Heading
                title = "Welcome back"
                subtitle='Login to your account'
            />
            <Input
                id="email"
                label='Email'
                disabled={isLoading}
                register={register}
                errors={errors}
                required
            />
            <Input
                id="password"
                type="password"
                label='Password'
                disabled={isLoading}
                register={register}
                errors={errors}
                required
            />
        </div>
    )

    const footerContent = (
        <div className='flex flex-col gap-4 mt-3'>
            <hr />
            <Button 
                outline
                label='Continue with Google'
                icon = {FcGoogle}
                onClick={() => {}}
            />
            <Button 
                outline
                label='Continue with Github'
                icon = {AiFillGithub}
                onClick={() => {}}
            />
            <div
                className='
                    text-neutral-500
                    text-center
                    mt-4
                    font-light
                '
            >
                <div
                    className='justify-center flex flex-row items-center gap-2'
                >
                    <div>
                        Don't have an account?
                    </div>
                    <div
                        onClick={toggle}
                        className='
                            text-neutral-800
                            cursor-pointer
                            hover:underline
                        '
                    >
                        Sign up
                    </div>
                </div>
            </div>
        </div>
    )
    
    return (
        <Model 
            disabled = {isLoading}
            isOpen = {loginModel.isOpen}
            title = "Login"
            actionlabel="Continue"
            onClose={loginModel.onClose}
            onSubmit={handleSubmit(onSubmit)}
            body={bodyContent}
            footer={footerContent}
        />
    );
}

export default LoginModel;
import React from 'react'
import { ContactProvider } from './ContactProvider';
import { Routes } from "./Routes"

interface ProvidersProps {}

export const Providers: React.FC<ProvidersProps> = ({}) => {
        return (<ContactProvider>
            <Routes/>
        </ContactProvider>);
}
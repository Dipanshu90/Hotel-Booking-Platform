import { Nunito } from 'next/font/google';
import Navbar from './components/navbar/Navbar';

import './globals.css'
import { Inter } from 'next/font/google'
import ClientOnly from './components/ClientOnly';
import Model from './components/Models/Model';
import RegisterModel from './components/Models/RegisterModel';
import ToasterProvider from './providers/ToasterProvider';
import LoginModel from './components/Models/LoginModel';
import getCurrentUser from './actions/getCurrentUser';
import RentModel from './components/Models/RentModel';

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Airbnb',
  description: 'Airbnb Clone',
}

const font = Nunito({
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const currentUser = await getCurrentUser();

  return (
    <html lang="en">
      <body className={font.className}>
        <ClientOnly>
          <ToasterProvider></ToasterProvider>
          <LoginModel />
          <RentModel />
          <RegisterModel /> {/*isOpen - same as isOpen = true */} 
          <Navbar currentUser={currentUser}/>
        </ClientOnly>
        {children}
      </body>
    </html>
  )
}

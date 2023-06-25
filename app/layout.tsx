import { Nunito } from 'next/font/google';
import Navbar from './components/navbar/Navbar';

import './globals.css'
import { Inter } from 'next/font/google'
import ClientOnly from './components/ClientOnly';
import Model from './components/Models/Model';
import RegisterModel from './components/Models/RegisterModel';
import ToasterProvider from './providers/ToasterProvider';

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Airbnb',
  description: 'Airbnb Clone',
}

const font = Nunito({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={font.className}>
        <ClientOnly>
          <ToasterProvider></ToasterProvider>
          <RegisterModel /> {/*isOpen - same as isOpen = true */} 
          <Navbar />
        </ClientOnly>
        {children}
      </body>
    </html>
  )
}

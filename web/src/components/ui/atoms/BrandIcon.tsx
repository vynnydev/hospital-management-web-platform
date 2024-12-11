import Link from 'next/link'
import Image from 'next/image'

export const BrandIcon = () => {
    return (
        <Link href='/'>
            <div className='items-center hidden lg:flex'>
                <Image src='/hospital-logo.png' alt='logo' height={50} width={50}/>
            </div>
        </Link>
    )
}

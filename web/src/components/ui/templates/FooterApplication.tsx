'use client'

export const FooterApplication = () => {
    return (
        <div className="flex flex-col h-auto mt-[100px] max-md:mt-12 max-lg:mt-12 bg-white dark:bg-[#121212] px-12 text-gray-800 dark:text-gray-200">

            <div className='flex flex-row'>
                <h1 className='text-[#020405] dark:text-gray-200 text-xl max-md:text-sm max-lg:text-sm max-md:mt-1 max-lg:mt-1 font-normal'>© {new Date().getFullYear()}</h1>
                <div className='flex flex-row border-t-2 border-gray-400 dark:border-gray-600 border-x-gray-400 dark:border-x-gray-600 max-md:mt-4 max-lg:mt-4 mt-4 ml-2 lg:w-[40vw] max-md:w-[14vw] max-lg:w-[14vw]' />
                <a className='text-green-700 dark:text-green-500 text-xl max-md:ml-2 max-lg:ml-2'>H24</a>
                <div className='flex flex-row border-t-2 border-gray-400 dark:border-gray-600 border-x-gray-400 dark:border-x-gray-600 max-md:mt-4 max-lg:mt-4 mt-4 ml-2 lg:w-[40vw] max-md:w-[14vw] max-lg:w-[14vw]' />
                <a className='text-[#020405] dark:text-gray-200 text-xl max-md:text-sm max-lg:text-sm max-md:mt-1 max-lg:mt-1 font-normal'>© {new Date().getFullYear()}</a>
            </div>
            
            <div className="flex flex-row justify-between items-center mt-8">
                <div className="flex flex-col max-md:hidden max-lg:hidden">
                    <h1 className="text-green-700 dark:text-green-500 font-normal text-2xl max-md:mt-8 max-lg:mt-8">H24</h1>
                    <h1 className="mt-2 text-gray-500 dark:text-gray-400">São Paulo, Brasil</h1>
                </div>

                <h1 className="text-gray-500 dark:text-gray-400 ml-40">© {new Date().getFullYear()} - H24</h1>

                <h1 className="text-gray-500 dark:text-gray-400 mr-8">Tecnologia Hospítalar - VMB</h1>
            </div>

        </div>
    )
}
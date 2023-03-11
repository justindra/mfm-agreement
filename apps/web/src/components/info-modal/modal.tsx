import React, { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Link } from '../typography/link';

const ListItem: React.FC<{
  title: string;
  description: React.ReactElement;
}> = ({ title, description }) => {
  return (
    <li className='list-item my-4'>
      <p className='inline'>
        <strong>{title}</strong>
      </p>
      <p className='ml-8'>{description}</p>
    </li>
  );
};

export default function Example() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className='w-full text-base opacity-75 mx-auto underline underline-offset-2'>
        Click here to learn more about this data.
      </button>
      <Transition.Root show={open} as={Fragment}>
        <Dialog as='div' className='relative z-10' onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'>
            <div className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity' />
          </Transition.Child>

          <div className='fixed inset-0 z-10 overflow-y-auto'>
            <div className='flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0'>
              <Transition.Child
                as={Fragment}
                enter='ease-out duration-300'
                enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
                enterTo='opacity-100 translate-y-0 sm:scale-100'
                leave='ease-in duration-200'
                leaveFrom='opacity-100 translate-y-0 sm:scale-100'
                leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'>
                <Dialog.Panel className='relative transform overflow-hidden rounded-lg bg-green-900 px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-3xl sm:p-6'>
                  <div>
                    <div className='mt-3 text-center sm:mt-5'>
                      <Dialog.Title
                        as='h3'
                        className='text-2xl font-semibold leading-6 text-gold-500'>
                        About the data
                      </Dialog.Title>
                      <div className='mt-2 text-xl text-justify text-gold-500'>
                        <p>
                          The data for this project is sourced using the YouTube
                          Data API v3. Here are some details about each
                          statistics:
                        </p>
                        <ul className='list-disc list-inside'>
                          <ListItem
                            title='Episodes'
                            description={
                              <>
                                The number of episodes are the number of videos
                                that is in the{' '}
                                <Link href='https://www.youtube.com/playlist?list=PLWloxQyF_2n4aCanY4Y45HLTY2zoeZF8U'>
                                  My First Million - Full Episodes
                                </Link>{' '}
                                playlist.
                              </>
                            }
                          />
                          <ListItem
                            title='Subscribers'
                            description={
                              <>
                                The total number of subscribers to the{' '}
                                <Link href='https://www.youtube.com/@MyFirstMillionPod'>
                                  My First Million
                                </Link>{' '}
                                channel.
                              </>
                            }
                          />
                          <ListItem
                            title='Content Length'
                            description={
                              <>The total duration of all the episodes</>
                            }
                          />
                          <ListItem
                            title='Fan Time'
                            description={
                              <>
                                The total subscribers x 12. 12 seconds is the
                                time it took me to open YouTube, look for the
                                channel and then hit subscribe.
                              </>
                            }
                          />
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className='mt-5 sm:mt-6'>
                    <button
                      type='button'
                      className='inline-flex w-full justify-center rounded-md bg-green-500 px-3 py-2 text-sm font-semibold text-gold-200 shadow-sm hover:bg-green-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700'
                      onClick={() => setOpen(false)}>
                      Close
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}

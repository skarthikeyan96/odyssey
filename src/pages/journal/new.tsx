import { getAuthenticatedUserFromSession } from "@/utils/passage";
import { getSupabase } from "@/utils/supabase";
import { PassageUser } from "@passageidentity/passage-elements/passage-user";
import React, { Fragment } from "react";
import ReactMarkdown from "react-markdown";
import { Editor } from "@monaco-editor/react";
import { useRouter } from "next/router";
import Navbar from "@/components/navbar";
import { Dialog, Transition } from '@headlessui/react'

const New = ({ isAuthorized, userID, journals }: any) => {

  const router = useRouter();
  const [journalTitle, setJournalTitle] = React.useState("");
  const [markdownContent, setMarkdownContent] = React.useState("");
  const [openModal, setOpenModal] = React.useState(false)
  const [pageId, setPageId] = React.useState('');


  const handleSubmit = async (e: any) => {
    const info = await new PassageUser().userInfo();

    try {
      const response = await fetch("/api/addJournal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: journalTitle,
          description: markdownContent,
          userID,
          username: info?.user_metadata?.username,
        }),
      })

      const data = await response.json()
      console.log(data)
    } catch (error) {
      console.log(error)
    }
    
  };

  const handleCancel = () => {
    router.push('/dashboard')
  }
 
  const handleEditorChange = (value: any) => setMarkdownContent(value);

  
  
  const handleGetNotionContent = async () => {
   const response =  await fetch('/api/getNotionContent', {
    method: "GET",
    body: JSON.stringify({
      pageId: "a80ec71bc9114f1a8a6af6c481b99fdd"
    })
   });
   const {data} = await response.json();
   setMarkdownContent(data)
    setOpenModal(false)
  }


  return (
    <>

    

      <Transition appear show={openModal} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setOpenModal(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
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
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Payment successful
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Your payment has been successfully submitted. We’ve sent
                      you an email with all of the details of your order.
                    </p>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={handleGetNotionContent}
                    >
                      Got it, thanks!
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      <div className="mx-auto mt-8 pl-8 pr-8 container">
        <div className="flex">
          <div className="grow">
            <div className="relative rounded-none">
              <input
                className="block w-full outline-none placeholder:text-label-4 dark:placeholder:text-dark-label-4 border-none text-label-1 dark:text-dark-label-1 bg-transparent dark:bg-dark-transparent focus:bg-transparent dark:focus:bg-dark-transparent rounded-none border-r-0 p-0 text-[20px] leading-[28px] sentry-unmask"
                autoComplete="off"
                placeholder="Enter your title"
                value={journalTitle}
                onChange={(e) => setJournalTitle(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <div className="flex items-center gap-4">
              <button onClick={handleCancel} className="py-1.5 whitespace-nowrap focus:outline-none inline-flex bg-fill-3 dark:bg-dark-fill-3 hover:bg-fill-2 dark:hover:bg-dark-fill-2 text-label-2 dark:text-dark-label-2 h-8 items-center rounded-lg px-4 text-md font-medium">
                Cancel
              </button>

              <button onClick={() => setOpenModal(true)}           className="rounded-md bg-black bg-opacity-20 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                Upload from Notion
              </button>


              <button
                onClick={handleSubmit}
                className="py-1.5 whitespace-nowrap flex h-8 items-center gap-1 rounded-lg px-4 text-md font-medium border"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="1em"
                  height="1em"
                  fill="currentColor"
                  className="h-4 w-4"
                >
                  <path
                    fill-rule="evenodd"
                    d="M22.707 1.293a1 1 0 01.237 1.037l-7 20a1 1 0 01-1.858.076l-3.844-8.648-8.648-3.844a1 1 0 01.076-1.858l20-7a1 1 0 011.037.237zM12.193 13.22l2.696 6.068 4.72-13.483-7.416 7.416zm6.001-8.83L4.711 9.111l6.067 2.696 7.416-7.416z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                Post
              </button>
            </div>
          </div>
        </div>

        <div className="flex w-full items-center justify-between pt-5">
          <div className="flex h-10 items-center gap-2 shrink-0">
            <button className="rounded font-medium items-center whitespace-nowrap focus:outline-none inline-flex hover:bg-fill-3 dark:hover:bg-dark-fill-3 text-gray-7 dark:text-dark-gray-7 h-6 w-6 justify-center p-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="1em"
                height="1em"
                fill="currentColor"
                className="h-4.5 w-4.5 text-gray-8 dark:text-dark-gray-8"
              >
                <path
                  fill-rule="evenodd"
                  d="M17 13H7v7a1 1 0 11-2 0V4a1 1 0 012 0v7h10V4a1 1 0 112 0v16a1 1 0 11-2 0v-7z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </button>
            <button className="rounded font-medium items-center whitespace-nowrap focus:outline-none inline-flex hover:bg-fill-3 dark:hover:bg-dark-fill-3 text-gray-7 dark:text-dark-gray-7 h-6 w-6 justify-center p-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="1em"
                height="1em"
                fill="currentColor"
                className="h-4.5 w-4.5 text-gray-8 dark:text-dark-gray-8"
              >
                <path
                  fill-rule="evenodd"
                  d="M17.436 11.633A5 5 0 0115 21H6a1 1 0 01-1-1V4a1 1 0 011-1h8a5 5 0 013.436 8.633zM15 13H7v6h8a3 3 0 100-6zm-1-2a3 3 0 100-6H7v6h7z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </button>
            <button className="rounded font-medium items-center whitespace-nowrap focus:outline-none inline-flex hover:bg-fill-3 dark:hover:bg-dark-fill-3 text-gray-7 dark:text-dark-gray-7 h-6 w-6 justify-center p-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="1em"
                height="1em"
                fill="currentColor"
                className="h-4.5 w-4.5 text-gray-8 dark:text-dark-gray-8"
              >
                <path
                  fill-rule="evenodd"
                  d="M10.86 19H13a1 1 0 110 2H6a1 1 0 110-2h2.765L13.14 5H11a1 1 0 110-2h7a1 1 0 110 2h-2.765L10.86 19z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </button>
            <div className="h-3 border-l border-divider-2 dark:border-gray-7"></div>
            <button className="rounded font-medium items-center whitespace-nowrap focus:outline-none inline-flex hover:bg-fill-3 dark:hover:bg-dark-fill-3 text-gray-7 dark:text-dark-gray-7 h-6 w-6 justify-center p-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="1em"
                height="1em"
                fill="currentColor"
                className="h-4.5 w-4.5 text-gray-8 dark:text-dark-gray-8"
              >
                <path
                  fill-rule="evenodd"
                  d="M7 6a1 1 0 011-1h13a1 1 0 110 2H8a1 1 0 01-1-1zm1 13a1 1 0 110-2h13a1 1 0 010 2H8zm0-6a1 1 0 110-2h13a1 1 0 010 2H8zM2.756 4.98l.236-1.18h2.22l-.92 4.6h-1.38l.684-3.42h-.84zm2.823 8.3l-.235 1.192H1.756l.174-.87.073-.117 1.911-1.498c.219-.178.368-.324.445-.434a.49.49 0 00.099-.287.208.208 0 00-.083-.18c-.067-.052-.176-.082-.335-.082a.897.897 0 00-.398.094 1.02 1.02 0 00-.342.272l-.12.144-.968-.702.118-.162c.193-.264.456-.473.786-.625.327-.15.684-.225 1.068-.225.318 0 .602.053.85.16.255.11.456.267.6.47.146.206.22.44.22.698 0 .298-.083.58-.247.839-.158.25-.424.518-.797.807l-.653.506h1.422zm-3.063 3.7l.245-1.18h3.345l-.166.867-.06.11-.93.869a1.205 1.205 0 01.737 1.144c-.001.327-.098.622-.29.881a1.856 1.856 0 01-.774.593c-.322.139-.685.208-1.087.208-.328 0-.636-.045-.924-.135a2.06 2.06 0 01-.743-.4l-.132-.114.688-1.05.173.147c.12.103.267.185.442.245.177.06.364.091.562.091.251 0 .435-.044.554-.124a.31.31 0 00.146-.282c0-.086-.025-.135-.08-.171-.076-.05-.213-.079-.41-.079h-.687l.173-.88.06-.108.674-.632H2.516z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </button>
            <button className="rounded font-medium items-center whitespace-nowrap focus:outline-none inline-flex hover:bg-fill-3 dark:hover:bg-dark-fill-3 text-gray-7 dark:text-dark-gray-7 h-6 w-6 justify-center p-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="1em"
                height="1em"
                fill="currentColor"
                className="h-4.5 w-4.5 text-gray-8 dark:text-dark-gray-8"
              >
                <path
                  fill-rule="evenodd"
                  d="M8 7a1 1 0 110-2h13a1 1 0 110 2H8zm0 6a1 1 0 110-2h13a1 1 0 110 2H8zm0 6a1 1 0 110-2h13a1 1 0 110 2H8zM2.952 6.85a1.201 1.201 0 111.698-1.7 1.201 1.201 0 01-1.698 1.7zm0 6a1.201 1.201 0 111.698-1.7 1.201 1.201 0 01-1.698 1.7zm0 6a1.201 1.201 0 111.698-1.7 1.201 1.201 0 01-1.698 1.7z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </button>
            <button className="rounded font-medium items-center whitespace-nowrap focus:outline-none inline-flex hover:bg-fill-3 dark:hover:bg-dark-fill-3 text-gray-7 dark:text-dark-gray-7 h-6 w-6 justify-center p-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 18 18"
                width="1em"
                height="1em"
                fill="currentColor"
                className="h-4.5 w-4.5 text-gray-8 dark:text-dark-gray-8"
              >
                <path d="M2.25 8.25h13.5a.75.75 0 100-1.5H2.25a.75.75 0 000 1.5zm13.5 1.5H2.25a.75.75 0 000 1.5h13.5a.75.75 0 100-1.5z"></path>
              </svg>
            </button>
            <div className="h-3 border-l border-divider-2 dark:border-gray-7"></div>
            <button className="rounded font-medium items-center whitespace-nowrap focus:outline-none inline-flex hover:bg-fill-3 dark:hover:bg-dark-fill-3 text-gray-7 dark:text-dark-gray-7 h-6 w-6 justify-center p-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="1em"
                height="1em"
                fill="currentColor"
                className="h-4.5 w-4.5 text-gray-8 dark:text-dark-gray-8"
              >
                <path
                  fill-rule="evenodd"
                  d="M5 4h14a3 3 0 013 3v10a3 3 0 01-3 3H5a3 3 0 01-3-3V7a3 3 0 013-3zm0 2a1 1 0 00-1 1v10a1 1 0 001 1h14a1 1 0 001-1V7a1 1 0 00-1-1H5zm4.027 6L6.906 9.879A1 1 0 018.32 8.464l2.475 2.475a1.5 1.5 0 010 2.122L8.32 15.536a1 1 0 11-1.414-1.415L9.027 12zM13 16a1 1 0 110-2h3a1 1 0 110 2h-3z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </button>
            <button className="rounded font-medium items-center whitespace-nowrap focus:outline-none inline-flex hover:bg-fill-3 dark:hover:bg-dark-fill-3 text-gray-7 dark:text-dark-gray-7 h-6 w-6 justify-center p-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="1em"
                height="1em"
                fill="currentColor"
                className="h-4.5 w-4.5 text-gray-8 dark:text-dark-gray-8"
              >
                <path
                  fill-rule="evenodd"
                  d="M13.27 5.02c.456.1.764.562.727 1.06l-.015.116-2.181 12c-.099.541-.578.893-1.07.784-.457-.1-.765-.562-.728-1.06l.015-.116 2.181-12c.099-.541.578-.893 1.07-.784zm4.65.37l.07.096 3.857 6c.178.277.2.614.067.906l-.067.123-3.857 6c-.304.473-.962.627-1.47.342-.47-.264-.646-.812-.425-1.268l.058-.104L19.678 12l-3.525-5.485c-.283-.44-.161-1.001.264-1.307l.103-.065a1.123 1.123 0 011.4.246zm-11.84 0c.3-.365.83-.49 1.28-.305l.12.058.103.065a.96.96 0 01.326 1.194l-.062.113L4.322 12l3.525 5.485.058.104c.221.456.046 1.005-.425 1.268a1.123 1.123 0 01-1.4-.246l-.07-.097-3.857-6-.067-.122a.939.939 0 010-.784l.067-.123 3.857-6 .07-.096z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </button>
            <button className="rounded font-medium items-center whitespace-nowrap focus:outline-none inline-flex hover:bg-fill-3 dark:hover:bg-dark-fill-3 text-gray-7 dark:text-dark-gray-7 h-6 w-6 justify-center p-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="1em"
                height="1em"
                fill="currentColor"
                className="h-4.5 w-4.5 text-gray-8 dark:text-dark-gray-8"
              >
                <path
                  fill-rule="evenodd"
                  d="M5.293 6.778A1 1 0 005 7.485V18a1 1 0 001 1h12a1 1 0 001-1V6a1 1 0 00-1-1H7.485a1 1 0 00-.707.293L5.293 6.778zM3 7.071a2 2 0 01.586-1.414l2.07-2.071A2 2 0 017.072 3H18a3 3 0 013 3v12a3 3 0 01-3 3H6a3 3 0 01-3-3V7.071z"
                  clip-rule="evenodd"
                ></path>
                <path d="M10.52 15.022l.98-5.393c.088-.48.543-.878 1.09-.758.49.108.757.575.725 1.011l-.001.018-.01.078-.981 5.393c-.088.48-.543.878-1.09.758-.49-.108-.757-.575-.725-1.011l.001-.018.01-.078zM17.454 12.996l-1.738 2.702a1.01 1.01 0 01-1.336.322.942.942 0 01-.4-1.235l.008-.018.042-.072 1.41-2.195-1.404-2.186a.938.938 0 01.25-1.274l.014-.011.071-.045.009-.004c.42-.236.961-.143 1.269.23l.012.015.05.068 1.735 2.701c.174.27.197.605.065.894l-.01.021-.047.087zM9.962 14.776l.004.01a.942.942 0 01-.4 1.234c-.42.236-.962.143-1.27-.23l-.012-.015-.049-.068-1.748-2.72-.047-.088-.005-.011a.93.93 0 010-.776l.01-.021.047-.086 1.748-2.72.05-.067.007-.008a1.012 1.012 0 011.16-.283l.018.007.09.044.087.056.009.006a.939.939 0 01.31 1.166l-.01.02-.044.079L8.505 12.5l1.416 2.202.04.074z"></path>
              </svg>
            </button>
            <button className="rounded font-medium items-center whitespace-nowrap focus:outline-none inline-flex hover:bg-fill-3 dark:hover:bg-dark-fill-3 text-gray-7 dark:text-dark-gray-7 h-6 w-6 justify-center p-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 18 18"
                width="1em"
                height="1em"
                fill="currentColor"
                className="h-4.5 w-4.5 text-gray-8 dark:text-dark-gray-8"
              >
                <path d="M7.54 9L3.127 4.589a.95.95 0 01-.278-.672V3.2a.95.95 0 01.95-.95h9.55a.748.748 0 01.53.22l1 1a.75.75 0 11-1.06 1.06l-.78-.78H4.41L8.99 8.328a.947.947 0 010 1.344L4.41 14.25h8.628l.78-.78a.75.75 0 011.061 1.06l-1 1a.748.748 0 01-.53.22H3.8a.95.95 0 01-.95-.95v-.717c0-.252.1-.494.278-.672L7.54 9z"></path>
              </svg>
            </button>
            <div className="h-3 border-l border-divider-2 dark:border-gray-7"></div>
            <button className="rounded font-medium items-center whitespace-nowrap focus:outline-none inline-flex p-1 hover:bg-fill-3 dark:hover:bg-dark-fill-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="1em"
                height="1em"
                fill="currentColor"
                className="h-4.5 w-4.5 text-gray-8 dark:text-dark-gray-8"
              >
                <path
                  fill-rule="evenodd"
                  d="M21 14.997V18a3 3 0 01-3 3H6a3 3 0 01-3-3V6a3 3 0 013-3h12a3 3 0 013 3v8.997zm-2-2.293V6a1 1 0 00-1-1H6a1 1 0 00-1 1v11.218l8.96-7.965a1 1 0 011.346.015L19 12.704zm0 2.731l-4.39-4.084L6.005 19H18a1 1 0 001-1v-2.565zM8.5 11a2.5 2.5 0 110-5 2.5 2.5 0 010 5zm0-2a.5.5 0 100-1 .5.5 0 000 1z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </button>
            <button className="rounded font-medium items-center whitespace-nowrap focus:outline-none inline-flex hover:bg-fill-3 dark:hover:bg-dark-fill-3 text-gray-7 dark:text-dark-gray-7 h-6 w-6 justify-center p-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="1em"
                height="1em"
                fill="currentColor"
                className="h-4.5 w-4.5 text-gray-8 dark:text-dark-gray-8"
              >
                <path d="M20.474 3.526a5.21 5.21 0 00-7.369 0l-2.947 2.948a5.21 5.21 0 000 7.368 1.042 1.042 0 101.474-1.474 3.126 3.126 0 010-4.42L14.579 5A3.126 3.126 0 0119 9.42l-2.947 2.947a1.042 1.042 0 001.473 1.474l2.948-2.947a5.21 5.21 0 000-7.369z"></path>
                <path d="M13.842 10.158a1.042 1.042 0 10-1.474 1.474 3.126 3.126 0 010 4.42L9.421 19A3.126 3.126 0 115 14.58l2.947-2.947a1.042 1.042 0 10-1.473-1.474l-2.948 2.947a5.21 5.21 0 107.369 7.369l2.947-2.948a5.21 5.21 0 000-7.368z"></path>
              </svg>
            </button>
            <div className="h-3 border-l border-divider-2 dark:border-gray-7"></div>
            <button className="rounded font-medium items-center whitespace-nowrap focus:outline-none inline-flex hover:bg-fill-3 dark:hover:bg-dark-fill-3 text-gray-7 dark:text-dark-gray-7 h-6 w-6 justify-center p-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 18 18"
                width="1em"
                height="1em"
                fill="currentColor"
                className="h-4.5 w-4.5 text-gray-8 dark:text-dark-gray-8"
              >
                <path d="M5.941 13.5c.659 0 1.18-.194 1.564-.582.439-.387.63-.886.63-1.495 0-.61-.191-1.08-.575-1.468a1.983 1.983 0 00-1.427-.609c-.301 0-.52.056-.658.11 0-.664.22-1.3.686-1.938a4.098 4.098 0 011.838-1.301V4.5c-1.372.388-2.47 1.08-3.292 2.132C3.911 7.685 3.5 8.931 3.5 10.315c0 .942.247 1.717.686 2.299.466.61 1.042.886 1.755.886zm6.392 0c.658 0 1.18-.194 1.59-.582.385-.387.577-.886.577-1.495 0-.61-.192-1.08-.604-1.468-.384-.387-.85-.609-1.399-.609-.301 0-.52.056-.658.11 0-.664.22-1.3.713-1.938.494-.609 1.098-1.052 1.838-1.301V4.5c-1.371.388-2.469 1.08-3.292 2.132-.822 1.053-1.234 2.299-1.234 3.683 0 .942.247 1.717.713 2.299.44.61 1.043.886 1.756.886z"></path>
              </svg>
            </button>
          </div> 
        </div>

        <div className="h-[calc(100vh_-_15rem)] flex">
          <div className="flex flex-1 min-h-0 grow">
            <Editor
              width="100%"
              className="border rounded-lg w-full "
              defaultLanguage="markdown"
              value={markdownContent}
              onChange={handleEditorChange}
              options={{
                lineNumbers: "off",
                minimap: {
                  enabled: false,
                },
              }}
            />
          </div>
          <div className="w-1/2 prose border p-4 overflow-scroll">
            <ReactMarkdown
              children={markdownContent}
              //   remarkPlugins={[remarkGfm]}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default New;

export const getServerSideProps = async (context: any) => {
  const loginProps = await getAuthenticatedUserFromSession(
    context.req,
    context.res
  );

  if (loginProps?.isAuthorized) {
    const supabase: any = getSupabase(loginProps.userId);
    const { data } = await supabase.from("journal").select();
    return {
      props: {
        isAuthorized: loginProps?.isAuthorized ?? false,
        userID: loginProps?.userId ?? "",
        journals: data ?? [],
      },
    };
  }
  return {
    redirect: {
      permanent: false,
      destination: "/"
    }
   
    // props: {
    //   isAuthorized: loginProps?.isAuthorized ?? false,
    //   userID: loginProps?.userId ?? "",
    // },
  };
};

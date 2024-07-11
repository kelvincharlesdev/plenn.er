

import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { InviteGuestsModal } from './invite-guests-modal'
import { ConfirmTripModal } from './confirm-trip-modal'
import { DestinationAndDateStep } from './steps/destination-and-date-step'
import { InviteGuestsStep } from './steps/invite-guests-step'
import { DateRange } from 'react-day-picker'
import { api } from '../../lib/axios'

export function CreateTripPage() {
    const navigate = useNavigate()

    const [isGuestsInputOpen, setIsGuestsInputOpen] = useState(false)
    const [isGuestsModalOpen, setIsGuestsModalOpen] = useState(false)
    const [isConfirmTripModalOpen, setIsConfirmTripModalOpen] = useState(false)

    const [destination, setDestination] = useState('')
    const [ownerName, setOwnerName] = useState('')
    const [ownerEmail, setOwnerEmail] = useState('')
    const [eventStartAndEndDates, setEventStartAndEndDates] = useState<DateRange | undefined>()


    const [emailsToInvite, setEmailsToInvite] = useState([
        'kelvincharlesdev@gmail.com'
    ])

    const openGuestsInput = () => {
        setIsGuestsInputOpen(true)
    }

    const closeGuestsInput = () => {
        setIsGuestsInputOpen(false)
    }

    const openGuestsModal = () => {
        setIsGuestsModalOpen(true)
    }
    const closeGuestsModal = () => {
        setIsGuestsModalOpen(false)
    }

    const openConfirmTripModal = () => {
        setIsConfirmTripModalOpen(true)
    }
    const closeConfirmTripModal = () => {
        setIsConfirmTripModalOpen(false)
    }

    const addNewEmailToInvite = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const data = new FormData(e.currentTarget)
        const email = data.get('email')?.toString()

        if (!email) {
            return
        }

        if (emailsToInvite.includes(email)) {
            return
        }

        setEmailsToInvite([
            ...emailsToInvite,
            email
        ])

        e.currentTarget.reset()

    }

    const removeEmailFromInvites = (emailToRemove: string) => {
        const newEmailList = emailsToInvite.filter(email => email !== emailToRemove)
        setEmailsToInvite(newEmailList)
    }


    const createTrip = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        console.log(destination);
        console.log(eventStartAndEndDates);
        console.log(ownerName);
        console.log(ownerEmail);
        console.log(emailsToInvite);

        if (!destination) {
            return
        }

        if (!eventStartAndEndDates?.from || !eventStartAndEndDates?.to) {
            return
        }

        if (emailsToInvite.length === 0) {
            return
        }

        if (!ownerName || !ownerEmail) {
            return
        }

        const response = await api.post('/trips', {
            destination,
            starts_at: eventStartAndEndDates.from,
            ends_at: eventStartAndEndDates.to,
            emails_to_invite: emailsToInvite,
            owner_name: ownerName,
            owner_email: ownerEmail
        })

        const { tripId } = response.data

        navigate(`/trips/${tripId}`)
    }

    return (
        <div className="h-screen flex items-center justify-center bg-pattern bg-no-repeat bg-center">
            <div className="max-w-3xl w-full px-6 text-center space-y-10">
                <div className='flex flex-col items-center gap-3'>
                    <img src="/logo.svg" alt="Logo Plenn.er" />

                    <p className="text-zinc-300 text-lg">Convide seus amigos e planeje sua próxima viagem!</p>
                </div>

                <div className='space-y-4'>

                    <DestinationAndDateStep
                        closeGuestsInput={closeGuestsInput}
                        isGuestsInputOpen={isGuestsInputOpen}
                        openGuestsInput={openGuestsInput}
                        setDestination={setDestination}
                        setEventStartAndEndDates={setEventStartAndEndDates}
                        eventStartAndEndDates={eventStartAndEndDates}
                    />

                    {isGuestsInputOpen && (
                        <InviteGuestsStep
                            emailsToInvite={emailsToInvite}
                            openConfirmTripModal={openConfirmTripModal}
                            openGuestsModal={openGuestsModal}
                        />
                    )}

                </div>



                <p className="text-sm text-zinc-500">
                    Ao planejar sua viagem pela plann.er você automaticamente concorda <br /> com nossos <a href="" className="text-zinc-300 underline">termos de uso</a> e <a href="" className="text-zinc-300 underline">políticas de privacidade.</a>
                </p>
            </div>

            {isGuestsModalOpen && (
                <InviteGuestsModal closeGuestsModal={closeGuestsModal} emailsToInvite={emailsToInvite} addNewEmailToInvite={addNewEmailToInvite} removeEmailFromInvites={removeEmailFromInvites} />
            )
            }

            {isConfirmTripModalOpen && (
                <ConfirmTripModal
                    closeConfirmTripModal={closeConfirmTripModal}
                    createTrip={createTrip}
                    setOwnerName={setOwnerName}
                    setOwnerEmail={setOwnerEmail}
                />

            )}



        </div >
    )
}



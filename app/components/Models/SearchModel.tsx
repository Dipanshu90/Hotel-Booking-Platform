"use client"

import qs from 'query-string';
import useSearchModel from "@/app/hooks/useSearchModel";
import Model from "./Model";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { Range } from "react-date-range";
import dynamic from "next/dynamic";
import CountrySelect, { CountrySelectValue } from "../Inputs/CountrySelect";
import { formatISO } from 'date-fns';
import Heading from '../Heading';
import Calendar from '../Inputs/Calendar';
import Counter from '../Inputs/Counter';
import RangeSlider from '../Inputs/RangeSlider'

enum STEPS {
    LOCATION = 0,
    DATE = 1,
    PRICE = 2,
    INFO = 3
}

const SearchModel = () => {
    const router = useRouter();
    const params = useSearchParams();
    const searchModel = useSearchModel();

    const [location, setLocation] = useState<CountrySelectValue>();
    const [step, setStep] = useState(STEPS.LOCATION);
    const [guestCount, setGuestCount] = useState(1);
    const [roomCount, setRoomCount] = useState(1);
    const [bathroomCount, setBathroomCount] = useState(1);
    const [dateRange, setDateRange] = useState<Range>({
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection'
    })
    const [price, setPrice] = useState(1);

    const Map = useMemo(() => dynamic(() => import('../Map'), {
        ssr: false
    }), [location]);

    const onBack = useCallback(() => {
        setStep((value) => value - 1);
    }, [])

    const onNext = useCallback(() => {
        setStep((value) => value + 1);
    }, [])

    const onSubmit = useCallback(async () => {
        if(step !== STEPS.INFO){
            return onNext();
        }

        let currentQuery = {};

        if(params) {
            currentQuery = qs.parse(params.toString());
        }

        const updatedQuery: any = {
            ...currentQuery,
            locationValue: location?.value,
            guestCount,
            roomCount,
            bathroomCount,
            price
        };

        if(dateRange.startDate) {
            updatedQuery.startDate = formatISO(dateRange.startDate);
        }

        if(dateRange.endDate) {
            updatedQuery.endDate = formatISO(dateRange.endDate);
        }

        const url = qs.stringifyUrl({
            url: '/',
            query: updatedQuery
        }, { skipNull: true });

        setStep(STEPS.LOCATION);
        searchModel.onClose();

        router.push(url);
    }, [
        searchModel,
        router,
        roomCount,
        bathroomCount,
        onNext,
        dateRange,
        step,
        location,
        guestCount,
        params,
        price
    ]);

    const actionLabel = useMemo(() => {
        if(step === STEPS.INFO){
            return 'Search';
        }
        return 'Next'
    }, [step]);

    const secondaryActionLabel = useMemo(() => {
        if(step === STEPS.LOCATION) {
            return undefined;
        }
        return 'Back'
    }, [step])

    let bodyContent = (
        <div
            className='
                flex
                flex-col
                gap-8
            '
        >
            <Heading 
                title="Where do you wanna go?"
                subtitle='Find the perfect location!'
            />
            <CountrySelect 
                value={location}
                onChange={(value) => setLocation(value as CountrySelectValue)}
            />
            <hr />
            <Map center={location?.latlng}/>
        </div>
    )

    if(step === STEPS.DATE) {
        bodyContent = (
            <div className='flex flex-col gap-8'>
                <Heading 
                    title='When do you plan to go?'
                    subtitle='Make sure everyone is free!'
                />
                <Calendar 
                    value={dateRange}
                    onChange={(value) => setDateRange(value.selection)}
                />
            </div>
        )
    }

    if(step === STEPS.PRICE) { 
        bodyContent = (
            <div className='flex flex-col gap-8'>
                <Heading 
                    title='Price'
                    subtitle='Select your max price!'
                />
                <RangeSlider
                    min={100}
                    max={1000}
                    price={price}
                    onChange={(value) => setPrice(value)}
                />
            </div>
        )
    }

    if(step === STEPS.INFO) { 
        bodyContent = (
            <div className='flex flex-col gap-8'>
                <Heading 
                    title='More Information'
                    subtitle='Find your perfect place!'
                />
                <Counter 
                    title="Guests"
                    subtitle='How many guests are coming?'
                    value={guestCount}
                    onChange={(value) => setGuestCount(value)}
                />
                <Counter 
                    title="Rooms"
                    subtitle='How many rooms do you need?'
                    value={roomCount}
                    onChange={(value) => setRoomCount(value)}
                />
                <Counter 
                    title="Bathrooms"
                    subtitle='How many bathrooms do you need?'
                    value={bathroomCount}
                    onChange={(value) => setBathroomCount(value)}
                />
            </div>
        )
    }

    return (
        <Model 
            isOpen={searchModel.isOpen}
            onClose={searchModel.onClose}
            onSubmit={onSubmit}
            title="Filters"
            secondaryAction={step === STEPS.LOCATION ? undefined : onBack}
            secondaryActionLabel={secondaryActionLabel}
            actionlabel={actionLabel}
            body={bodyContent}
        />
    );
}

export default SearchModel;
'use client';
import { useState } from 'react';
import {Theme, TextField, TextArea, Radio, Text, Button, RadioGroup} from '@radix-ui/themes';
import {
    CitySelect,
    CountrySelect,
    StateSelect,
} from "react-country-state-city";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faStar } from "@fortawesome/free-solid-svg-icons";
import { ImageOptimizerCache } from 'next/dist/server/image-optimizer';
import ImageUpload from './ImageUpload';
import { saveJobAction } from '../actions/jobActions';
import { redirect } from 'next/navigation';
import type { Job } from '@/models/Job';
import "react-country-state-city/dist/react-country-state-city.css"

export default function JobForm({orgId, jobDoc}:{orgId: string; jobDoc?:Job}) {

    const [countryId, setCountryId] = useState(jobDoc?.countryId || 0);
    const [stateId, setStateId] = useState(jobDoc?.stateId || 0);
    const [cityId, setCityId] = useState(jobDoc?.cityId || 0);
    const [countryName, setCountryName] = useState(jobDoc?.country || '');
    const [stateName, setStateName] = useState(jobDoc?.state || '');
    const [cityName, setCityName] = useState(jobDoc?.city || '');

    async function handleSaveJob(data:FormData) {
        data.set('country', countryName.toString());
        data.set('state', stateName.toString());
        data.set('city', cityName.toString());
        data.set('countryId', countryId.toString());
        data.set('stateId', stateId.toString());
        data.set('cityId', cityId.toString());
        data.set('orgId', orgId);
        const jobDoc = await saveJobAction(data);
        redirect(`/jobs/${jobDoc.orgId}`);
    }

    return (
        <Theme>
            <form 
                action={handleSaveJob} 
                className="container mt-6 flex flex-col gap-4">
                {jobDoc && (
                    <>
                        <input type='hidden' name="id" value={jobDoc?._id} />
                    </>
                )}
                <TextField.Root size="2" placeholder="Job title" name="title" defaultValue={jobDoc?.title || ""}/>
                <div className="grid sm:grid-cols-3 gap-6 *:grow">
                    <div className="flex flex-col gap-2">
                        Remote?
                        <RadioGroup.Root defaultValue={jobDoc?.remote || 'hybrid'} name="remote">
                            <RadioGroup.Item value="onsite">On-site</RadioGroup.Item>
                            <RadioGroup.Item value="hybrid">Hybrid-remote</RadioGroup.Item>
                            <RadioGroup.Item value="remote">Fully remote</RadioGroup.Item>
                        </RadioGroup.Root>
                    </div>

                    <div className="flex flex-col gap-2">
                        Full time?
                        <RadioGroup.Root defaultValue={jobDoc?.type || 'full'} name="type">
                            <RadioGroup.Item value="project">Project</RadioGroup.Item>
                            <RadioGroup.Item value="part">Part-time</RadioGroup.Item>
                            <RadioGroup.Item value="full">Full-time</RadioGroup.Item>
                        </RadioGroup.Root>
                    </div>

                    <div>
                        Salary 
                        <TextField.Root name="salary" defaultValue={jobDoc?.salary || ''}>
                            <TextField.Slot>
                                $
                            </TextField.Slot>
                            <TextField.Slot>
                                k/year
                            </TextField.Slot>
                        </TextField.Root>
                    </div>
                </div>
                <div>
                    Location
                    <div className="flex flex-col sm:flex-row gap-4 *:grow">
                        <CountrySelect
                            defaultValue={countryId ? {id:countryId,name:countryName} : 0}
                            onChange={(e:any) => {
                                setCountryId(e.id);
                                setCountryName(e.name);
                            }}
                            placeHolder="Select Country"
                        />
                        <StateSelect
                            defaultValue={stateId ? {id:stateId,name:stateName} : 0}
                            countryid={countryId}
                            onChange={(e:any) => {
                                setStateId(e.id);
                                setStateName(e.name);
                            }}
                            placeHolder="Select State"
                        />
                        <CitySelect
                            defaultValue={cityId ? {id:cityId,name:cityName} : 0}
                            countryid={countryId}
                            stateid={stateId}
                            onChange={(e:any) => {
                                setCityId(e.id);
                                setCityName(e.name);
                            }}
                            placeHolder="Select City"
                        />
                    </div>
                </div>
                <div className="sm:flex">
                    <div className='w-1/3'>
                        <h3>Job Icon</h3>
                            <ImageUpload name="jobIcon" icon={faStar} defaultValue={jobDoc?.jobIcon as string}/>
                    </div>
                    <div className='grow'>
                        <h3>Contact Info</h3>
                        <div className='flex gap-2'>
                            <div>
                                <ImageUpload name="contactPhoto" icon={faUser} defaultValue={jobDoc?.contactPhoto as string}/>
                            </div>
                            <div className='grow *:border flex flex-col gap-1'>
                                <TextField.Root placeholder='John Doe' name='contactName' defaultValue={jobDoc?.contactName || ""}/>
                                <TextField.Root placeholder='Phone' type='tel' name='contactPhone' defaultValue={jobDoc?.contactPhone || ""}/>
                                <TextField.Root placeholder='Email'type='email'name='contactEmail'defaultValue={jobDoc?.contactEmail || ""}/>
                            </div>
                        </div>
                    </div>
                </div>
                <TextArea placeholder="Job description …" resize="vertical" name='description' defaultValue={jobDoc?.description || ""} />
                <div className='flex justify-center'>
                    <Button color="blue" size="4">Save</Button>
                </div>
            </form>
        </Theme>
    );
}